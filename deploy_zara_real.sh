#!/bin/bash
echo "🚀 Integrando conocimientos clínicos y comerciales de ZARA real..."

# 1. Confirmar y preparar cambios locales
git add .
git commit -m "Integración completa de conocimientos clínicos, precios y respuestas ZARA real"
echo "✅ Commit confirmado."

# 2. Subir a GitHub
echo "📤 Subiendo a GitHub..."
git push origin main --force
echo "✅ Push completado."

# 3. Redeploy automático en Render
echo "⚙️ Iniciando redeploy en Render..."
curl -X POST "https://api.render.com/deploy/srv-d3qlujmmcj7s73br0cg0?key=HXJVEhO-Ta0"

echo "✅ Integración y redeploy completados correctamente."
