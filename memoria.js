import fs from "fs"
const archivo = "./contexto_memoria.json"

export function cargarMemoria() {
  if (!fs.existsSync(archivo)) fs.writeFileSync(archivo, "[]")
  return JSON.parse(fs.readFileSync(archivo, "utf8"))
}

export function guardarAprendizaje(mensaje, respuesta, intencion) {
  const memoria = cargarMemoria()
  memoria.push({ entrada: mensaje, respuesta, intencion, fecha: new Date().toISOString() })
  fs.writeFileSync(archivo, JSON.stringify(memoria, null, 2))
}

if (process.argv.includes("--importar")) {
  const extra = JSON.parse(fs.readFileSync(process.argv[process.argv.indexOf("--importar")+1], "utf8"))
  const memoria = cargarMemoria().concat(extra)
  fs.writeFileSync(archivo, JSON.stringify(memoria, null, 2))
  console.log("✅ Nuevos conocimientos importados sin perder lo anterior")
}
