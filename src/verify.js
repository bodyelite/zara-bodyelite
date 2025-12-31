import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

try {
    console.log("🔍 ZARA BONITA: Verificando integridad de archivos...");
    
    // Chequeo de seguridad básico
    if (!CLINICA || Object.keys(CLINICA).length === 0) throw new Error("⚠️ PELIGRO: El archivo CLINICA.js está vacío o roto.");
    if (!NEGOCIO.staff_alertas) throw new Error("⚠️ PELIGRO: Se borró la configuración del STAFF en BUSINESS.js.");

    console.log("✅ TODO CORRECTO. El sistema está sano y listo para deploy.");
    process.exit(0);
} catch (e) {
    console.error("❌ DETENIDO: Hay un error de sintaxis en tus cambios.");
    console.error(e.message);
    process.exit(1);
}
