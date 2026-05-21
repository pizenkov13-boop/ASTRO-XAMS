import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { generateGrammarUnits } from "../src/data/grammar/generate";

const outDir = join(process.cwd(), "src", "data", "grammar");
mkdirSync(outDir, { recursive: true });
const units = generateGrammarUnits();
writeFileSync(join(outDir, "units.json"), JSON.stringify(units));
console.log(`Generated ${units.length} grammar units.`);
