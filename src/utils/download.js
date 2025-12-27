import axios from "axios";
import fs from "fs";
import path from "path";

export async function downloadFile(url, filename) {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, filename);
    const writer = fs.createWriteStream(filePath);

    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream',
            headers: { 
                'Authorization': `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
                'User-Agent': 'curl/7.64.1'
            }
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', (err) => {
                writer.close();
                fs.unlink(filePath, () => {}); 
                reject(err);
            });
        });
    } catch (error) {
        if (writer) writer.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw error;
    }
}
