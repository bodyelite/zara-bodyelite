import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { generarRespuestaClinica } from "./motor_clinico_v3.js"
import { detectarIntencion } from "./intents.js"
import { obtenerRespuesta } from "./responses.js"
import { guardarAprendizaje, cargarMemoria } from "./memoria.js"
import { sendMessage } from "./sendMessage.js"

dotenv.config()
const app = express()
app.use(bodyParser.json())

app.post("/webhook", async (req, res) => {
  try {
    const mensaje = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || ""
    if (!mensaje) return res.sendStatus(200)

    console.log("📩 Mensaje recibido:", mensaje)

    const memoria = cargarMemoria()
    const intencion = detectarIntencion(mensaje)
    const respuestaClinica = generarRespuestaClinica(mensaje)
    const respuestaEmpatica = obtenerRespuesta(intencion, mensaje)

    const respuestaFinal =
      respuestaClinica && respuestaClinica !== "general"
        ? respuestaClinica
        : respuestaEmpatica

    await sendMessage(respuestaFinal)
    guardarAprendizaje(mensaje, respuestaFinal, intencion)

    console.log("✅ Enviado:", respuestaFinal)
    res.sendStatus(200)
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error)
    res.sendStatus(500)
  }
})

app.listen(10000, () => {
  console.log("✅ Zara Body Elite corriendo en puerto 10000")
  console.log("🌐 Módulos activos: motor clínico + empatía + aprendizaje + agenda")
})
