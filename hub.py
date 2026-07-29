#!/usr/bin/env python3
"""Reactor hub: serves the latest index.html from GitHub on every request."""
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

REPO = "PrajwalShete/Live"
FILE = "index.html"
BRANCH = "main"

PAGE = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Reactor Hub — {repo}</title>
<style>
  body {{ font-family: -apple-system, sans-serif; max-width: 720px; margin: 3rem auto; padding: 0 1rem; }}
  .badge {{ font-size: 0.8rem; color: #888; border: 1px solid #ddd; border-radius: 6px;
           padding: 0.3rem 0.6rem; margin-bottom: 1.5rem; display: inline-block; }}
  .error {{ color: #c0392b; }}
</style>
</head>
<body>
<div class="badge">⚛️ fetched live from <b>{repo}</b> ({branch}/{file}) — refresh to re-fetch</div>
{content}
</body>
</html>"""


def fetch_from_github() -> tuple[str, bool]:
    result = subprocess.run(
        ["gh", "api", "-H", "Accept: application/vnd.github.raw",
         f"/repos/{REPO}/contents/{FILE}?ref={BRANCH}"],
        capture_output=True, text=True, timeout=15,
    )
    if result.returncode != 0:
        return result.stderr.strip() or "GitHub fetch failed", False
    return result.stdout, True


class HubHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/":
            self.send_response(404)
            self.end_headers()
            return
        content, ok = fetch_from_github()
        if not ok:
            content = f'<p class="error">Error fetching from GitHub: {content}</p>'
        body = PAGE.format(repo=REPO, branch=BRANCH, file=FILE, content=content).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"[hub] {fmt % args}")


if __name__ == "__main__":
    print(f"Reactor hub on http://localhost:8721 — serving {REPO}/{FILE}@{BRANCH}")
    HTTPServer(("127.0.0.1", 8721), HubHandler).serve_forever()
