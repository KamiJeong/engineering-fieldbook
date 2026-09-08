#!/usr/bin/env python3
"""Exercise the audit CLI in temporary copies; emit evidence as JSON to stdout."""
from copy import deepcopy
from datetime import datetime, timedelta, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import tempfile

import yaml

ROOT = Path(__file__).resolve().parents[3]
TOOL = ROOT / "skills/refresh-fieldbook/scripts/fieldbook.py"
spec = importlib.util.spec_from_file_location("fieldbook", TOOL)
fb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fb)
KO = Path("glossary/ko/oidc.md")
EN = Path("glossary/en/oidc.md")


def snapshot(root):
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(root.rglob("*")) if p.is_file()}


def write(path, meta, body):
    path.write_text("---\n" + yaml.safe_dump(meta, sort_keys=False, allow_unicode=True)
                    + "---\n" + body, encoding="utf-8")


def main():
    now = datetime.now(timezone.utc).replace(microsecond=0)
    results = []
    mutations = ("baseline", "verification-only", "korean-change", "english-change",
                 "missing-translation", "invalid-metadata", "broken-link", "stale-boundary",
                 "invalid-root", "repair-local-link", "hash-is-not-semantic-review")
    with tempfile.TemporaryDirectory(prefix="fieldbook-audit-experiment-") as directory:
        base = Path(directory) / "base"
        shutil.copytree(ROOT, base, ignore=shutil.ignore_patterns(".git", ".venv", "__pycache__", "evidence"))
        # Run translations/stale/validate/links, not full audit: the experiment's own
        # evidence links are intentionally omitted from isolated copies.
        original_ko = (base / KO).read_bytes()
        original_en = (base / EN).read_bytes()
        for name in mutations:
            root = Path(directory) / name
            shutil.copytree(base, root)
            km, kb = fb.parse((root / KO).read_text())
            em, eb = fb.parse((root / EN).read_text())
            mode, expected_exit, expected_code = "translations", 0, "SYNCED"
            as_of = now
            if name == "verification-only":
                km["verified"].append({"by": "process:isolated-experiment", "at": now.isoformat()})
                km["stale_after"] = (now + timedelta(days=km["freshness"]["review_days"])).isoformat()
                write(root / KO, km, kb)
                assert fb.parse((root / KO).read_text())[1] == kb
            elif name == "korean-change":
                write(root / KO, km, kb + "\n격리 fixture의 변경 감지용 문장.\n")
                expected_exit, expected_code = 1, "TRANSLATION_STALE"
            elif name == "english-change":
                write(root / EN, em, eb + "\nAn isolated fixture edit.\n")
                expected_exit, expected_code = 1, "CONTENT_DIVERGED"
            elif name == "missing-translation":
                (root / EN).unlink()
                expected_exit, expected_code = 1, "MISSING_TRANSLATION"
            elif name == "invalid-metadata":
                (root / KO).write_text("---\ntype: A\ntype: B\n---\n# Invalid fixture\n")
                mode, expected_exit, expected_code = "validate", 1, "PARSE_ERROR"
            elif name in ("broken-link", "repair-local-link"):
                write(root / KO, km, kb + "\n[Broken](./missing-experiment-fixture.md)\n")
                mode, expected_exit, expected_code = "links", 1, "BROKEN_LINK"
            elif name == "stale-boundary":
                mode, expected_exit, expected_code = "stale", 1, "STALE"
                as_of = fb.instant(km["stale_after"])
            elif name == "invalid-root":
                mode, expected_exit, expected_code = "audit", 2, None
            elif name == "hash-is-not-semantic-review":
                # Intentionally wrong English in a disposable fixture. Updating a hash
                # must never be presented as proof of a correct translation.
                eb = "\n# Deliberately unrelated fixture\n\nThis entry describes a database backup.\n"
                em["translation"]["target_fingerprint"] = fb.fingerprint(em, eb)
                write(root / EN, em, eb)
            command = [sys.executable, str(TOOL), mode, "--root",
                       str(root / "absent") if name == "invalid-root" else str(root),
                       "--as-of", as_of.isoformat(), "--json"]
            before = snapshot(root)
            run = subprocess.run(command, capture_output=True, text=True)
            after = snapshot(root)
            report = json.loads(run.stdout) if run.stdout else {}
            codes = sorted({f["code"] for f in report.get("findings", [])})
            passed = run.returncode == expected_exit and (expected_code is None or expected_code in codes) and before == after
            result = {"case": name, "mode": mode, "as_of": as_of.isoformat(),
                      "expected_exit": expected_exit, "actual_exit": run.returncode,
                      "expected_code": expected_code, "codes": codes, "read_only": before == after,
                      "passed": passed, "report": report,
                      "stderr": run.stderr.replace(str(root), "<fixture>").replace(str(TOOL), "<fieldbook.py>")}
            if name == "verification-only":
                result["body_preserved"] = fb.parse((root / KO).read_text())[1] == kb
                original = fb.parse(original_ko.decode())[0]
                result["generated_preserved"] = km["generated"] == original["generated"]
                result["passed"] &= result["body_preserved"] and result["generated_preserved"]
            if name == "repair-local-link":
                (root / KO).write_bytes(original_ko)
                recovery_before = snapshot(root)
                recovery = subprocess.run(command, capture_output=True, text=True)
                recovery_report = json.loads(recovery.stdout)
                result["recovery"] = {"exit": recovery.returncode,
                                      "broken_link_remaining": any(f["code"] == "BROKEN_LINK" and f["path"] == str(KO) for f in recovery_report["findings"]),
                                      "original_bytes_restored": (root / KO).read_bytes() == original_ko,
                                      "read_only": recovery_before == snapshot(root)}
                result["passed"] &= not result["recovery"]["broken_link_remaining"] and result["recovery"]["read_only"]
            results.append(result)
        assert (base / KO).read_bytes() == original_ko and (base / EN).read_bytes() == original_en
    commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    result = {"executed_at": now.isoformat(), "baseline_commit": commit,
              "python": platform.python_version(), "platform": platform.system() + " " + platform.machine(),
              "pyyaml": yaml.__version__, "tool_sha256": hashlib.sha256(TOOL.read_bytes()).hexdigest(),
              "reproducer_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
              "seed_sha256": {str(KO): hashlib.sha256(original_ko).hexdigest(), str(EN): hashlib.sha256(original_en).hexdigest()},
              "passed": all(r["passed"] for r in results), "cases": results}
    print(json.dumps(result, ensure_ascii=False, indent=2, default=str))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    sys.exit(main())
