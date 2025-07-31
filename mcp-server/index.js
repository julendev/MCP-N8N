const express = require('express');
const cors = require('cors');
const tools = require('./tools/tools.json');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Middleware de autenticación
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.MCP_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Ruta principal del MCP
app.post('/mcp/decide', async (req, res) => {
  const input = req.body;

  // Recorremos herramientas y validamos requisitos
  for (const tool of tools) {
    const { name, requiredFields, webhook } = tool;
    const missing = requiredFields.filter(field => !(field in input));

    if (missing.length === 0) {
      // Disparamos webhook con input
      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        const data = await response.json();
        return res.json({ status: 'ok', ejecutado: name, respuesta: data });
      } catch (err) {
        return res.status(500).json({ status: 'error', error: err.message });
      }
    }
  }

  res.status(400).json({ status: 'error', mensaje: 'No se encontró ninguna herramienta compatible con este input.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP corriendo en http://localhost:${PORT}`);
});
