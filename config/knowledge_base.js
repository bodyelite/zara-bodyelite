// ZARA 4.2 - FIX: RESTAURACIÓN DE ALERTAS STAFF (CRÍTICO)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "lipo_body_elite": { 
    nombre: "Plan Lipo Body Elite", 
    precio: "$664.000", 
    info: "🔥 Plan Transformación (Aprox 8 a 10 semanas). Es el más completo. Incluye: RF, Prosculpt, Lipoláser, HIFU 12D y Nutrición.", 
    clave: "lipo body elite, completo, reducir todo" 
  },
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: "$584.000", 
    info: "👑 Renovación Facial Total (Plan de 2 meses). Incluye: Toxina, RF, Pink Glow, LFP, HIFU 12D Facial y Controles.", 
    clave: "full face, cara completa, rejuvenecimiento total" 
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: "$480.000", 
    info: "⚡️ Plan Reductivo Intensivo (Aprox 8 semanas). Incluye: RF, Prosculpt, Lipoláser, HIFU 12D y Controles.", 
    clave: "lipo reductiva, bajar peso" 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "🚀 Plan Reductivo Rápido (Aprox 6 a 8 semanas). Incluye: RF, Prosculpt, HIFU 12D y Nutrición.", 
    clave: "express, rapido, corto" 
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: "$376.000", 
    info: "🍑 Levantamiento y Formas (Plan de 8 semanas). Prosculpt y RF para dar firmeza y levantar (OJO: No aumenta volumen/relleno, solo modela y tensa el músculo).", 
    clave: "push up, cola, gluteos" 
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: "$360.000", 
    info: "💪 Plan de Tonificación (Aprox 8 semanas). Enfocado 100% en marcar musculatura con Prosculpt.", 
    clave: "fitness, musculo, marcar" 
  },
  "face_elite": { 
    nombre: "Plan Face Elite", 
    precio: "$358.400", 
    info: "✨ Rejuvenecimiento Avanzado (Plan de 1 mes). Incluye: Toxina, Pink Glow, LFP y HIFU 12D Facial.", 
    clave: "face elite, botox y hifu, cara" 
  },
  "lipo_focalizada": { 
    nombre: "Plan Lipo Focalizada", 
    precio: "$348.800", 
    info: "🎯 Plan Zona Rebelde (Aprox 4 semanas). Incluye: RF, Lipolíticos, HIFU 12D y Controles.", 
    clave: "focalizada, rollo, zona especifica" 
  },
  "lipo_papada": { 
    nombre: "Plan Lipo Papada", 
    precio: "$313.600", 
    info: "🫠 Perfilado de Rostro (Aprox 4 semanas). Elimina papada con RF, Lipolíticos y HIFU 12D.", 
    clave: "papada, cuello" 
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: "$281.600", 
    info: "⏳ Anti-edad Express. Incluye: Toxina (Botox), LFP y HIFU 12D Facial.", 
    clave: "antiage, arrugas, edad" 
  },
  "face_inicia": { 
    nombre: "Plan Face Inicia", 
    precio: "$270.400", 
    info: "🌟 Plan de Inicio Facial (Aprox 1 mes). Incluye: RF, Pink Glow, LFP y HIFU 12D Facial.", 
    clave: "face inicia, comenzar cara" 
  },
  "depilacion_full": { 
    nombre: "Depilación Full", 
    precio: "$259.200", 
    info: "Pack de 6 Sesiones (Tratamiento completo). Láser definitivo Zona 1.", 
    clave: "depilacion full, laser" 
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: "$232.000", 
    info: "🧘‍♀️ Plan Firmeza (Aprox 6 semanas). Combate flacidez con RF y HIFU 12D.", 
    clave: "tensor, flacidez, piel suelta" 
  },
  "face_smart": { 
    nombre: "Plan Face Smart", 
    precio: "$198.400", 
    info: "🧠 Mix Inteligente. Incluye: Pink Glow, LFP y HIFU 12D Facial.", 
    clave: "face smart, inteligente" 
  },
  "face_one": { 
    nombre: "Plan Face One", 
    precio: "$169.600", 
    info: "☝️ Básico Potente. Incluye: Radiofrecuencia y HIFU 12D Facial.", 
    clave: "face one, basico cara" 
  },
  "exosoma": { 
    nombre: "Exosoma", 
    precio: "$152.000", 
    info: "🧬 Regeneración Celular Avanzada (Sesión única de alto impacto).", 
    clave: "exosoma, regeneracion" 
  },
  "face_light": { 
    nombre: "Plan Face Light", 
    precio: "$128.800", 
    info: "💡 Brillo y Mantención. Incluye: RF, Pink Glow y LFP.", 
    clave: "face ligth, light, brillo" 
  },
  "face_h12": { 
    nombre: "Plan Face H12", 
    precio: "$121.600", 
    info: "💧 Hidratación y Tensado. Incluye: LFP y HIFU 12D Facial.", 
    clave: "h12, hifu simple" 
  },
  "limpieza_full": { 
    nombre: "Limpieza Facial Full", 
    precio: "$120.000", 
    info: "🧼 Pack de Limpieza Profunda (3 sesiones completas con RF).", 
    clave: "limpieza, granos, puntos negros" 
  }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es conversar como una amiga experta.
