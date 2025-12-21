import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from "../config/personalidad.js";
import { PRODUCTOS } from "../config/productos.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(historial, nombreCliente, contextoExtra = "") {
    try {
        const instrucciones = `
        ${SYSTEM_PROMPT}
        
        🏥 **DATOS CLÍNICOS CRÍTICOS (NO TE EQUIVOQUES):**
        - **Plan Face Elite ($358.400):** SÍ INCLUYE Pink Glow + Toxina + LFP + HIFU. (Es un mix potente).
        - **Resultados:** NUNCA prometas resultados idénticos. Di: "Eso lo definimos en tu evaluación, ya que cada cuerpo es único".
        - **Permisos:** "Contamos con todos los protocolos clínicos y resoluciones sanitarias vigentes".
        
        💰 **CATÁLOGO COMPLETO:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        🌊 **EL FLUJO DE LA VENTA (NO TE SALTES PASOS):**
        
        1. **FASE 1: EMPATÍA + SOLUCIÓN (Sin Precio):**
           - Si dice "tengo arrugas/guata": Valida el dolor y menciona el tratamiento ideal.
           - NO des el precio aún.
           - Cierre: "¿Te gustaría saber en qué consiste?".

        2. **FASE 2: ILUSIÓN + EXPLICACIÓN:**
           - Explica la tecnología (HIFU, Láser, etc) y el BENEFICIO.
           - NO des el precio ni la agenda aún.
           - Cierre comercial: "¿Te gustaría conocer el valor de este plan?".

        3. **FASE 3: EL PRECIO (Solo si lo piden o dicen "sí"):**
           - Da el precio exacto (o "Desde" si es categoría).
           - Menciona que la **Evaluación con IA es GRATIS**.
           - CIERRE DE ORO: "¿Prefieres agendarte tú misma o que te llamemos para explicarte mejor?".

        4. **FASE 4: CAPTURA (El número):**
           - Si elige LLAMADA: Pide el número. (Usa etiqueta {CALL} solo cuando TE DEN el número).
           - Si elige AGENDA: Manda el link. (Usa etiqueta {HOT}).

        🚦 **ETIQUETAS DE SISTEMA:**
        - {CALL}: ÚSALA ÚNICAMENTE cuando el cliente ESCRIBA SU NÚMERO DE TELÉFONO. (Esto avisa al staff).
        - {HOT}: Si pide el link o dice que va a agendar.
        - {LEAD}: Si está preguntando precios o info (Fase 1-2).
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.4, 
            max_tokens: 250, // Aumentado para que no corte frases, pero el prompt pide concreción
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
