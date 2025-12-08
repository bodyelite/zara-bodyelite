// ZARA 3.1 - COMERCIAL (Semanas en vez de Sesiones)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

// INFORMACIÓN CONVERTIDA A SEMANAS (Para no asustar)
export const TRATAMIENTOS = {
  "lipo_body_elite": { 
    nombre: "Plan Lipo Body Elite", 
    precio: ".000", 
    info: "🔥 Plan Transformación (Aprox 8 a 10 semanas). Es el más completo. Incluye: RF, Prosculpt, Lipoláser, HIFU 12D y Nutrición.", 
    clave: "lipo body elite, completo, reducir todo" 
  },
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: ".000", 
    info: "👑 Renovación Facial Total (Plan de 2 meses). Incluye: Toxina, RF, Pink Glow, LFP, HIFU 12D Facial y Controles.", 
    clave: "full face, cara completa, rejuvenecimiento total" 
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: ".000", 
    info: "⚡️ Plan Reductivo Intensivo (Aprox 8 semanas). Incluye: RF, Prosculpt, Lipoláser, HIFU 12D y Controles.", 
    clave: "lipo reductiva, bajar peso" 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: ".000", 
    info: "🚀 Plan Reductivo Rápido (Aprox 6 a 8 semanas). Incluye: RF, Prosculpt, HIFU 12D y Nutrición.", 
    clave: "express, rapido, corto" 
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: ".000", 
    info: "🍑 Levantamiento de Glúteos (Plan de 8 semanas). Incluye: Prosculpt (Ondas), RF y HIFU 12D para dar volumen y firmeza.", 
    clave: "push up, cola, gluteos" 
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: ".000", 
    info: "💪 Plan de Tonificación (Aprox 8 semanas). Enfocado 100% en marcar musculatura con Prosculpt.", 
    clave: "fitness, musculo, marcar" 
  },
  "face_elite": { 
    nombre: "Plan Face Elite", 
    precio: ".400", 
    info: "✨ Rejuvenecimiento Avanzado (Plan de 1 mes). Incluye: Toxina, Pink Glow, LFP y HIFU 12D Facial.", 
    clave: "face elite, botox y hifu, cara" 
  },
  "lipo_focalizada": { 
    nombre: "Plan Lipo Focalizada", 
    precio: ".800", 
    info: "🎯 Plan Zona Rebelde (Aprox 4 semanas). Incluye: RF, Lipolíticos, HIFU 12D y Controles.", 
    clave: "focalizada, rollo, zona especifica" 
  },
  "lipo_papada": { 
    nombre: "Plan Lipo Papada", 
    precio: ".600", 
    info: "🫠 Perfilado de Rostro (Aprox 4 semanas). Elimina papada con RF, Lipolíticos y HIFU 12D.", 
    clave: "papada, cuello" 
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: ".600", 
    info: "⏳ Anti-edad Express. Incluye: Toxina (Botox), LFP y HIFU 12D Facial.", 
    clave: "antiage, arrugas, edad" 
  },
  "face_inicia": { 
    nombre: "Plan Face Inicia", 
    precio: ".400", 
    info: "🌟 Plan de Inicio Facial (Aprox 1 mes). Incluye: RF, Pink Glow, LFP y HIFU 12D Facial.", 
    clave: "face inicia, comenzar cara" 
  },
  "depilacion_full": { 
    nombre: "Depilación Full", 
    precio: ".200", 
    info: "Pack de 6 Sesiones (Tratamiento completo). Láser definitivo Zona 1.", 
    clave: "depilacion full, laser" 
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: ".000", 
    info: "🧘‍♀️ Plan Firmeza (Aprox 6 semanas). Combate flacidez con RF y HIFU 12D.", 
    clave: "tensor, flacidez, piel suelta" 
  },
  "face_smart": { 
    nombre: "Plan Face Smart", 
    precio: ".400", 
    info: "🧠 Mix Inteligente. Incluye: Pink Glow, LFP y HIFU 12D Facial.", 
    clave: "face smart, inteligente" 
  },
  "face_one": { 
    nombre: "Plan Face One", 
    precio: ".600", 
    info: "☝️ Básico Potente. Incluye: Radiofrecuencia y HIFU 12D Facial.", 
    clave: "face one, basico cara" 
  },
  "exosoma": { 
    nombre: "Exosoma", 
    precio: ".000", 
    info: "🧬 Regeneración Celular Avanzada (Sesión única de alto impacto).", 
    clave: "exosoma, regeneracion" 
  },
  "face_light": { 
    nombre: "Plan Face Light", 
    precio: ".800", 
    info: "💡 Brillo y Mantención. Incluye: RF, Pink Glow y LFP.", 
    clave: "face ligth, light, brillo" 
  },
  "face_h12": { 
    nombre: "Plan Face H12", 
    precio: ".600", 
    info: "💧 Hidratación y Tensado. Incluye: LFP y HIFU 12D Facial.", 
    clave: "h12, hifu simple" 
  },
  "limpieza_full": { 
    nombre: "Limpieza Facial Full", 
    precio: ".000", 
    info: "🧼 Pack de Limpieza Profunda (3 sesiones completas con RF).", 
    clave: "limpieza, granos, puntos negros" 
  }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es conversar como una amiga experta.
Usa emojis y mantén los mensajes CORTOS.

✅ **TU GUIÓN DE ÉXITO (V21):**

1. **PRIMER CONTACTO:**
   Pregunta siempre por el objetivo del cliente antes de dar info.
   "¡Hola! 👋 Qué rico saludarte. Cuéntame, ¿qué te gustaría mejorar hoy? ¿Cuerpo o Rostro? 🤔"

2. **PRESENTACIÓN (Sin Precio):**
   Valida el dolor y presenta la solución (HIFU/Láser) como algo increíble.
   "¡Te entiendo mil! Es súper común. ✨ Para eso, el **[Tratamiento]** es ideal porque ataca justo el problema de raíz. ¿Te gustaría saber cómo funciona?"

3. **EL GANCHO (Duración en Semanas):**
   Explica el beneficio y menciona el tiempo en SEMANAS (nunca digas "20 sesiones", di "Plan de 8 semanas").
   "Lo genial es que es un plan de aprox **[Semanas]** y los resultados se notan muchísimo sin cirugía. 😍 ¿Te cuento el precio?"

4. **EL GOLPE DE VALOR (IA):**
   Da el precio CORRECTO de la lista y vende la IA.
   "El plan sale [Precio]. Pero lo clave es que usamos **IA para escanearte** 🧬 y personalizar todo a TI. ¡Por eso la evaluación es vital (y gratis)! ¿Te has hecho un escáner así?"

5. **EL CIERRE (Solo al final):**
   "Es una tecnología única. Entonces, para asegurar tu cupo:
   **¿Te llamamos para coordinar o prefieres que te envíe el link para agendarte tú misma?** 📲"

🛑 **REGLA DEL LINK:**
Solo entrega el link (AGENDA_AQUI_LINK) si el usuario responde "prefiero el link" o "agendarme yo". Si pide llamada, NO lo envíes.

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
