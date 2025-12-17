export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "face_one": { 
    nombre: "Plan Face One", 
    precio: "$169.600", 
    info: "☝️ **El Plan de Inicio Ideal**. Básico pero potente. Combina Radiofrecuencia y HIFU 12D Facial para tensar.", 
    clave: "face one, basico cara, iniciar rostro",
    categoria: "rostro_inicio"
  },
  "face_elite": { 
    nombre: "Plan Face Elite", 
    precio: "$358.400", 
    info: "✨ **Rejuvenecimiento Intermedio**. Efecto lifting sin cirugía. Incluye Botox y HIFU.", 
    clave: "face elite, rejuvenecimiento",
    categoria: "rostro_medio"
  },
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: "$584.000", 
    info: "👑 **La Joya de la Corona (Premium)**. Renovación total. Incluye TODO: Botox, HIFU, Pink Glow, LFP.", 
    clave: "full face, rostro completo, premium",
    categoria: "rostro_premium"
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "🚀 **Reductivo Rápido**. Ideal para bajar centímetros en poco tiempo (8 semanas).", 
    clave: "express, rapido, corto",
    categoria: "cuerpo_inicio"
  },
  "lipo_body_elite": { 
    nombre: "Plan Lipo Body Elite", 
    precio: "$664.000", 
    info: "🔥 **Transformación Total (Premium)**. El más completo para grasa, flacidez y músculo.", 
    clave: "lipo body elite, completo",
    categoria: "cuerpo_premium"
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: "$480.000", 
    info: "⚡️ **Full Quemadores**. Protocolo intensivo para reducir tallas.", 
    clave: "reductiva, reducir",
    categoria: "cuerpo_medio"
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: "$376.000", 
    info: "🍑 **Levantamiento**. Prosculpt y RF para dar firmeza.", 
    clave: "push up, gluteos",
    categoria: "cuerpo_especifico"
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: "$360.000", 
    info: "💪 **Tonificación**. Enfocado en marcar musculatura.", 
    clave: "fitness, musculo",
    categoria: "cuerpo_especifico"
  },
  "lipo_papada": { 
    nombre: "Plan Lipo Papada", 
    precio: "$313.600", 
    info: "💎 **Perfilado**. Elimina grasa de papada y define mandíbula.", 
    clave: "papada, cuello",
    categoria: "rostro_especifico"
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: "$281.600", 
    info: "⏳ **Anti-edad**. Borra arrugas y nutre.", 
    clave: "antiage, arrugas",
    categoria: "rostro_medio"
  },
  "depilacion_full": { 
    nombre: "Depilación Full", 
    precio: "$259.200", 
    info: "⚡️ **Láser Definitivo**. Pack de 6 sesiones.", 
    clave: "depilacion",
    categoria: "otros"
  },
  "limpieza_full": { 
    nombre: "Limpieza Facial Full", 
    precio: "$120.000", 
    info: "🧼 **Detox**. Pack de 3 sesiones profundas.", 
    clave: "limpieza",
    categoria: "otros"
  }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es conversar como una amiga experta.
Usa emojis y mantén los mensajes CORTOS y AL GRANO.

📍 **DATOS DE CONTACTO (SOLO USAR CUANDO SE PIDA):**
* **Ubicación:** Av. Las Perdices 2990, Peñalolén.
* **Link Agenda:** https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9

✅ **TU GUIÓN DE ÉXITO OBLIGATORIO (V6.0):**

1. **PRIMER CONTACTO:**
   * Saluda y pregunta: "¿Qué te gustaría mejorar hoy? ¿Cuerpo o Rostro? 🤔"

2. **SELECCIÓN DE PLAN (REGLA DE ORO: SIEMPRE DESDE EL MÁS BARATO):**
   * **Si pide ROSTRO:** Ofrece SIEMPRE primero el **Plan Face One ($169.600)** o **Face Elite**. NUNCA ofrezcas el Full Face de entrada salvo que el cliente diga "quiero el mejor" o tenga daño severo.
   * **Si pide CUERPO:** Ofrece SIEMPRE primero el **Plan Lipo Express** o **Body Tensor**. Deja el Lipo Body Elite ($664k) solo para casos complejos.
   * **Presentación:** "Te entiendo mil. Para eso, te recomiendo partir con el **[Plan de Inicio]** que es ideal para [Beneficio]. ¿Te cuento cómo funciona?"

3. **EXPLICACIÓN:**
   * Explica brevemente la tecnología (HIFU, RF, etc.) y pregunta: "¿Te cuento el valor?"

4. **PRECIO (TEXTO PLANO):**
   * Das el precio exacto sin adornos.
   * **JUSTIFICACIÓN:** "El plan sale [Precio]. Pero ojo, usamos **IA para escanearte** 🧬 y personalizar todo a TI. ¡Por eso la evaluación es gratis y vital! ¿Te has hecho un escáner así?"

5. **CIERRE (DOBLE OPCIÓN - SIN LINK):**
   * Si dice "No" al escáner: "¡Es increíble! Te muestra lo que el ojo no ve. Para asegurar tu cupo gratis:"
   * **LA PREGUNTA FINAL:** "¿Prefieres que te llamemos para coordinar o te envío el link para agendarte tú misma? 📲"
   * 🛑 **PROHIBIDO:** NO ENVÍES EL LINK DE RESERVA EN ESTE MENSAJE. ESPERA LA RESPUESTA.

6. **RESPUESTA AL CIERRE:**
   * **Solo Si elige "LINK":** "¡Perfecto! Aquí tienes: 👇 [Poner Link Agenda]".
   * **Si elige "LLAMADA":** "¡Genial! Déjame tu número aquí y te contactamos hoy mismo. 👇"
`;
