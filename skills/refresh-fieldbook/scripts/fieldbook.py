#!/usr/bin/env python3
"""Read-only Fieldbook checks; a repository profile, not a full OKF certifier."""
import argparse
from collections import defaultdict
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

try:
    import yaml
except ImportError:
    print("PyYAML is required: python3 -m pip install -r requirements.txt", file=sys.stderr)
    sys.exit(2)

SCOPES = {"knowledge", "glossary", "decisions", "experiments", "failures",
          "lessons", "checklists", "runbooks"}
PAYLOAD = SCOPES | {"policies", "templates"}
RESERVED = {"index.md", "log.md"}
FINGERPRINT_FIELDS = ("type", "title", "description", "concept_id", "language",
                      "tags", "resource", "sources", "status")
TRANSLATION_STATES = {"SYNCED", "TRANSLATION_STALE", "MISSING_TRANSLATION",
                      "CONTENT_DIVERGED", "NEEDS_HUMAN_REVIEW"}


class UniqueLoader(yaml.SafeLoader):
    pass


def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str):
            raise ValueError("YAML mapping keys must be strings")
        if key in result:
            raise ValueError(f"duplicate YAML key: {key}")
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def parse(text):
    text = text.replace("\r\n", "\n")
    match = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
    if not match:
        if text.startswith("---\n"):
            raise ValueError("unclosed YAML frontmatter")
        return None, text
    meta = yaml.load(match.group(1), Loader=UniqueLoader)
    if not isinstance(meta, dict):
        raise ValueError("frontmatter must be a mapping")
    return meta, text[match.end():]


def instant(value):
    if not isinstance(value, (str, datetime)):
        raise ValueError("expected ISO 8601 datetime with UTC offset")
    dt = value if isinstance(value, datetime) else datetime.fromisoformat(value.replace("Z", "+00:00"))
    if dt.tzinfo is None or dt.utcoffset() is None:
        raise ValueError("datetime needs an explicit UTC offset")
    return dt.astimezone(timezone.utc)


def fingerprint(meta, body):
    payload = {k: meta[k] for k in FINGERPRINT_FIELDS if k in meta}
    data = json.dumps({"metadata": payload, "body": body.replace("\r\n", "\n")},
                      ensure_ascii=False, sort_keys=True, separators=(",", ":"), default=str)
    return "sha256:" + hashlib.sha256(data.encode("utf-8")).hexdigest()


def events(meta):
    value = meta.get("verified", [])
    return [value] if isinstance(value, dict) else value


def language_path(path):
    parts = path.parts
    offset = 2 if parts[:2] == ("decisions", "ADR") else 1
    return parts[offset] if len(parts) > offset else None


def pair_path(path):
    parts = list(path.parts)
    offset = 2 if parts[:2] == ["decisions", "ADR"] else 1
    if len(parts) > offset:
        parts[offset] = "{language}"
    return "/".join(parts)


