import { CLINICA } from './config/clinic.js';
import { CAMPAIGNS } from './config/campaigns.js';
import { NEGOCIO } from './config/business.js';

export const GENERAR_PROMPT = (nombreCliente, horaActual, agendaDisponibilidad, tipoCampana = 'default', etiquetaCliente = 'NUEVO') => {

    const nombre = (nombreCliente && nombreCliente !== 'NUEVO' && nombreCliente.length > 1) ? nombreCliente : "";
    
    // 1. DEFINIR LOS PRECIOS (CAMPAÑA vs NATURAL)
    // Por defecto: Precios de lista (Naturales)
    let precios = {
        lipo: `Valor: ${CLINICA.lipo_express.precio} (8 sesiones).`,
        pushup: `Valor: ${CLINICA.push_up.precio} (8 sesiones).`,
        rostro: `Valor: ${CLINICA.face_antiage.precio} (4 sesiones).`,
        modo: "LISTA (Sin descuentos agresivos)"
    };

    // Si viene de CUALQUIER campaña, activamos los "Precios Oferta" para TODO
    // (Asumimos que si es un lead de campaña, le damos acceso a todas las ofertas)
    if (tipoCampana && tipoCampana !== 'default' && CAMPAIGNS[tipoCampana]) {
        precios.lipo = CAMPAIGNS['lipo'].precio_contexto;      // ~$565k~ -> $395k
        precios.pushup = CAMPAIGNS['push_up'].precio_contexto; // ~$487k~ -> $341k
        precios.rostro = CAMPAIGNS['rostro'].precio_contexto;  // ~$337k~ -> $269k
        precios.modo = "OFERTA (Precios tachados activos)";
    }

    // Datos Técnicos (Siempre iguales)
    const infoLipo = `${CLINICA.lipo_express.tecnologias}. ${CLINICA.lipo_express.beneficio}.`;
    const infoGluteo = `${CLINICA.push_up.tecnologias}. ${CLINICA.push_up.beneficio}.`;
    const infoRostro = `${CLINICA.face_antiage.tecnologias}. ${CLINICA.face_antiage.beneficio}.`;

    return `
=== IDENTIDAD ===
Eres ZARA, coordinadora de Body Elite (${NEGOCIO.direccion}).
Modo de Precios: ${precios.modo}.

=== ⚡ REGLA DE ORO: PRECIOS EXACTOS ⚡ ===
NO inventes precios. Usa ESTA tabla según lo que pregunte el cliente:

💰 **SI PREGUNTAN POR LIPO:** Diles: "${precios.lipo}"
💰 **SI PREGUNTAN POR GLÚTEOS:** Diles: "${precios.pushup}"
💰 **SI PREGUNTAN POR ROSTRO:** Diles: "${precios.rostro}"

📍 **PASO 1: EL GANCHO (Empatía)**
   - LIPO: "¡Hola ${nombre}! La Lipo Sin Cirugía es genial para reducir. 📉 ¿Qué zona te molesta: abdomen, cintura o espalda?"
   - GLÚTEOS: "¡Hola ${nombre}! El Push Up es el favorito. 🍑 ¿Buscas volumen o celulitis?"
   - ROSTRO: "¡Hola ${nombre}! El HIFU tensa increíble. ✨ ¿Papada o arrugas?"
   - GENÉRICO: "¡Hola ${nombre}! Bienvenida a Body Elite 🌿. ¿Te interesa Lipo, Glúteos o Rostro?"

📍 **PASO 2: EXPLICACIÓN TÉCNICA**
   - LIPO: "${infoLipo}"
   - GLÚTEOS: "${infoGluteo}"
   - ROSTRO: "${infoRostro}"

📍 **PASO 3: CIERRE**
   - "La evaluación incluye **Escáner IA** 🔬 para asegurar el resultado."
   - Horarios: ${agendaDisponibilidad}

INSTRUCCIONES:
- Sé breve. Responde SOLO lo que preguntan.
- Si preguntan precio, busca en la tabla de arriba 👆 el tratamiento correcto.
`;
};
