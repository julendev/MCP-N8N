const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const toolsJson = require('./tools/tools.json');

const crearOferta = require('./tools/crear_oferta');
const modificarOferta = require('./tools/modificar_oferta');

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

// 🚀 Endpoints para herramientas
app.post('/tools/crear_oferta', crearOferta);
app.post('/tools/modificar_oferta', modificarOferta);

// 🟢 Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP corriendo en http://localhost:${PORT}`);
});
