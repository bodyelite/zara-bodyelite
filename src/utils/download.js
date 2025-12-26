import axios from "axios";
import fs from "fs";

export async function downloadFile(url, outputPath) {
    const writer = fs.createWriteStream(outputPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        headers: { Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}` }
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(outputPath));
        writer.on('error', reject);
    });
}
