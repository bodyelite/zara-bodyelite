// ZARA 3.0 - BASE DE CONOCIMIENTOS CLÍNICOS (FUENTE: EXCEL OFICIAL)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

// INFORMACIÓN EXACTA SEGÚN TABLA DE PRECIOS Y SESIONES
export const TRATAMIENTOS = {
  "lipo_body_elite": { 
    nombre: "Plan Lipo Body Elite", 
    precio: ".000", 
    info: "🔥 El más completo (29 sesiones en total). Incluye: 6 RF, 12 Prosculpt, 6 Lipoláser, 2 HIFU 12D y 3 Controles Nutricionales.", 
    clave: "lipo body elite, completo, reducir todo" 
  },
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: ".000", 
    info: "👑 Renovación Facial Total (12 procesos). Incluye: 1 Toxina, 2 RF, 3 Pink Glow, 2 LFP, 1 HIFU 12D Facial y 3 Controles.", 
    clave: "full face, cara completa, rejuvenecimiento total" 
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: ".000", 
    info: "⚡️ Reducción intensiva (21 sesiones). Incluye: 4 RF, 8 Prosculpt, 4 Lipoláser, 2 HIFU 12D y 3 Controles.", 
    clave: "lipo reductiva, bajar peso" 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: ".000", 
    info: "🚀 Reducción rápida (21 sesiones). Incluye: 8 RF, 8 Prosculpt, 2 HIFU 12D y 3 Controles Nutricionales.", 
    clave: "express, rapido, corto" 
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: ".000", 
    info: "🍑 Levantamiento de Glúteos (17 sesiones). Incluye: 12 Prosculpt (Ondas), 4 RF, 1 HIFU 12D y Controles.", 
    clave: "push up, cola, gluteos" 
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: ".000", 
    info: "💪 Full Tonificación Muscular. Consta de 18 sesiones puras de Prosculpt.", 
    clave: "fitness, musculo, marcar" 
  },
  "face_elite": { 
    nombre: "Plan Face Elite", 
    precio: ".400", 
    info: "✨ Rejuvenecimiento Avanzado (4 sesiones clave). Incluye: 1 Toxina, 1 Pink Glow, 1 LFP, 1 HIFU 12D Facial.", 
    clave: "face elite, botox y hifu, cara" 
  },
  "lipo_focalizada": { 
    nombre: "Plan Lipo Focalizada Reductiva", 
    precio: ".800", 
    info: "🎯 Para zona rebelde (12 sesiones). Incluye: 6 RF, 3 Lipolítico, 1 HIFU 12D y 2 Controles.", 
    clave: "focalizada, rollo, zona especifica" 
  },
  "lipo_papada": { 
    nombre: "Plan Lipo Papada", 
    precio: ".600", 
    info: "🫠 Eliminar papada (9 sesiones). Incluye: 4 RF, 4 Lipolíticos faciales, 1 HIFU 12D Facial.", 
    clave: "papada, cuello" 
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: ".600", 
    info: "⏳ Anti-edad (3 sesiones). Incluye: 1 Toxina, 1 LFP, 1 HIFU 12D Facial.", 
    clave: "antiage, arrugas, edad" 
  },
  "face_inicia": { 
    nombre: "Plan Face Inicia", 
    precio: ".400", 
    info: "🌟 Inicio facial (6 sesiones). Incluye: 2 RF, 1 Pink Glow, 2 LFP, 1 HIFU 12D Facial.", 
    clave: "face inicia, comenzar cara" 
  },
  "depilacion_full": { 
    nombre: "Depilación Full", 
    precio: ".200", 
    info: "6 Sesiones de Láser Zona 1.", 
    clave: "depilacion full, laser" 
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: ".000", 
    info: "🧘‍♀️ Firmeza y piel (11 sesiones). Incluye: 6 RF, 2 HIFU 12D y 3 Controles.", 
    clave: "tensor, flacidez, piel suelta" 
  },
  "face_smart": { 
    nombre: "Plan Face Smart", 
    precio: ".400", 
    info: "🧠 Mix inteligente (3 sesiones). Incluye: 1 Pink Glow, 1 LFP, 1 HIFU 12D Facial.", 
    clave: "face smart, inteligente" 
  },
  "face_one": { 
    nombre: "Plan Face One", 
    precio: ".600", 
    info: "☝️ Básico potente (5 sesiones). Incluye: 4 RF y 1 HIFU 12D Facial.", 
    clave: "face one, basico cara" 
  },
  "exosoma": { 
    nombre: "Exosoma", 
    precio: ".000", 
    info: "🧬 Regeneración celular avanzada (1 sesión de Exosoma).", 
    clave: "exosoma, regeneracion" 
  },
  "face_light": { 
    nombre: "Plan Face Ligth", 
    precio: ".800", 
    info: "💡 Brillo y mantención (3 sesiones). Incluye: 1 RF, 1 Pink Glow, 1 LFP.", 
    clave: "face ligth, light, brillo" 
  },
  "face_h12": { 
    nombre: "Plan Face H12", 
    precio: ".600", 
    info: "💧 Hidratación y tensado (2 sesiones). Incluye: 1 LFP y 1 HIFU 12D Facial.", 
    clave: "h12, hifu simple" 
  },
  "limpieza_full": { 
    nombre: "Limpieza Facial Full", 
    precio: ".000", 
    info: "🧼 Limpieza profunda (6 sesiones). Incluye: 3 RF y 3 Limpiezas.", 
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

3. **EL GANCHO:**
   Explica el beneficio y crea intriga.
   "Lo genial es que los resultados se notan muchísimo y sin cirugía. 😍 (Y te adelanto que el valor te va a encantar). ¿Te cuento el precio?"

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
