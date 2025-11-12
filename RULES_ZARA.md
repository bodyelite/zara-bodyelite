# Reglas estrictas de conexión y respuesta de Zara (no modificables)

1) **EntryPoint único**
   - Archivo: `server.js`.
   - Procfile: `web: node server.js`.

2) **Router de canal obligatorio (server.js)**
   - `isIG = String(entry.id) === String(process.env.IG_USER_ID)`
   - `platform = isIG ? "instagram" : "whatsapp"`

3) **Firma fija de envío**
   - `sendMessage(to, text, platform)` sin valor por defecto.
   - Toda llamada debe pasar `platform`.

4) **Doble rama permanente en sendMessage**
   - IG/Messenger → `https://graph.facebook.com/v19.0/me/messages`
     - Body: `{ recipient:{ id }, message:{ text } }`
   - WhatsApp → `https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages`
     - Body: `{ messaging_product:"whatsapp", to, type:"text", text:{ body } }`

5) **Variables de entorno inmutables**
   - `VERIFY_TOKEN`, `PAGE_ACCESS_TOKEN`, `PHONE_NUMBER_ID`, `IG_USER_ID`, `PORT`.

6) **Versión Graph unificada**
   - v19.0 para ambos canales (no mezclar).

7) **Dependencias reproducibles**
   - Usar `npm ci`.
   - Si se usa `dotenv`, debe estar en `package.json`.

8) **Logs obligatorios antes de enviar**
   - Registrar: `platform`, `endpoint`, `destinatario`.
   - En dev: si IG sin rol → no enviar y log `IG_DEV_BLOCK`.

9) **Checklist de pre-deploy**
   - Único `app.listen` en `server.js`.
   - Todas las llamadas `sendMessage` con `platform`.
   - Exactamente 2 endpoints de Graph (IG y WSP).
   - Pruebas con payloads IG/WSP.

10) **Rollback con tags por release**
   - Tag en cada deploy: `git tag -a zara_release_YYMMDD_HHMM -m "release" && git push --tags`.
   - Rollback: `git reset --hard <tag_estable> && git push origin main --force`.
