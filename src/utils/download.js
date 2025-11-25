import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import os from "os";

export async function downloadFile(url, filename, headers = {}) {
  try {
    console.log(`📥 Descargando desde: ${url.substring(0, 50)}...`);
    
    const response = await fetch(url, { 
        headers: headers,
        redirect: 'follow' // Importante para seguir la redirección de WhatsApp
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const tempPath = path.join(os.tmpdir(), filename);
    const fileStream = fs.createWriteStream(tempPath);

    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", reject);
      fileStream.on("finish", resolve);
    });

    console.log("✅ Archivo guardado en:", tempPath);
    return tempPath;
  } catch (error) {
    console.error("❌ Fallo crítico en descarga:", error.message);
    return null;
  }
}
