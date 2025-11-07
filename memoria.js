// ============================================================
// Módulo de memoria persistente - v2 con contexto temático
// ============================================================

const memoriaUsuarios = new Map();

export default {
  guardarContexto(usuario, contexto) {
    if (!memoriaUsuarios.has(usuario)) {
      memoriaUsuarios.set(usuario, {});
    }
    memoriaUsuarios.get(usuario).contexto = contexto;
    memoriaUsuarios.get(usuario).ultimoTema = contexto; // guarda último tema activo
  },

  obtenerContexto(usuario) {
    const datos = memoriaUsuarios.get(usuario);
    return datos ? datos.contexto : null;
  },

  obtenerUltimoTema(usuario) {
    const datos = memoriaUsuarios.get(usuario);
    return datos ? datos.ultimoTema : null;
  },

  limpiarContexto(usuario) {
    if (memoriaUsuarios.has(usuario)) {
      delete memoriaUsuarios.get(usuario).contexto;
    }
  }
};
