import fs from "fs";

let file = fs.readFileSync("motor_respuesta.js", "utf8");

file = file.replace(
  /if \(t\.includes\("precio"\)[\s\S]+?return null;/,
  `$&
  if (t.includes("exosoma") || t.includes("exosomas"))
    return "🧬 Los exosomas son vesículas celulares con factores de crecimiento y proteínas que estimulan la regeneración profunda del tejido. En Body Elite se aplican para mejorar textura, firmeza y luminosidad de la piel.";

  if (t.includes("plasma") || t.includes("plaquetas") || t.includes("prp"))
    return "💉 El Plasma Rico en Plaquetas (PRP) utiliza tus propios factores de crecimiento para regenerar piel, mejorar cicatrices y estimular colágeno de forma natural. Procedimiento seguro y avalado médicamente.";

  if (t.includes("pink glow") || t.includes("pinkglow") || t.includes("vitaminas") || t.includes("bioestimulante"))
    return "🌸 Pink Glow es un biorevitalizante dérmico con péptidos, antioxidantes y ácido hialurónico. Restaura el tono, mejora la luminosidad y rehidrata la piel con efecto inmediato.";
`
);

fs.writeFileSync("motor_respuesta.js", file);
