const memoriaUsuarios = new Map();

export default {
  guardarContexto(usuario, contexto) {
    if (!memoriaUsuarios.has(usuario)) memoriaUsuarios.set(usuario, {});
    const data = memoriaUsuarios.get(usuario);
    data.contexto = contexto;
    data.ultimoTema = contexto;
    memoriaUsuarios.set(usuario, data);
  },

  obtenerContexto(usuario) {
    const data = memoriaUsuarios.get(usuario);
    return data ? data.contexto : null;
  },

  obtenerUltimoTema(usuario) {
    const data = memoriaUsuarios.get(usuario);
    return data ? data.ultimoTema : null;
  },

  limpiarContexto(usuario) {
    if (memoriaUsuarios.has(usuario)) {
      delete memoriaUsuarios.get(usuario).contexto;
    }
  },

  guardarMensaje(usuario, mensaje) {
    if (!memoriaUsuarios.has(usuario)) memoriaUsuarios.set(usuario, {});
    const data = memoriaUsuarios.get(usuario);
    if (!data.historial) data.historial = [];
    data.historial.push(mensaje.trim());
    if (data.historial.length > 5) data.historial.shift();
    memoriaUsuarios.set(usuario, data);
  },

  obtenerHistorial(usuario) {
    const data = memoriaUsuarios.get(usuario);
    if (!data || !data.historial) return "";
    return data.historial.join(" ");
  }
};
