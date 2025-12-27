import axios from "axios";
import fs from "fs";
import path from "path";

export async function downloadFile(url, filename) {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, filename);
    const writer = fs.createWriteStream(filePath);

    try {
        // INTENTO 1: Petición inicial (sin seguir redirecciones automáticas)
        let response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            headers: { 
                'Authorization': `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
                'User-Agent': 'curl/7.64.1' // Disfraz de sistema
            },
            maxRedirects: 0, // 🛑 IMPORTANTE: No seguir redirección automáticamente
            validateStatus: status => status >= 200 && status < 400 // Aceptar 3xx como éxito temporal
        });

        // MANEJO MANUAL DE REDIRECCIÓN (El secreto para evitar el 401)
        if (response.status === 301 || response.status === 302) {
            const newUrl = response.headers.location;
            console.log("🔄 Redirección detectada. Re-enviando credenciales...");
            
            // Re-lanzamos la petición a la nueva URL con el Token explícito
            response = await axios({
                method: 'GET',
                url: newUrl,
                responseType: 'stream',
                headers: { 
                    'Authorization': `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
                    'User-Agent': 'curl/7.64.1'
                }
            });
        }

        // Guardar el flujo en archivo
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
        console.error("❌ Error Descarga:", error.message);
        throw error;
    }
}
