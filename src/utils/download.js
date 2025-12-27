import fs from "fs";
import path from "path";
import axios from "axios";

export async function downloadFile(url, filename) {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, filename);
    const writer = fs.createWriteStream(filePath);

    // ESTRATEGIA: Usar axios con headers explícitos pero SIN User-Agent custom (a veces bloquea)
    // y asegurando que el token vaya en el header Authorization correctamente.
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            headers: {
                'Authorization': `Bearer ${process.env.PAGE_ACCESS_TOKEN}`
            }
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', (err) => {
                writer.close();
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                reject(err);
            });
        });

    } catch (error) {
        if (writer) writer.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        // Si falla con header, intentamos una segunda vez pasando el token como query param (Backup)
        // Esto a veces es necesario para ciertos CDNs de Meta.
        console.error("Fallo descarga normal, error:", error.message);
        throw error;
    }
}
