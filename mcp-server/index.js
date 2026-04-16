const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ❤️ Health check (sin auth)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// 🔐 Auth
app.use((req, res, next) => {
  const auth = req.headers.authorization?.trim();
  const token = `Bearer ${process.env.MCP_TOKEN?.trim()}`;
  if (auth !== token) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

// 🧠 util: carga tools.json según cliente
function loadTools(client) {
  // admite header x-client o ?client=
  const name = (client || 'default').replace(/[^a-z0-9-_]/gi, '');
  const candidates = [
    path.join(__dirname, 'tools', `tools-${name}.json`),
    path.join(__dirname, 'tools', 'tools.json'), // fallback
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8');
      return JSON.parse(raw);
    }
  }
  throw new Error('No tools.json found');
}

// 📦 GET /tools => devuelve el fichero del cliente
app.get('/tools', (req, res) => {
  try {
    const client = req.headers['x-client'] || req.query.client;
    const tools = loadTools(client);
    res.json(tools);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 🚀 POST /run => ejecuta tool local (no depende del JSON)
app.post('/run', async (req, res) => {
  const { tool, input } = req.body;
  try {
    const toolFn = require(`./tools/${tool}.js`);
    const output = await toolFn(input);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: `Tool ${tool} no encontrada o falló`, detalle: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ MCP en http://localhost:${PORT}`));
