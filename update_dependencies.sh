#!/bin/bash
echo "🔄 Actualizando dependencias y bloqueando versiones exactas..."
npm install
if [ $? -eq 0 ]; then
  echo "✅ Dependencias instaladas correctamente."
  git add package.json package-lock.json
  git commit -m "Actualización automática de dependencias y bloqueo de versiones"
  git push origin main
  echo "🚀 Cambios enviados a GitHub. Render se redeplegará automáticamente."
else
  echo "❌ Error durante la instalación. Revisa tu conexión o dependencias."
fi
