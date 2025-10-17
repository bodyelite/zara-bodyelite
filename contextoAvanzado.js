// Archivo vacío temporal para eliminar error de importación previa
export function limpiarTexto(txt) { 
  return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
export function normalizar(txt) { 
  return limpiarTexto(txt.toLowerCase());
}
