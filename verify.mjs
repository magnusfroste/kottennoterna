// Kontrollerar uppgiftsgeneratorn i app.js: antalen ligger inom nivåns gräns,
// högarna är aldrig lika, "mest" pekar på den större högen och skillnaden
// stämmer med nivåns svårighetsgrad.
//   node verify.mjs
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./public/app.js", import.meta.url), "utf8");
const start = src.indexOf("function heltal(");
const end = src.indexOf("* 3. Ljud");
if (start < 0 || end < 0) throw new Error("hittar inte den rena generatorn i app.js");
const ren = src.slice(start, src.lastIndexOf("/*", end));
const G = eval("(function(){" + ren + "\nreturn {bygg:bygg};})()");

let seed = 987654321;
Math.random = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

let fel = 0;
const antal = { 1: 0, 2: 0, 3: 0 };
const kolla = (c, m, p) => { if (!c) { fel++; if (fel <= 20) console.log("FEL", m, JSON.stringify(p)); } };

const band = { 1: [2, 4, 6], 2: [1, 2, 7], 3: [1, 1, 9] };

for (const niva of [1, 2, 3]) {
  for (let k = 0; k < 3000; k++) {
    const p = G.bygg(niva);
    antal[niva]++;
    const [dmin, dmax, max] = band[niva];
    kolla(Number.isInteger(p.v) && Number.isInteger(p.h), "antal är inte heltal", p);
    kolla(p.v >= 1 && p.v <= max && p.h >= 1 && p.h <= max, "antal utanför nivåns gräns", p);
    kolla(p.v !== p.h, "högarna är lika", p);
    kolla(Math.abs(p.v - p.h) === p.skillnad, "skillnaden stämmer inte", p);
    kolla(p.skillnad >= dmin && p.skillnad <= dmax, "skillnaden ligger utanför nivån", p);
    kolla((p.v > p.h ? "v" : "h") === p.mest, "'mest' pekar inte på den större högen", p);
    kolla(p.niva === niva, "fel nivå", p);
  }
}

console.log(`\n${antal[1] + antal[2] + antal[3]} uppgifter (nivå 1: ${antal[1]}, 2: ${antal[2]}, 3: ${antal[3]}). ${fel} fel.`);
process.exit(fel ? 1 : 0);
