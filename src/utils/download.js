import fs from "fs";
import path from "path";
import https from "https";

export async function downloadFile(url, filename) {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, filename);
    
    return new Promise((resolve, reject) => {
        const execDownload = (targetUrl) => {
            const req = https.get(targetUrl, {
                headers: {
                    'Authorization': `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
                    'User-Agent': 'curl/7.64.1'
                }
            }, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    if (res.headers.location) {
                        execDownload(res.headers.location);
                        return;
                    }
                }
                
                if (res.statusCode !== 200) {
                    reject(new Error(`Fallo descarga: ${res.statusCode}`));
                    return;
                }

                const fileStream = fs.createWriteStream(filePath);
                res.pipe(fileStream);

                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(filePath);
                });
            });

            req.on('error', (err) => {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                reject(err);
            });
        };

        execDownload(url);
    });
}
