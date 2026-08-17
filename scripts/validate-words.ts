import { RAW } from "../src/data/raw";
import { expand } from "../src/data/expand";
import { checkIntegrity } from "../src/lib/integrity";
import { BATCHES } from "../src/data/batches";

const allRows = [...RAW, ...BATCHES.flatMap((b) => b.rows)];
const words = allRows.map(expand);

console.log(`בודק ${words.length} רשומות...`);
const issues = checkIntegrity(words);

if (issues.length === 0) {
  console.log("✓ כל הרשומות תקינות.");
  process.exit(0);
} else {
  console.error(`✗ נמצאו ${issues.length} בעיות:`);
  issues.forEach((i) => console.error("  " + i));
  process.exit(1);
}
