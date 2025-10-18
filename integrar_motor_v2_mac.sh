#!/bin/bash
# Integración limpia motor_clinico_v2.js con core_zara_v5.js (versión macOS)

echo "🔧 Integrando motor_clinico_v2.js con core_zara_v5.js..."

if [ -f "core_zara_v5.js" ]; then

  # Quitar referencias viejas
  sed -i '' '/motor_clinico_v1/d' core_zara_v5.js
  sed -i '' '/motor_clinico.js/d' core_zara_v5.js

  # Agregar import si no existe
  if ! grep -q "motor_clinico_v2" core_zara_v5.js; then
    echo 'const { clasificarPlan } = require("./motor_clinico_v2");' | cat - core_zara_v5.js > temp && mv temp core_zara_v5.js
  fi

  # Insertar llamada al clasificador si no existe
  if ! grep -q "clasificarPlan" core_zara_v5.js; then
    awk '/function generarRespuesta/{print;print "    const planDetectado = clasificarPlan(intent);";next}1' core_zara_v5.js > temp && mv temp core_zara_v5.js
  fi

  echo "✅ motor_clinico_v2.js integrado correctamente con core_zara_v5.js"

else
  echo "❌ Archivo core_zara_v5.js no encontrado en el directorio actual."
  exit 1
fi

git add core_zara_v5.js
git commit -m "v7.3 integración corregida motor_clinico_v2.js (macOS compatible)"
git push origin main

echo "🚀 Despliegue enviado. Verifica en Render que aparezca 'motor_clinico_v2.js activo'."
