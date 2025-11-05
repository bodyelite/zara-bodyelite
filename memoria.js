let contextoGlobal = {};

export function guardarContexto(usuario, categoria) {
  if (!usuario) return;
  contextoGlobal[usuario] = categoria;
}

export function obtenerContexto(usuario) {
  return contextoGlobal[usuario] || null;
}
export { guardarContexto, obtenerContexto };
export default { guardarContexto, obtenerContexto };