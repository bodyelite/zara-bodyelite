import fs from "fs";

const ruta = "./memoria_db.json";

// ------------------------------------------------------------
// CARGAR MEMORIA COMPLETA
// ------------------------------------------------------------
function cargarDB() {
  try {
    if (!fs.existsSync(ruta)) return {};
    const raw = fs.readFileSync(ruta, "utf-8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

// ------------------------------------------------------------
// GUARDAR MEMORIA COMPLETA
// ------------------------------------------------------------
function guardarDB(db) {
  try {
    fs.writeFileSync(ruta, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("Error guardando memoria:", error);
  }
}

// ------------------------------------------------------------
// LEER MEMORIA DE UN USUARIO
// ------------------------------------------------------------
export function leerMemoria(user) {
  const db = cargarDB();

  if (!db[user]) {
    db[user] = {
      zona: null,
      ultimo_plan: null,
      intentosAgenda: 0
    };
    guardarDB(db);
  }

  return db[user];
}

// ------------------------------------------------------------
// GUARDAR MEMORIA DE UN USUARIO
// ------------------------------------------------------------
export function guardarMemoria(user, data) {
  const db = cargarDB();

  db[user] = {
    ...db[user],
    ...data
  };

  guardarDB(db);
}
