import fs from "fs";
import fetch from "node-fetch";
import path from "path";

export async function downloadFile(url, filename) {
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const headers = { "Authorization": `Bearer ${token}` };
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`Fallo descarga: ${response.statusText}`);
        const dest = path.resolve("/tmp", filename);
        const fileStream = fs.createWriteStream(dest);
        return new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on("error", reject);
            fileStream.on("finish", () => resolve(dest));
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}
