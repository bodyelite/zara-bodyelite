import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import os from "os";

export async function downloadFile(url, filename, headers = {}) {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Error descargando archivo: ${response.statusText}`);

    const tempPath = path.join(os.tmpdir(), filename);
    const fileStream = fs.createWriteStream(tempPath);

    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", reject);
      fileStream.on("finish", resolve);
    });

    return tempPath;
  } catch (error) {
    console.error("❌ Fallo en descarga:", error);
    return null;
  }
}
