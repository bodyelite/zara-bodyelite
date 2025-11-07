// ===== MEMORIA DE CONTEXTO ZARA 2.1 =====

let contextoGlobal = {};

export function guardarContexto(usuario, categoria) {
  if (!usuario) return;
  contextoGlobal[usuario] = categoria;
}

export function obtenerContexto(usuario) {
  return contextoGlobal[usuario] || null;
}

export default { guardarContexto, obtenerContexto };
