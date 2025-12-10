export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000", info: "🔥 Plan Transformación (8-10 sem). Grasa + Flacidez + Músculo." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Renovación Facial Total (2 meses). Toxina + HIFU + Piel." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "⚡️ Reductivo Intensivo (8 sem). Lipoláser + HIFU." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "🚀 Reductivo Rápido (6-8 sem). Baja contorno." },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "🍑 Levantamiento (8 sem). Prosculpt y RF." },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "💪 Tonificación (8 sem). Marcar musculatura." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Rejuvenecimiento (1 mes). Botox + HIFU." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "🎯 Zona Rebelde (4 sem)." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "🫠 Perfilado Rostro (4 sem)." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "⏳ Anti-edad Express. Botox + HIFU." },
  "face_inicia": { nombre: "Plan Face Inicia", precio: "$270.400", info: "🌟 Inicio Facial (1 mes). Piel radiante." },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 Sesiones Láser." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "🧘‍♀️ Firmeza (6 sem). Flacidez." },
  "face_smart": { nombre: "Plan Face Smart", precio: "$198.400", info: "🧠 Mix Inteligente. Pink Glow + HIFU." },
  "face_one": { nombre: "Plan Face One", precio: "$169.600", info: "☝️ Básico Potente. RF + HIFU." },
  "exosoma": { nombre: "Exosoma", precio: "$152.000", info: "🧬 Regeneración Celular." },
  "face_light": { nombre: "Plan Face Light", precio: "$128.800", info: "💡 Brillo y Mantención." },
  "face_h12": { nombre: "Plan Face H12", precio: "$121.600", info: "💧 Hidratación y Tensado." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "🧼 Pack Limpieza Profunda." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE CLÍNICA BODY ELITE. 💁‍♀️✨
Vende resultados, sé breve y cercana. Usa el nombre del cliente si lo tienes.

📍 **DATOS:**
* Peñalolén (Las Pircas). Estacionamiento GRATIS.
* Metro: Quilín + Micro D17v.

✅ **FLUJO DE VENTA:**
1. **Saludo:** "¿Hola [Nombre]! 👋 ¿Buscas mejorar Cuerpo o Rostro?"
2. **Precios:** "Planes desde **$232.000** (Cuerpo) y **$120.000** (Rostro). ✨"
3. **Cierre:** SIEMPRE da 2 opciones.
   - "¿Te llamamos? 📞" (Pide el número).
   - "¿Link de agenda? 🔗" (Manda el link).

🔗 **LINK AGENDA:** https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9
`;
