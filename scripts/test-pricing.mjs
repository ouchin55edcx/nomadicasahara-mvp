import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {runInNewContext} from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
function loadTs(file, exportedName) {
  const source = readFileSync(new URL(file, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
  const module = {exports: {}};
  runInNewContext(compiled, {module, exports: module.exports}, {filename: file});
  return module.exports[exportedName];
}
const calculatePrice = loadTs("../src/lib/pricing.ts", "calculatePrice");
const parseOfferQuery = loadTs("../src/lib/tour-query.ts", "parseOfferQuery");
const tours = loadTs("../src/data/static/tour-catalog.ts", "allTourRecords");
const get = (id) => tours.find((tour) => tour.id === id);
const transfer = get("marrakech-airport-transfer");
const transferPrices = transfer.pricing.tiers;
const checks = [
  ["Merzouga Standard, 3 travelers", calculatePrice({unit: "person", tierPrice: get("merzouga-3-days").pricing.tiers.standard, travelers: 3}).total, 684],
  ["Merzouga Standard with two Standard transfers", calculatePrice({unit: "person", tierPrice: get("merzouga-3-days").pricing.tiers.standard, travelers: 3, arrival: "standard", departure: "standard", transferPrices}).total, 724],
  ["Airport transfer vehicle price ignores travelers", calculatePrice({unit: transfer.pricing.unit, tierPrice: transfer.pricing.tiers.standard, travelers: 4}).total, 20],
  ["Agafay Economic for two", calculatePrice({unit: "person", tierPrice: get("agafay-sunset-dinner").pricing.tiers.economic, travelers: 2}).total, 58],
  ["Valid date query survives local timezone parsing", parseOfferQuery({date: "2026-11-20"}, get("merzouga-3-days")).date, "2026-11-20"],
  ["Impossible date query is rejected", parseOfferQuery({date: "2026-02-30"}, get("merzouga-3-days")).date, ""],
];
const failed = checks.filter(([, actual, expected]) => actual !== expected);
for (const [name, actual, expected] of checks) console.log(`${actual === expected ? "PASS" : "FAIL"} ${name}: ${actual} (expected ${expected})`);
if (failed.length) process.exitCode = 1;