class Audit:
    def __init__(self, root, now):
        self.root, self.now = root, now
        self.findings, self.docs = [], {}

    def report(self, code, path, message, level="issue"):
        self.findings.append(dict(code=code, path=str(path), message=message, level=level))

    def load(self):
        candidates = set(self.root.glob("*.md"))
        for scope in PAYLOAD | {"skills"}:
            candidates.update((self.root / scope).rglob("*.md"))
        for path in sorted(candidates):
            rel = path.relative_to(self.root)
            if any(part.startswith(".") or part == "__pycache__" for part in rel.parts):
                continue
            if path.is_symlink() or not path.resolve().is_relative_to(self.root):
                self.report("UNSAFE_PATH", rel, "symlink or path outside repository")
                continue
            try:
                self.docs[rel] = parse(path.read_text(encoding="utf-8"))
            except (ValueError, yaml.YAMLError, OSError) as exc:
                self.report("PARSE_ERROR", rel, str(exc))

    def knowledge(self):
        return {p: d for p, d in self.docs.items()
                if p.parts[0] in SCOPES and p.name not in RESERVED and isinstance(d[0], dict)}

    def validate(self):
        if Path("index.md") not in self.docs:
            self.report("PROFILE_ROOT", "index.md", "root index missing")
        for path, (meta, body) in self.docs.items():
            if path.parts[0] == "skills":
                continue
            if path.name in RESERVED:
                if path == Path("index.md"):
                    if meta != {"okf_version": "0.2"}:
                        self.report("PROFILE_VERSION", path, 'expected only okf_version: "0.2"')
                elif meta is not None:
                    self.report("RESERVED_FRONTMATTER", path, "non-root index/log cannot have frontmatter")
                if path.name == "log.md":
                    headings = re.findall(r"^## (.+)$", body, re.M)
                    valid = []
                    for heading in headings:
                        try:
                            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", heading):
                                raise ValueError()
                            valid.append(datetime.strptime(heading, "%Y-%m-%d"))
                        except ValueError:
                            self.report("LOG_DATE", path, f"invalid date heading: {heading}")
                    if valid != sorted(valid, reverse=True):
                        self.report("LOG_ORDER", path, "dates must be newest first")
                continue
            if not meta or not isinstance(meta.get("type"), str) or not meta["type"].strip():
                self.report("OKF_TYPE", path, "non-reserved Markdown needs a non-empty type")
                continue
            if "status" in meta and meta["status"] not in ("draft", "stable", "deprecated"):
                self.report("STATUS", path, "expected draft, stable, or deprecated; stale is derived")
            if "generated" in meta:
                self.validate_event(path, "generated", meta["generated"], required_at=False)
            verification = events(meta)
            if not isinstance(verification, list):
                self.report("VERIFIED", path, "expected list or single mapping")
            else:
                for event in verification:
                    self.validate_event(path, "verified", event)
            if "stale_after" in meta:
                self.validate_time(path, "stale_after", meta["stale_after"])
            sources = meta.get("sources", [])
            if not isinstance(sources, list):
                self.report("SOURCES", path, "expected a list")
                continue
            ids = set()
            for source in sources:
                if not isinstance(source, dict) or not isinstance(source.get("resource"), str) or not source["resource"].strip():
                    self.report("SOURCE_RESOURCE", path, "source entry needs non-empty resource")
                    continue
                sid = source.get("id")
                if sid is not None:
                    if not isinstance(sid, str) or not sid or sid in ids:
                        self.report("SOURCE_ID", path, "source IDs must be unique non-empty strings")
                    else:
                        ids.add(sid)
                if "last_modified" in source:
                    self.validate_time(path, "sources.last_modified", source["last_modified"])

    def validate_time(self, path, field, value):
        try:
            return instant(value)
        except (ValueError, TypeError, OverflowError) as exc:
            self.report("TIMESTAMP", path, f"{field}: {exc}")

    def validate_event(self, path, field, value, required_at=True):
        if not isinstance(value, dict) or not isinstance(value.get("by"), str) or not value["by"].strip():
            self.report("ACTOR", path, f"{field} needs a non-empty by actor")
            return
        if required_at or "at" in value:
            self.validate_time(path, field + ".at", value.get("at"))

    def profile(self):
        for path, (meta, body) in self.knowledge().items():
            for key in ("title", "description", "concept_id", "language", "status"):
                if not isinstance(meta.get(key), str) or not meta[key].strip():
                    self.report("PROFILE_REQUIRED", path, f"non-empty {key} required")
            cid = meta.get("concept_id")
            if not isinstance(cid, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", cid):
                self.report("CONCEPT_ID", path, "use a stable kebab-case concept_id")
            if meta.get("language") not in ("ko", "en") or language_path(path) != meta.get("language"):
                self.report("LANGUAGE_PATH", path, "language and documented scope path must agree")
            if path.parts[0] == "decisions" and path.parts[1] != "ADR":
                self.report("ADR_PATH", path, "decisions belong under decisions/ADR/{ko,en}")
            if meta.get("learning_state", "backlog") not in ("backlog", "learning", "experimenting", "applied", "mastered"):
                self.report("LEARNING_STATE", path, "unknown personal learning state")
            generated = meta.get("generated")
            if not isinstance(generated, dict) or not generated.get("at"):
                self.report("PROFILE_GENERATED", path, "generated.by and generated.at required")
            elif self.validate_time(path, "generated.at", generated["at"]):
                if instant(generated["at"]) > self.now:
                    self.report("FUTURE_EVENT", path, "generated.at is after audit time")
            if not meta.get("sources"):
                self.report("SOURCE_REVIEW", path, "add provenance or explicitly review personal evidence")
            source_ids = {s.get("id") for s in meta.get("sources", []) if isinstance(s, dict) and isinstance(s.get("id"), str)} if isinstance(meta.get("sources", []), list) else set()
            text = strip_code(body)
            definitions = set(re.findall(r"^\[\^([^\]]+)\]:", text, re.M))
            references = set(re.findall(r"\[\^([^\]]+)\](?!:)", text))
            for label in references:
                if label not in definitions or label not in source_ids:
                    self.report("PROVENANCE_FOOTNOTE", path, f"{label} needs a definition and sources[].id")
            if meta.get("status") == "deprecated":
                self.report("DEPRECATED", path, "retained historical link; inspect replacement", "info")

    def stale(self):
        for path, (meta, _) in self.knowledge().items():
            freshness = meta.get("freshness")
            if not isinstance(freshness, dict) or freshness.get("mode") not in ("current", "historical"):
                self.report("FRESHNESS_POLICY", path, "freshness.mode must be current or historical")
                continue
            if freshness["mode"] == "historical":
                self.report("HISTORICAL", path, "no automatic current-fact TTL", "info")
                continue
            days = freshness.get("review_days")
            if type(days) is not int or not 0 < days <= 36500:
                self.report("REVIEW_DAYS", path, "review_days must be 1..36500")
                continue
            if freshness.get("volatility") not in ("high", "medium", "low") or not isinstance(freshness.get("reason"), str) or not freshness["reason"].strip():
                self.report("FRESHNESS_POLICY", path, "volatility and a reason are required")
            verified = events(meta)
            dates = []
            if isinstance(verified, list):
                for event in verified:
                    if isinstance(event, dict):
                        try:
                            dt = instant(event.get("at"))
                            if dt > self.now:
                                self.report("FUTURE_EVENT", path, "verification is after audit time")
                            else:
                                dates.append(dt)
                        except (ValueError, TypeError, OverflowError):
                            pass
            try:
                generated = instant(meta.get("generated", {}).get("at"))
            except (ValueError, TypeError, AttributeError, OverflowError):
                generated = None
            latest = max(dates) if dates else None
            if latest is None or generated is None or latest < generated:
                self.report("UNVERIFIED", path, "no verification covering the current generated content")
            deadline = self.validate_time(path, "stale_after", meta.get("stale_after"))
            if latest:
                expected = latest + timedelta(days=days)
                if deadline and deadline != expected:
                    self.report("FRESHNESS_MISMATCH", path, f"expected {expected.isoformat()}")
                if self.now >= expected:
                    self.report("VERIFICATION_OLD", path, "last verification exceeds review_days")
            if deadline and self.now >= deadline:
                self.report("STALE", path, f"due since {deadline.isoformat()}")

    def translations(self):
        grouped = defaultdict(lambda: defaultdict(list))
        for path, (meta, body) in self.knowledge().items():
            cid, lang = meta.get("concept_id"), meta.get("language")
            if isinstance(cid, str) and lang in ("ko", "en"):
                grouped[cid][lang].append((path, meta, body))
            else:
                self.report("NEEDS_HUMAN_REVIEW", path, "missing valid concept_id/language")
        for cid, pair in grouped.items():
            if any(len(items) != 1 for items in pair.values()):
                self.report("DUPLICATE_CONCEPT", cid, "each concept_id must be unique per language")
                continue
            if set(pair) != {"ko", "en"}:
                missing = "en" if "ko" in pair else "ko"
                self.report("MISSING_TRANSLATION", cid, f"missing language: {missing}")
                continue
            kp, km, kb = pair["ko"][0]
            ep, em, eb = pair["en"][0]
            tr = em.get("translation")
            if (pair_path(kp) != pair_path(ep) or km.get("type") != em.get("type")
                    or not isinstance(tr, dict)):
                self.report("NEEDS_HUMAN_REVIEW", ep, "pair path/type mismatch or missing translation metadata")
                continue
            if tr.get("source_language") != "ko" or tr.get("source_concept_id") != cid:
                self.report("NEEDS_HUMAN_REVIEW", ep, "translation must reference the Korean concept")
                continue
            try:
                synced = instant(tr.get("synced_at"))
                if synced > self.now:
                    raise ValueError("sync is after audit time")
            except (ValueError, TypeError, OverflowError):
                self.report("NEEDS_HUMAN_REVIEW", ep, "valid, non-future synced_at required")
                continue
            if (not isinstance(tr.get("review_status"), str) or tr["review_status"] not in TRANSLATION_STATES or
                    any(not isinstance(tr.get(k), str) or not re.fullmatch(r"sha256:[a-f0-9]{64}", tr[k])
                        for k in ("source_fingerprint", "target_fingerprint"))):
                self.report("NEEDS_HUMAN_REVIEW", ep, "invalid review_status or fingerprint")
                continue
            source_changed = fingerprint(km, kb) != tr["source_fingerprint"]
            target_changed = fingerprint(em, eb) != tr["target_fingerprint"]
            state = tr["review_status"]
            if state in ("NEEDS_HUMAN_REVIEW", "CONTENT_DIVERGED"):
                code = state
            elif target_changed:
                code = "CONTENT_DIVERGED"
            elif source_changed:
                code = "TRANSLATION_STALE"
            else:
                code = state
            self.report(code, ep, f"{cid}: source_changed={source_changed}, target_changed={target_changed}; semantic review remains separate",
                        "info" if code == "SYNCED" else "issue")

    def links(self):
        external = set()
        indexed = set()
        for path, (meta, body) in self.docs.items():
            text = strip_code(body)
            definitions = dict(re.findall(r"^ {0,3}\[([^\]^]+)\]:\s*<?([^\s>]+)>?", text, re.M))
            definitions = {k.casefold(): v for k, v in definitions.items()}
            targets = re.findall(r"!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+[^)]*)?\)", text)
            # Adjacent footnotes [^a][^b] are citations, not a full reference link.
            for label, ref in re.findall(r"\[(?!\^)([^\]\n]+)\]\[([^\]\n]*)\]", text):
                key = (ref or label).casefold()
                if key not in definitions:
                    self.report("BROKEN_REFERENCE", path, f"undefined reference: {key}")
                else:
                    targets.append(definitions[key])
            targets.extend(definitions.values())
            if isinstance(meta, dict):
                if isinstance(meta.get("resource"), str):
                    targets.append(meta["resource"])
                sources = meta.get("sources", [])
                if isinstance(sources, list):
                    targets.extend(s["resource"] for s in sources if isinstance(s, dict) and isinstance(s.get("resource"), str))
            for target in set(targets):
                target = target.strip("<>")
                try:
                    url = urlsplit(target)
                except ValueError:
                    self.report("MALFORMED_LINK", path, target)
                    continue
                if url.scheme in ("http", "https"):
                    external.add(target)
                    continue
                if url.scheme or not url.path or " " in url.path:
                    continue
                # Plain scope descriptors are allowed in OKF sources, not assumed paths.
                if not Path(url.path).suffix and "/" not in url.path:
                    continue
                dest = (self.root / unquote(url.path.lstrip("/")) if url.path.startswith("/")
                        else self.root / path.parent / unquote(url.path)).resolve()
                if not dest.is_relative_to(self.root):
                    self.report("LINK_OUTSIDE_ROOT", path, target)
                elif not dest.exists():
                    self.report("BROKEN_LINK", path, target)
                elif path.name == "index.md":
                    indexed.add(dest.relative_to(self.root))
        for path in self.knowledge():
            if path not in indexed:
                self.report("UNINDEXED", path, "add a link from a scope index")
        for target in sorted(external):
            self.report("EXTERNAL_UNCHECKED", "external", target, "info")


def strip_code(body):
    lines, fence = [], None
    for line in body.splitlines():
        match = re.match(r"^\s*(`{3,}|~{3,})(.*)$", line)
        if match:
            marker, rest = match.groups()
            if fence is None:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence) and not rest.strip():
                fence = None
            continue
        if fence is None:
            lines.append(re.sub(r"`+[^`]*`+", "", line))
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("audit", "validate", "stale", "translations", "links", "fingerprint"))
    parser.add_argument("path", nargs="?", help="root-relative document path for fingerprint")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[3])
    parser.add_argument("--as-of", help="ISO 8601 datetime with explicit UTC offset")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)
    root = args.root.resolve()
    if not root.is_dir() or not (root / "index.md").is_file():
        parser.error("--root must contain the Fieldbook root index.md")
    try:
        now = instant(args.as_of) if args.as_of else datetime.now(timezone.utc)
    except (ValueError, TypeError) as exc:
        parser.error(str(exc))
    if args.mode == "fingerprint":
        if not args.path:
            parser.error("fingerprint requires a document path")
        try:
            path = (root / args.path).resolve()
            if not path.is_relative_to(root):
                raise ValueError("document must be inside root")
            meta, body = parse(path.read_text(encoding="utf-8"))
            if not meta:
                raise ValueError("document needs frontmatter")
            result = fingerprint(meta, body)
        except (ValueError, OSError, yaml.YAMLError) as exc:
            parser.error(str(exc))
        print(json.dumps({"fingerprint": result}) if args.json else result)
        return 0
    if args.path:
        parser.error("path is only supported by fingerprint; use --root for audit scope")
    audit = Audit(root, now)
    audit.load()
    # Every mode first diagnoses malformed metadata instead of crashing on it.
    audit.validate()
    if args.mode == "audit":
        audit.profile()
    for mode in ("stale", "translations", "links"):
        if args.mode in ("audit", mode):
            getattr(audit, mode)()
    issues = sum(f["level"] == "issue" for f in audit.findings)
    if args.json:
        print(json.dumps({"mode": args.mode, "as_of": now.isoformat(), "documents": len(audit.docs),
                          "issues": issues, "findings": audit.findings}, ensure_ascii=False, indent=2))
    else:
        for f in audit.findings:
            print(f"{f['code']} {f['path']}: {f['message']}")
        print(f"{args.mode}: {len(audit.docs)} Markdown files scanned; {issues} issue(s). External facts and semantic equivalence require review.")
    return 1 if issues else 0


if __name__ == "__main__":
    sys.exit(main())
