const express = require('express');
const cors = require('cors');
require('dotenv').config();

const decide = require('./agent/decide');
const crearOferta = require('./tools/crear_oferta');
const modificarOferta = require('./tools/modificar_oferta');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/agent/decide', decide);
app.post('/tools/crear_oferta', crearOferta);
app.post('/tools/modificar_oferta', modificarOferta);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Server corriendo en http://localhost:${PORT}`);
});