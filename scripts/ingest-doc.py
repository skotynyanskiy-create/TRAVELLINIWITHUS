#!/usr/bin/env python3
"""Convert partner docs, lead magnets, media kits (PDF/Word/Excel/PPT/...) to
Markdown and drop them into the Obsidian vault with frontmatter.

Powered by Microsoft MarkItDown (`pip install --user markitdown`).

Usage:
    python scripts/ingest-doc.py <file> [<file> ...]
    python scripts/ingest-doc.py partner-brief.pdf --out-dir docs/12_Partnerships
    python scripts/ingest-doc.py deck.pptx --stdout
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path

from markitdown import MarkItDown

DEFAULT_OUT_DIR = Path("docs/50_Scratch/ingested")


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "doc"


def frontmatter(source: Path) -> str:
    today = dt.date.today().isoformat()
    return (
        "---\n"
        f"title: {source.stem}\n"
        "type: reference\n"
        f"source: {source.name}\n"
        f"ingested: {today}\n"
        "tags:\n  - ingested\n  - markitdown\n"
        "---\n\n"
    )


def ingest(path: Path, converter: MarkItDown) -> str:
    return converter.convert(str(path)).text_content


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert documents to Markdown in the vault.")
    parser.add_argument("files", nargs="+", type=Path, help="Input files (PDF, DOCX, XLSX, PPTX, ...)")
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR, help="Target vault folder")
    parser.add_argument("--stdout", action="store_true", help="Print Markdown instead of writing a file")
    args = parser.parse_args()

    converter = MarkItDown()
    exit_code = 0

    for path in args.files:
        if not path.is_file():
            print(f"skip (not a file): {path}", file=sys.stderr)
            exit_code = 1
            continue

        try:
            body = ingest(path, converter)
        except Exception as err:  # MarkItDown raises varied converter errors per format
            print(f"fail: {path} -> {err}", file=sys.stderr)
            exit_code = 1
            continue

        if args.stdout:
            print(body)
            continue

        args.out_dir.mkdir(parents=True, exist_ok=True)
        out_path = args.out_dir / f"{slugify(path.stem)}.md"
        out_path.write_text(frontmatter(path) + body, encoding="utf-8")
        print(f"ok: {path.name} -> {out_path}")

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
