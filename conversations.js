import fs from "fs";

const FILE_PATH = "./data/conversations.json";

export function saveConversation(user, input, output) {
  const timestamp = new Date().toISOString();
  const record = { user, input, output, timestamp };

  try {
    let data = [];
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf8");
      data = raw ? JSON.parse(raw) : [];
    }
    data.push(record);
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error al guardar conversación:", err);
  }
}
