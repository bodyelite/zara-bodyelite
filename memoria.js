import { responderExtendido } from "./motor_respuesta.js";

let modoInterno = false;
let ultimoUsuario = "";
let ultimoMensaje = "";

// Procesa mensaje, mantiene contexto y modo interno
export default function procesarMensaje(texto) {
  const t = texto.trim().toLowerCase();

  // Activar o desactivar modo interno
  if (t === "/interno on") {
    modoInterno = true;
    return "🔒 Modo interno activado.";
  }
  if (t === "/interno off") {
    modoInterno = false;
    return "🔓 Modo interno desactivado.";
  }

  // Guardar contexto
  ultimoMensaje = t;

  const respuesta = responderExtendido(t);

  // Si está en modo interno, mostrar diagnóstico
  if (modoInterno) {
    return (
      respuesta +
      `\n\n🧩 [Interno]\nTexto analizado: "${t}"\nÚltimo usuario: ${ultimoUsuario}\nModo interno: ${modoInterno}`
    );
  }

  return respuesta;
}
