export function isMobilePhone(text) {
  // Busca secuencias de 8 o 9 dígitos (permitiendo +56 9)
  const phoneRegex = /\b(\+?56)?\s?9\s?\d{4}\s?\d{4}\b/g;
  return phoneRegex.test(text.replace(/\s/g, ''));
}
