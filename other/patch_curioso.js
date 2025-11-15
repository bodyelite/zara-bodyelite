import fs from "fs";

let file = fs.readFileSync("motor_respuesta.js", "utf8");

file = file.replace(
  /if \(t\.includes\("precio"\)[\s\S]+?return null;/,
  `$&
  if (t.includes("certificado") || t.includes("certificados") || t.includes("autorizado") || t.includes("autorización")) 
    return "📋 Sí, todos los equipos están certificados y cuentan con registro sanitario vigente. Body Elite trabaja bajo estándares clínicos de uso profesional.";

  if (t.includes("medico") || t.includes("doctor") || t.includes("doctora") || t.includes("profesional a cargo"))
    return "⚕️ Cada evaluación es supervisada por profesionales de salud con formación en estética avanzada y respaldo médico.";

  if (t.includes("botox") || t.includes("toxina") || t.includes("relleno") || t.includes("acido") || t.includes("ácido hialurónico"))
    return "💉 Aplicamos toxina botulínica y ácido hialurónico según protocolos médicos. Los productos son originales y aprobados por ISP y ANMAT.";

  if (t.includes("aprobado") || t.includes("regulado") || t.includes("isp") || t.includes("anmat"))
    return "✅ Todos los productos y tecnologías de Body Elite están aprobados por ISP Chile y ANMAT Argentina para uso clínico profesional.";
`
);

fs.writeFileSync("motor_respuesta.js", file);
