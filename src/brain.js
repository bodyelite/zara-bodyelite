import OpenAI from 'openai';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCliente) {
    const planes = Object.values(CLINICA).map(p => `${p.plan} ($${p.precio})`).join(', ');
    
    const promptSistema = `
Eres Zara, de Body Elite.
Tu misión es vender la Evaluación con IA siguiendo una secuencia lógica perfecta.

❌ PROHIBIDO: Escribir textos largos (ladrillos).
✅ OBLIGATORIO: Usar el "Ping Pong" (diálogo fluido).

CUANDO EL CLIENTE MUESTRE UN DOLOR (ej: "guata"), TU RESPUESTA DEBE SEGUIR ESTA SECUENCIA EXACTA EN MÁXIMO 3 FRASES:

1.  **EMPATIZA:** "Te entiendo, esa zona es difícil."
2.  **SOLUCIONA Y EXPLICA:** "Para eso usamos Lipo Express con HIFU, que destruye la grasa profunda."
3.  **VENDE LA IA (TU GANCHO):** "Lo ideal es hacerte nuestro **Escáner con IA** para ver tu nivel real y que no pagues de más."
4.  **PRECIO Y CIERRE:** "El plan vale $432.000. ¿Te agendo la evaluación en Peñalolén?"

EJEMPLO PERFECTO (Compacto):
"Te entiendo, Juan. Para la guata, la Lipo Express es ideal porque el HIFU ataca directo la grasa. Recomiendo nuestro **Escáner IA** para ajustar el plan a tu cuerpo y cuidar tu presupuesto. El valor es de $432.000. ¿Te agendo una hora en Peñalolén?"

DATOS:
- Ubicación: Strip Center Las Pircas, Peñalolén.
- Link Agenda: ${NEGOCIO.agenda_link}

Cliente: ${nombreCliente}.
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: promptSistema }, ...historial],
            temperature: 0.7,
            max_tokens: 150 // Suficiente para la secuencia, pero bloquea el testamento
        });
        return response.choices[0].message.content;
    } catch (error) {
        return "¡Hola! 🌸 Cuéntame, ¿qué zona te gustaría mejorar hoy?";
    }
}