Usa emojis y mantén los mensajes CORTOS y AL GRANO.

📍 **DATOS FIJOS (ÚSALOS SIEMPRE):**
* **Ubicación:** Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).
* **Estacionamiento:** ¡SÍ, contamos con Estacionamiento GRATIS! 🚗
* **Link Agenda:** https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9

✅ **TU GUIÓN DE ÉXITO (V4.2):**

1. **PRIMER CONTACTO:**
   Pregunta siempre por el objetivo.
   "¡Hola! 👋 Qué rico saludarte. Cuéntame, ¿qué te gustaría mejorar hoy? ¿Cuerpo o Rostro? 🤔"

2. **PRESENTACIÓN (Sin Precio):**
   Valida el dolor y presenta la solución.
   "¡Te entiendo mil! ✨ Para eso, el **[Tratamiento]** es ideal porque ataca justo el problema de raíz. ¿Te gustaría saber cómo funciona?"

3. **EL GANCHO:**
   Explica beneficio y duración en semanas.
   "Lo genial es que es un plan de aprox **[Semanas]** y los resultados se notan muchísimo. 😍 ¿Te cuento el precio?"

4. **EL PRECIO (TEXTO PLANO):**
   Escribe el precio tal cual (ej: $100.000). NO pongas negritas, ni cursivas.
   "El plan sale [Precio]. Pero lo clave es que usamos **IA para escanearte** 🧬 y personalizar todo a TI. ¡Por eso la evaluación es vital (y gratis)! ¿Te has hecho un escáner así?"

5. **EL CIERRE (DOBLE OPCIÓN):**
   "Es una tecnología única. Entonces, para asegurar tu cupo:
   **¿Te llamamos para coordinar o prefieres que te envíe el link para agendarte tú misma?** 📲"

🛑 **REGLA DE ORO DE CONTACTO (CRÍTICO):**

* **CASO A: ELIGE "LLAMADA"** 📞
   Si el usuario dice "llámenme", "prefiero que me llamen" o "llamada":
   **TU RESPUESTA:** "¡Genial! 📝 Para que las chicas te contacten hoy mismo, **por favor déjame tu número de teléfono aquí** 👇 (O confírmame si es este mismo)."
   *(NO ENVÍES EL LINK DE AGENDA EN ESTE CASO).*

* **CASO B: ELIGE "LINK"** 🔗
   Si el usuario dice "link", "me agendo yo" o "envía la agenda":
   **TU RESPUESTA:** "¡Perfecto! Aquí tienes el link para agendarte: 👇
   https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9
   Si necesitas algo más, ¡aquí estoy! 😊"
`;
