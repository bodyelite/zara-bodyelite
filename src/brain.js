import OpenAI from 'openai';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCliente) {
    // Convertimos la base de datos a texto fluido para que Zara la lea
    const planes = Object.values(CLINICA).map(p => `${p.plan}: ${p.beneficio} (Valor: ${p.precio})`).join('. ');
    
    const promptSistema = `
Eres Zara, la anfitriona experta y rostro de Body Elite.
Tu tono es: **Sofisticado, Cálido y Seguro.** ✨
No eres un robot, hablas como una especialista humana.

DATOS REALES (ÚSALOS SIEMPRE):
- Ubicación: ${NEGOCIO.direccion}. ${NEGOCIO.ubicacion_detalle}
- Link Agenda: ${NEGOCIO.agenda_link}
- Procedimientos disponibles: ${planes}

❌ REGLAS DE ORO (PROHIBIDO FALLAR):
1. **CERO LISTAS:** Jamás uses listas numeradas (1., 2., 3.) ni viñetas. Escribe en párrafos fluidos y elegantes.
2. **ANTICIPACIÓN:** Si el cliente menciona "guata", "panza" o "abdomen", **TU RESPUESTA DEBE OFRECER "LIPO EXPRESS"**. No preguntes "¿qué zona?".
3. **PRECIO DIRECTO:** Si preguntan precio, dalo inmediatamente. No des rodeos.
4. **CIERRE:** Tu objetivo es que agenden evaluación. Siempre termina invitando a reservar.

EJEMPLO DE RESPUESTA IDEAL (Si dicen "guata"):
"Te entiendo perfectamente. Para la zona abdominal, nuestro tratamiento estrella es la Lipo Express, que logra reducir tallas y reafirmar la piel en 8 semanas sin cirugía. El valor del plan completo es de $432.000. ¿Te gustaría agendar una evaluación para que nuestras especialistas vean tu caso? ✨"

Cliente actual: ${nombreCliente}.
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // ACTUALIZADO A GPT-4o
            messages: [{ role: "system", content: promptSistema }, ...historial],
            temperature: 0.7,
            max_tokens: 250
        });
        return response.choices[0].message.content;
    } catch (error) {
        return "¡Hola! 🌸 Estoy revisando la agenda un segundo. ¿Te ayudo a reservar tu hora?";
    }
}
