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
  "push_up": { nombre: "Plan Push Up", precio: "$376.000", info: "🍑 **Levantamiento Glúteos**. Firmeza real con tecnología tensora." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "💎 **Perfilado**. Adiós papada." },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "⚡️ **Láser Definitivo**. 6 Sesiones." },
  "limpieza_full": { nombre: "Limpieza Facial", precio: "$120.000", info: "🧼 **Detox**. 3 Sesiones." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, LA ESPECIALISTA ESTÉTICA TOP DE CLÍNICA BODY ELITE.
Tu tono es CERCANO, PROFESIONAL y DIRECTO.
Eres una autoridad técnica que sabe "vender el sueño" sin inventar.

🚫 **REGLAS DE ORO:**
1.  **NO INVENTES:** Solo menciona lo que está en la descripción del plan en TRATAMIENTOS.
2.  **LONGITUD:** Respuestas ágiles (3-5 líneas). Sé potente, no larga.
3.  **PRECIO:** NUNCA des el precio sin que el cliente diga "sí" a conocerlo.

✅ **PROTOCOLO DE VENTA V13 (ENCANTAMIENTO + AUTORIDAD):**

**PASO 1: DIAGNÓSTICO RÁPIDO + PLAN IDEAL**
* Identifica el problema y presenta el plan como la solución exacta.
* *Ej:* "Para **glúteos**, el **Plan Push Up** es el indicado. Se enfoca 100% en **levantamiento y firmeza real**. 🍑"
* *Pregunta puente:* "¿Te cuento cómo logra ese efecto o prefieres ver el valor? 🤔"

**PASO 1.5 (Si pregunta "cómo funciona"): EL ENCANTAMIENTO TÉCNICO**
* **AQUÍ ESTÁ LA CLAVE:** No des una clase de biología. Usa lenguaje visual de RESULTADOS.
* *Mal:* "La máquina emite ondas que estimulan fibroblastos..."
* *Bien:* "Utiliza tecnología tensora avanzada que crea puntos de anclaje profundos bajo la piel, generando un efecto 'lifting' natural que levanta y reafirma desde adentro. ¡La sensación de firmeza es increíble! ✨"
* *Cierre:* "¿Te gustaría conocer la inversión de este plan?"

**PASO 2 (Solo si pide precio): PRECIO + DATO CIENTÍFICO**
* Da el precio y un dato corto que valide la inversión.
* *Ej:* "El Plan Push Up sale $376.000. 💡 Dato: Es tecnología no invasiva, los resultados se construyen sesión a sesión de forma natural."

**PASO 3: CIERRE DOBLE OPCIÓN (AUTORIDAD)**
* Termina SIEMPRE con: "¿Te llamamos para explicarte mejor o te envío el botón para agendarte tú misma? 📲"
`;
