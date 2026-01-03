import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

try {
    console.log("🔍 ZARA 7.0: Verificando integridad...");
    if (!CLINICA || Object.keys(CLINICA).length === 0) throw new Error("⚠️ ERROR: CLINICA.js no carga.");
    if (!NEGOCIO.staff_alertas) throw new Error("⚠️ ERROR: BUSINESS.js no carga.");
    console.log("✅ SISTEMA SANO. ZARA LISTA PARA VENDER.");
    process.exit(0);
} catch (e) {
    console.error("❌ ERROR:", e.message);
    process.exit(1);
}
