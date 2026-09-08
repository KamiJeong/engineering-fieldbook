"""Behavior checks for maintenance invariants; all fixtures live in temp directories."""
from copy import deepcopy
from datetime import timedelta
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import yaml
import fieldbook as fb


class FieldbookTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.now = fb.instant("2026-09-08T03:00:00Z")
        self.ko = Path("knowledge/ko/testing/sample.md")
        self.en = Path("knowledge/en/testing/sample.md")
        self.kbody = "\n# 예제\n\n근거.[^spec]\n\n[^spec]: Specification\n"
        self.ebody = "\n# Example\n\nEvidence.[^spec]\n\n[^spec]: Specification\n"
        self.kmeta = dict(type="Concept", title="예제", description="설명", concept_id="sample",
                          language="ko", status="stable", generated={"by": "test/1", "at": self.now},
                          verified=[{"by": "test/1", "at": self.now}],
                          stale_after=self.now + timedelta(days=60),
                          freshness={"mode": "current", "volatility": "high", "review_days": 60, "reason": "SDK"},
                          sources=[{"id": "spec", "resource": "https://example.com/spec"}])
        self.emeta = deepcopy(self.kmeta)
        self.emeta.update(language="en", title="Example", description="Description")
        self.emeta["translation"] = dict(source_language="ko", source_concept_id="sample",
                                         source_fingerprint=fb.fingerprint(self.kmeta, self.kbody),
                                         target_fingerprint=fb.fingerprint(self.emeta, self.ebody),
                                         synced_at=self.now, review_status="SYNCED")
        (self.root / "index.md").write_text('---\nokf_version: "0.2"\n---\n\n# Root\n\n'
                                         f'[KO]({self.ko})\n[EN]({self.en})\n')
        self.write(self.ko, self.kmeta, self.kbody)
        self.write(self.en, self.emeta, self.ebody)

    def write(self, path, meta, body):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("---\n" + yaml.safe_dump(meta, allow_unicode=True) + "---\n" + body)

    def audit(self, now=None):
        audit = fb.Audit(self.root, now or self.now)
        audit.load()
        audit.validate()
        audit.profile()
        audit.stale()
        audit.translations()
        audit.links()
        return audit

    def codes(self, now=None):
        return {f["code"] for f in self.audit(now).findings}

    def test_valid_pair_and_unknown_extensions(self):
        self.kmeta["future_extension"] = {"anything": True}
        self.write(self.ko, self.kmeta, self.kbody)
        audit = self.audit()
        self.assertEqual([], [f for f in audit.findings if f["level"] == "issue"])
        self.assertIn("SYNCED", self.codes())

    def test_verify_only_preserves_translation_fingerprint(self):
        self.kmeta["verified"].append({"by": "process:check", "at": self.now + timedelta(days=1)})
        self.kmeta["stale_after"] += timedelta(days=1)
        self.write(self.ko, self.kmeta, self.kbody)
        self.assertEqual(fb.fingerprint(self.kmeta, self.kbody), self.emeta["translation"]["source_fingerprint"])
        self.assertIn("SYNCED", self.codes(self.now + timedelta(days=1)))

    def test_korean_change_marks_translation_stale(self):
        self.write(self.ko, self.kmeta, self.kbody + "새로운 사실.\n")
        self.assertIn("TRANSLATION_STALE", self.codes())

    def test_english_and_both_changes_are_divergence_signals(self):
        self.write(self.en, self.emeta, self.ebody + "Independent edit.\n")
        self.assertIn("CONTENT_DIVERGED", self.codes())
        self.write(self.ko, self.kmeta, self.kbody + "원문 변경.\n")
        self.assertIn("CONTENT_DIVERGED", self.codes())

    def test_human_review_is_not_automatically_cleared(self):
        self.emeta["translation"]["review_status"] = "NEEDS_HUMAN_REVIEW"
        self.write(self.en, self.emeta, self.ebody)
        self.assertIn("NEEDS_HUMAN_REVIEW", self.codes())
        self.assertNotIn("SYNCED", self.codes())

    def test_missing_language_both_directions(self):
        (self.root / self.en).unlink()
        self.assertIn("MISSING_TRANSLATION", self.codes())
        self.write(self.en, self.emeta, self.ebody)
        (self.root / self.ko).unlink()
        self.assertIn("MISSING_TRANSLATION", self.codes())

    def test_duplicate_id_and_path_mismatch(self):
        extra = Path("glossary/ko/duplicate.md")
        self.write(extra, self.kmeta, self.kbody)
        self.assertIn("DUPLICATE_CONCEPT", self.codes())
        (self.root / extra).unlink()
        (self.root / self.en).rename(self.root / self.en.with_name("different.md"))
        self.assertIn("NEEDS_HUMAN_REVIEW", self.codes())

    def test_stale_at_exact_boundary_and_independent_periods(self):
        self.assertNotIn("STALE", self.codes(self.now + timedelta(days=60, microseconds=-1)))
        self.assertIn("STALE", self.codes(self.now + timedelta(days=60)))
        self.kmeta["freshness"]["review_days"] = 365
        self.kmeta["stale_after"] = self.now + timedelta(days=365)
        self.write(self.ko, self.kmeta, self.kbody)
        stale_paths = [f["path"] for f in self.audit(self.now + timedelta(days=61)).findings if f["code"] == "STALE"]
        self.assertEqual([str(self.en)], stale_paths)

    def test_old_verification_does_not_cover_new_content(self):
        self.kmeta["generated"]["at"] += timedelta(seconds=1)
        self.write(self.ko, self.kmeta, self.kbody)
        self.assertIn("UNVERIFIED", self.codes(self.now + timedelta(seconds=1)))

    def test_bare_verification_and_timezone_offsets(self):
        self.kmeta["verified"] = {"by": "test/1", "at": "2026-09-08T12:00:00+09:00"}
        self.write(self.ko, self.kmeta, self.kbody)
        self.assertNotIn("UNVERIFIED", self.codes())
        self.assertNotIn("FRESHNESS_MISMATCH", self.codes())

    def test_false_deadline_and_future_verification(self):
        self.kmeta["stale_after"] += timedelta(days=100)
        self.kmeta["verified"].append({"by": "test/1", "at": self.now + timedelta(days=100)})
        self.write(self.ko, self.kmeta, self.kbody)
        codes = self.codes(self.now + timedelta(days=61))
        self.assertTrue({"FRESHNESS_MISMATCH", "FUTURE_EVENT", "VERIFICATION_OLD"} <= codes)

    def test_historical_records_do_not_expire(self):
        for path, meta, body in ((self.ko, self.kmeta, self.kbody), (self.en, self.emeta, self.ebody)):
            meta["freshness"] = {"mode": "historical"}
            meta.pop("stale_after")
            self.write(path, meta, body)
        codes = self.codes(self.now + timedelta(days=1000))
        self.assertIn("HISTORICAL", codes)
        self.assertNotIn("STALE", codes)
        self.assertNotIn("VERIFICATION_OLD", codes)

    def test_bad_yaml_missing_type_and_reserved_files(self):
        (self.root / "invalid.md").write_text("---\ntype: A\ntype: B\n---\n")
        (self.root / "missing.md").write_text("# No frontmatter\n")
        (self.root / "log.md").write_text("---\ntype: Log\n---\n\n## 2026-99-01\n")
        self.assertTrue({"PARSE_ERROR", "OKF_TYPE", "RESERVED_FRONTMATTER", "LOG_DATE"} <= self.codes())

    def test_malformed_metadata_is_reported_without_crashing(self):
        cases = (("verified", "bad"), ("generated", []), ("sources", {}),
                 ("freshness", []), ("stale_after", "2026-09-08"))
        for field, value in cases:
            with self.subTest(field=field):
                meta = deepcopy(self.kmeta)
                meta[field] = value
                self.write(self.ko, meta, self.kbody)
                self.assertTrue(any(f["level"] == "issue" for f in self.audit().findings))
        self.emeta["translation"]["review_status"] = []
        self.write(self.en, self.emeta, self.ebody)
        self.assertIn("NEEDS_HUMAN_REVIEW", self.codes())

    def test_links_sources_reference_links_and_code_fences(self):
        body = self.kbody + "\n[missing](./gone.md)\n[ref][absent]\n[bad](https://[invalid)\n```md\n[ignored](./fake.md)\n```\n"
        self.kmeta["sources"].append({"id": "local", "resource": "./evidence.md"})
        self.write(self.ko, self.kmeta, body)
        findings = self.audit().findings
        self.assertTrue({"BROKEN_LINK", "BROKEN_REFERENCE", "MALFORMED_LINK"} <= {f["code"] for f in findings})
        self.assertFalse(any("fake.md" in f["message"] for f in findings))

    def test_cli_read_only_json_exit_status_and_bad_root(self):
        def snapshot():
            return {str(p.relative_to(self.root)): hashlib.sha256(p.read_bytes()).hexdigest()
                    for p in self.root.rglob("*") if p.is_file()}
        before = snapshot()
        script = str(Path(fb.__file__).resolve())
        for mode in ("audit", "validate", "stale", "translations", "links"):
            result = subprocess.run([sys.executable, script, mode, "--root", str(self.root),
                                     "--as-of", self.now.isoformat(), "--json"], capture_output=True, text=True)
            self.assertEqual(0, result.returncode, result.stderr + result.stdout)
            self.assertEqual(0, json.loads(result.stdout)["issues"])
        self.assertEqual(before, snapshot())
        result = subprocess.run([sys.executable, script, "audit", "--root", str(self.root / "missing")], capture_output=True)
        self.assertEqual(2, result.returncode)
        (self.root / self.en).unlink()
        result = subprocess.run([sys.executable, script, "translations", "--root", str(self.root), "--json"], capture_output=True, text=True)
        self.assertEqual(1, result.returncode)
        self.assertIn("MISSING_TRANSLATION", {f["code"] for f in json.loads(result.stdout)["findings"]})


if __name__ == "__main__":
    unittest.main()
