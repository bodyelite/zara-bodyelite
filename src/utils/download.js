import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import os from "os";

export async function downloadFile(url, name, headers = {}) {
  try {
    const res = await fetch(url, { headers, redirect: 'follow' });
    if (!res.ok) throw new Error(res.statusText);
    const temp = path.join(os.tmpdir(), name);
    const stream = fs.createWriteStream(temp);
    await new Promise((resolve, reject) => { res.body.pipe(stream); res.body.on("error", reject); stream.on("finish", resolve); });
    return temp;
  } catch (e) { return null; }
}
