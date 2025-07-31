const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  const input = req.body;

  const prompt = `
Eres un agente de decisiones para un sistema de ofertas comerciales.

Contexto del cliente:
${JSON.stringify(input.contexto, null, 2)}

Texto del correo:
${input.body}

Decide qué herramienta usar:
- crear_oferta
- modificar_oferta

Devuelve solo un JSON con la acción y los inputs.
`;

  try {
    const chat = await openai.chat.completions.create({
      model: process.env.MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const output = chat.choices[0].message.content;
    res.json({ decision: output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};