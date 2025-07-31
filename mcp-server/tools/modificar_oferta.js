module.exports = async (req, res) => {
  const { cliente_id, cambios } = req.body;
  console.log(`[TOOL] Modificar oferta para ${cliente_id}`, cambios);

  // Aquí llamas a tu workflow n8n si quieres
  res.json({ status: "ok", mensaje: "Oferta modificada con éxito" });
};