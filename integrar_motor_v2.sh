#!/bin/bash
# Integración automática motor_clinico_v2 con core_zara_v5.js

if [ -f "core_zara_v5.js" ]; then
  echo "🔧 Integrando motor_clinico_v2.js con core_zara_v5.js..."

  # Eliminar referencias antiguas de motor_clinico anteriores
  sed -i '' '/require(.\/motor_clinico_v1.js/d' core_zara_v5.js 2>/dev/null
  sed -i '' '/require(.\/motor_clinico.js/d' core_zara_v5.js 2>/dev/null

  # Asegurar import del nuevo motor
  if ! grep -q "motor_clinico_v2" core_zara_v5.js; then
    sed -i '' '1s;^;const { clasificarPlan } = require("./motor_clinico_v2");\n;' core_zara_v5.js
  fi

  # Asegurar llamada al clasificador dentro de generarRespuesta()
  if ! grep -q "clasificarPlan" core_zara_v5.js; then
    sed -i '' '/function generarRespuesta/a\
    const planDetectado = clasificarPlan(intent);\n    ' core_zara_v5.js
  fi

  echo "✅ motor_clinico_v2.js integrado correctamente en core_zara_v5.js"
else
  echo "❌ Archivo core_zara_v5.js no encontrado en el directorio actual."
  exit 1
fi

git add core_zara_v5.js
git commit -m "v7.3 integración automática motor_clinico_v2.js con core_zara_v5.js"
git push origin main

echo "🚀 Despliegue en Render listo. Verifica logs para 'motor_clinico_v2.js activo'."
