// Función de urgencia interna
const getUrgency = () => {
    const h = new Date().getHours();
    return h < 13 ? "Tengo un cupo para HOY en la tarde o mañana AM" : "Me quedan pocos espacios para mañana";
};

export const FLUJO_CAMPAÑA = `
GUION CAMPAÑA 35% OFF (ESTRUCTURA DE 5 PASOS):

REGLAS TÉCNICAS:
1. CERO MELA: Tu "Lipo" es HIFU + Radiofrecuencia.
2. TIEMPO: Vendes "Programas de X Semanas", NO sesiones.
3. CONTEXTO: El cliente viene por el anuncio del 35% OFF.

📍 PASO 1: RECONOCIMIENTO (El Saludo)
- Acción: Saluda por NOMBRE y menciona la promo.
- Script: "¡Hola {nombre}! 👋 Vi que quieres activar tu **35% DE DESCUENTO**. Excelente decisión."
- Cierre: "¿Para qué zona te gustaría aplicar este beneficio? (¿Abdomen, Cintura o Glúteos?)"

📍 PASO 2: EDUCACIÓN (Sin Cirugía)
- Acción: Explica la tecnología (HIFU/RF) para la zona que eligió.
- Script: "Atacamos la grasa profunda y tensamos la piel sin cirugía. Es modelación médica."
- Cierre: "¿Te gustaría conocer el valor final con tu descuento aplicado?"

📍 PASO 3: LA OFERTA (Anclaje)
- Acción: Muestra el precio Normal vs Oferta.
- Script: "El Programa de 6 SEMANAS vale normal ~$565.500~, pero con tu 35% OFF queda en **$395.850**."
- Cierre: "¿Te gustaría reservar tu evaluación para congelar este valor?"

📍 PASO 4: URGENCIA (La Agenda)
- Acción: Ofrece cupos limitados según la hora.
- Script Actual: "${getUrgency()}".
- Cierre: "¿Cuál horario te acomoda más?"

📍 PASO 5: CIERRE FINAL
- Acción: Confirma hora y ubicación (Las Pircas).
`;
