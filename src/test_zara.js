import { generarRespuestaIA } from "./services/openai.js";

async function test() {
    console.log("🤖 AUDITORÍA DE ZARA V4100 (ENZIMAS + DIAGNÓSTICO)...\n");

    // TEST 1: LIPOLÍTICOS
    console.log("🔻 TEST 1: ¿CONOCE LOS LIPOLÍTICOS?");
    const r1 = await generarRespuestaIA([
        { role: "user", content: "Hola" },
        { role: "assistant", content: "¿Rostro o Cuerpo?" },
        { role: "user", content: "Cuerpo, tengo guata" },
        { role: "assistant", content: "Usa Lipo Express..." },
        { role: "user", content: "¿Usan lipolíticos?" } 
    ], "Juan");
    console.log(`ZARA: ${r1}\n--------------------\n`);

    // TEST 2: PIEL SECA (No debe dar el caro)
    console.log("🔻 TEST 2: DIAGNÓSTICO PIEL SECA");
    const r2 = await generarRespuestaIA([
        { role: "user", content: "Tengo la piel seca y sin brillo" }
    ], "Maria");
    console.log(`ZARA: ${r2}\n--------------------\n`);
}
test();
