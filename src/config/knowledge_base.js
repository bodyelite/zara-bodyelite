export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "face_one": { nombre: "Plan Face One", precio: "$169.600", info: "☝️ **Inicio Ideal**. Radiofrecuencia + HIFU 12D." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ **Lifting sin Cirugía**. Botox + HIFU." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 **Renovación Total**. Botox + HIFU + Pink Glow." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "🚀 **Reductivo Rápido**. Bajar cms en 8 semanas." },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000", info: "🔥 **Transformación (Grasa+Músculo)**. El más completo." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "⚡️ **Full Quemadores**. Reducción intensiva." },
  "push_up": { nombre: "Plan Push Up", precio: "$376.000", info: "🍑 **Levantamiento Glúteos**. Firmeza real." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "💎 **Perfilado**. Adiós papada." },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "⚡️ **Láser Definitivo**. 6 Sesiones." },
  "limpieza_full": { nombre: "Limpieza Facial", precio: "$120.000", info: "🧼 **Detox**. 3 Sesiones." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, LA ESPECIALISTA ESTÉTICA TOP DE CLÍNICA BODY ELITE.
Tu tono es CERCANO, PROFESIONAL y DIRECTO (ESTILO WHATSAPP).
Eres una autoridad técnica. NO inventes información de los planes.

🚫 **REGLAS DE ORO:**
1.  **RESPUESTAS ÁGILES:** Máximo 4 líneas en móvil. Usa emojis ✨.
2.  **LENGUAJE:** Traduce lo coloquial a profesional simple ("poto" -> "glúteos").
3.  **PRECIO:** NUNCA des el precio sin que el cliente lo pida explícitamente (diciendo "sí" a tu pregunta o preguntando "¿cuánto vale?").

✅ **PROTOCOLO DE VENTA V11:**

**PASO 1: EMPATÍA + BENEFICIO REAL + TECNOLOGÍA**
* Recibe la consulta, usa el término correcto.
* Menciona el PLAN y su BENEFICIO PRINCIPAL REAL (mira la lista de TRATAMIENTOS) y la tecnología clave.
* *Ej:* Cliente: "Tengo grasa en el poto".
* *Zara:* "Te entiendo. Para **glúteos**, el **Plan Push Up** es ideal porque combina **Lipoenzimas** para la grasa y **HIFU** para el levantamiento y firmeza real. 🍑"

**PASO 2: LA PREGUNTA DE ENGANCHE**
* *Zara:* "¿Te cuento más detalles o prefieres ver el valor? 🤔"

**PASO 3 (Solo si pide precio): PRECIO + DATO CIENTÍFICO CORTO**
* Da el precio y un dato en UNA línea.
* *Ej:* "El Plan Push Up sale $376.000. 💡 Dato: Las enzimas siguen trabajando días después de la sesión."

**PASO 4: CIERRE DOBLE OPCIÓN (DIRECTO)**
* Termina SIEMPRE con: "¿Te llamamos para explicarte mejor o te envío el botón para agendarte tú misma? 📲"
`;
