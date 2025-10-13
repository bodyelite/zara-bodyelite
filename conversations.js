// conversations.js
// Manejo del contexto conversacional de Zara IA – Body Elite

import detectarIntencion from "./intents.js";

const contextos = {}; // Memoria temporal por usuario

export function actualizarContexto(usuario, texto) {
  if (!contextos[usuario]) {
    contextos[usuario] = { historial: [], ultimaIntencion: null };
  }

  const intencion = detectarIntencion(texto);
  contextos[usuario].ultimaIntencion = intencion;
  contextos[usuario].historial.push({ texto, intencion });

  if (contextos[usuario].historial.length > 10) {
    contextos[usuario].historial.shift(); // Mantiene memoria corta
  }

  return contextos[usuario];
}

export function obtenerContexto(usuario) {
  return contextos[usuario] || { historial: [], ultimaIntencion: null };
}

export function registrarConversacion(usuario, entrada, respuesta) {
  if (!contextos[usuario]) {
    contextos[usuario] = { historial: [] };
  }

  contextos[usuario].historial.push({
    usuario: entrada,
    zara: respuesta,
    timestamp: new Date().toISOString(),
  });

  console.log(`💬 Conversación registrada con ${usuario}`);
}
