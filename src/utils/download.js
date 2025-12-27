import fs from "fs";
import path from "path";
import https from "https";
import axios from "axios";

export async function downloadFile(url, filename) {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, filename);

    try {
        // PASO 1: Obtener la URL real de descarga (Redirección)
        const response = await axios({
            method: 'GET',
            url: url,
            headers: { 'Authorization': `Bearer ${process.env.PAGE_ACCESS_TOKEN}` },
            maxRedirects: 0, // No seguir redirección automáticamente
            validateStatus: status => status >= 200 && status < 400
        });

        // Si es redirección manual (302)
        let downloadUrl = url;
        if (response.status === 302 || response.status === 301) {
            downloadUrl = response.headers.location;
        } else if (response.data && response.data.url) {
             // A veces la API devuelve un JSON con la URL
             downloadUrl = response.data.url;
        }

        // PASO 2: Descargar desde la URL del CDN (SIN TOKEN)
        // El CDN de Facebook suele fallar si le envías el Bearer Token de la API
        const writer = fs.createWriteStream(filePath);
        
        const streamResponse = await axios({
            method: 'GET',
            url: downloadUrl,
            responseType: 'stream',
            // NOTA IMPORTANTE: AQUI NO ENVIAMOS AUTHORIZATION
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ZaraBot/1.0)'
            }
        });

        streamResponse.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', (err) => {
                writer.close();
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                reject(err);
            });
        });

    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.error("Fallo descarga 2 pasos:", error.message);
        throw error;
    }
}
