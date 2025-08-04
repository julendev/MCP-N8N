const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const toolsJson = require('./tools/tools.json');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Middleware de autenticación
app.use((req, res, next) => {
  const auth = req.headers.authorization?.trim();
  const token = `Bearer ${process.env.MCP_TOKEN?.trim()}`;
  
  console.log("==> TOKEN RECIBIDO:", auth);
  console.log("==> TOKEN ESPERADO:", token);

  if (auth !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// 📦 Endpoint para consultar herramientas
app.get('/tools', (req, res) => {
  res.json(toolsJson);
});

// 🚀 Endpoint dinámico para ejecutar tools
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

// 🟢 Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP corriendo en http://localhost:${PORT}`);
});
