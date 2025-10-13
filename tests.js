// tests.js
// Simulador local para probar Zara IA con memoria conversacional
// No modifica conexiones Meta ni Render

import { getKnowledge, normalizarTexto } from "./entrenador.js";
import { generarRespuesta } from "./responses.js";
import {
  registrarConversacion,
  actualizarContexto,
  obtenerContexto,
} from "./conversations.js";

async function probarZara() {
  console.log("=== SIMULACIÓN ZARA IA CON MEMORIA ===\n");

  const data = getKnowledge();
  const usuario = "Usuario Local";

  // Secuencia de conversación simulada (como un chat real)
  const mensajes = [
    "hola",
    "vi su anuncio de push up en instagram",
    "quiero esa promoción",
    "y en qué consiste",
    "cuánto cuesta",
    "dónde están ubicados",
    "gracias",
  ];

  for (const mensaje of mensajes) {
    const textoNormalizado = normalizarTexto(mensaje);
    const contextoPrevio = actualizarContexto(usuario, textoNormalizado);
    const respuesta = await generarRespuesta(
      textoNormalizado,
      data,
      obtenerContexto(usuario)
    );

    console.log(`🧍 Usuario: ${mensaje}`);
    console.log(`🤖 Zara: ${respuesta}\n`);

    registrarConversacion(usuario, mensaje, respuesta);
  }

  console.log("=== FIN DE SIMULACIÓN ===");
}

probarZara();
