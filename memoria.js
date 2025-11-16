// ============================================================
// memoria.js – Versión Final Zara 2.1
// Memoria en RAM por usuario
// ============================================================

// Memoria principal por usuario
let memoriaUsuarios = {};

// Historial de mensajes (opcional, usado por monitor si lo necesitas)
let historialUsuarios = {};


// ============================================================
// WRAPPERS QUE USA EL MOTOR v3
// ============================================================

// Leer memoria
export function leerMemoria(usuario) {
  return memoriaUsuarios[usuario] || null;
}

// Guardar memoria
export function guardarMemoria(usuario, datos) {
  memoriaUsuarios[usuario] = datos;
}


// ============================================================
// SISTEMA DE CONTEXTO AMPLIADO (OPCIONAL)
// Mantiene historial si deseas usarlo después
// ============================================================
export default {
  guardarContexto(usuario, contexto) {
    memoriaUsuarios[usuario] = contexto;
  },

  obtenerContexto(usuario) {
    return memoriaUsuarios[usuario] || null;
  },

  limpiarContexto(usuario) {
    delete memoriaUsuarios[usuario];
  },

  guardarMensaje(usuario, mensaje) {
    if (!historialUsuarios[usuario]) historialUsuarios[usuario] = [];
    historialUsuarios[usuario].push(mensaje);
  },

  obtenerHistorial(usuario) {
    return historialUsuarios[usuario] || [];
  }
};
