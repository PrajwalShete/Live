const http = require('http');

const REPO = 'PrajwalShete/Live';
const FILE = 'index.html';
const PORT = 3000;

const server = http.createServer(async (req, res) => {
  try {
    // GitHub contents API serves the latest commit, unlike the raw CDN which caches ~5 min
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}?ref=main`, {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'reactor-hub',
      },
    });
    if (!r.ok) {
      res.writeHead(r.status, { 'Content-Type': 'text/plain' });
      res.end(`GitHub fetch failed: ${r.status} ${r.statusText}`);
      return;
    }
    const html = await r.text();
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(html);
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Error reaching GitHub: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`Reactor hub running at http://localhost:${PORT} — serving ${REPO}/${FILE} live`);
});
