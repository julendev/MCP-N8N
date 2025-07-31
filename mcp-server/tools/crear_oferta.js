module.exports = async (req, res) => {
  const { cliente_id, productos } = req.body;
  console.log(`[TOOL] Crear oferta para ${cliente_id}`, productos);

  // Aquí llamas a tu workflow n8n si quieres
  res.json({ status: "ok", mensaje: "Oferta creada con éxito" });
};