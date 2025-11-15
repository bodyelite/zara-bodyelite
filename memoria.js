// memoria.js – Versión estable para Zara 2.1
// Ahora expone leerMemoria / guardarMemoria para el motor nuevo.

let memoriaGlobal = {}; 
let historialConversacion = {};

export default {
  guardarContexto(usuario, contexto) {
    memoriaGlobal[usuario] = contexto;
  },

  obtenerContexto(usuario) {
    return memoriaGlobal[usuario] || null;
  },

  obtenerUltimoTema(usuario) {
    return memoriaGlobal[usuario]?.ultimoTema || null;
  },

  limpiarContexto(usuario) {
    delete memoriaGlobal[usuario];
  },

  guardarMensaje(usuario, mensaje) {
    if (!historialConversacion[usuario]) {
      historialConversacion[usuario] = [];
    }
    historialConversacion[usuario].push(mensaje);
  },

  obtenerHistorial(usuario) {
    return historialConversacion[usuario] || [];
  }
};

// ===============================================
// FUNCIONES QUE NECESITA EL MOTOR NUEVO
// ===============================================

// Leer memoria del usuario (wrapper)
export function leerMemoria(usuario) {
  return memoriaGlobal[usuario] || null;
}

// Guardar memoria del usuario (wrapper)
export function guardarMemoria(usuario, datos) {
  memoriaGlobal[usuario] = datos;
}
