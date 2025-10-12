import fs from "fs";

let knowledge = {};
try {
  const data = fs.readFileSync("./knowledge.json", "utf8");
  knowledge = JSON.parse(data);
} catch (err) {
  console.error("Error cargando knowledge.json:", err);
}

function clean(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

function detectarIntencion(msg) {
  const text = clean(msg);

  if (/(hola|buenas|saludo|hey)/.test(text)) return "saludo";
  if (/(agenda|hora|reserva|diagnostico)/.test(text)) return "agendar";
  if (/(precio|cuesta|valor)/.test(text)) return "precios";
  if (/(gratis|promocion|descuento|oferta|promo)/.test(text)) return "promocion";
  if (/(hifu|cavitacion|radiofrecuencia|ems|sculptor|pink glow)/.test(text)) return "tecnologia_detalle";

  const planes = [
    "push up", "lipo body elite", "lipo express", "lipo reductiva", "lipo reductiva 12d",
    "lipo full body", "body fitness", "body tensor",
    "face elite", "face smart", "face inicia", "face light", "limpieza facial"
  ];
  for (const plan of planes) {
    if (text.includes(clean(plan))) return plan;
  }

  if (/(grasa|abdomen|cintura|moldear|reducir)/.test(text)) return "lipo";
  if (/(flacidez|celulitis|piel|reafirmar|pierna|muslo)/.test(text)) return "body_tens";
  if (/(tonificar|gluteo|musculo|marcar|firmeza)/.test(text)) return "body_fit";
  if (/(cara|rostro|facial|arruga|mancha)/.test(text)) return "face";
  if (/(asesora|humano|persona|hablar)/.test(text)) return "derivar";

  return "fallback";
}

const planesMap = {
  "push up": "push_up",
  "lipo body elite": "lipo",
  "lipo express": "lipo_express",
  "lipo reductiva": "lipo_reductiva",
  "lipo reductiva 12d": "lipo_12d",
  "lipo full body": "lipo_full",
  "body fitness": "body_fit",
  "body tensor": "body_tens",
  "face elite": "face_elite",
  "face smart": "face_smart",
  "face inicia": "face_inicia",
  "face light": "face_light",
  "limpieza facial": "face_light"
};

const responses = {
  saludo: () => knowledge.saludo,
  agendar: () => knowledge.agendar,
  precios: () => knowledge.precios,
  promocion: () => knowledge.promocion,
  lipo: () => knowledge.lipo,
  body_tens: () => knowledge.body_tens,
  body_fit: () => knowledge.body_fit,
  face: () => knowledge.face,
  tecnologia_detalle: (msg) => {
    const text = clean(msg);
    if (text.includes("hifu")) return knowledge.hifu;
    if (text.includes("cavitacion")) return knowledge.cavitacion;
    if (text.includes("radiofrecuencia")) return knowledge.radiofrecuencia;
    if (text.includes("ems") || text.includes("sculptor")) return knowledge.ems;
    if (text.includes("pink glow")) return knowledge.pink_glow;
    return knowledge.tecnologias;
  },
  tecnologias: () => knowledge.tecnologias,
  derivar: () => knowledge.derivar,
  fallback: () => knowledge.fallback || "No entendí del todo, pero puedo ayudarte con tratamientos o precios."
};

function obtenerRespuesta(msg) {
  const intent = detectarIntencion(msg);

  // Prioridad de respuestas definidas
  if (planesMap[intent]) return knowledge[planesMap[intent]];

  // Manejo seguro de intenciones sin función
  if (intent === "tecnologia_detalle") return responses.tecnologia_detalle(msg);
  if (responses[intent]) return responses[intent](msg);

  // fallback garantizado
  return responses.fallback();
}

export default obtenerRespuesta;
