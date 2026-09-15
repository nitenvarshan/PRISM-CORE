const http = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname: '127.0.0.1', port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    // CORS & Proxy handler for local Ollama LLM
    if (req.url.startsWith('/api/chat') || req.url.startsWith('/api/tags')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const proxyReq = http.request({
        hostname: '127.0.0.1',
        port: 11434,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: '127.0.0.1:11434'
        }
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ollama service unavailable on 127.0.0.1:11434', code: err.code }));
      });

      req.pipe(proxyReq);
      return;
    }

    handle(req, res);
  });

  server.listen(port, '127.0.0.1', (err) => {
    if (err) throw err;
    console.log(`> BizOS Ready on http://127.0.0.1:${port}`);
  });
}).catch((err) => {
  console.error('Next.js server error:', err);
  process.exit(1);
});
