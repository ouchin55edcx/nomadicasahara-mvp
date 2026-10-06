import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {runInNewContext} from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = readFileSync(new URL("../src/data/static/tour-catalog.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
const module = {exports: {}};
runInNewContext(compiled, {module, exports: module.exports}, {filename: "tour-catalog.ts"});
const records = module.exports.allTourRecords;
const failures = [];
const locales = ["en", "es", "pt"];
const tiers = ["economic", "standard", "premium"];
const requiredIds = ["agafay-sunset-dinner", "merzouga-3-days", "hammam-massage", "marrakech-private-city", "zagora-2-days", "marrakech-fes-4-days", "sahara-5-days", "agafay-quad-camel-dinner", "fantasia-dinner-show", "ouzoud-private-day", "hammam-traditional", "marrakech-airport-transfer", "saidia-beach-getaway"];

function walk(value, path) {
  if (Array.isArray(value)) return value.forEach((item, index) => walk(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return;
  const keys = Object.keys(value);
  if (keys.length === 3 && locales.every((locale) => keys.includes(locale))) {
    for (const locale of locales) if (typeof value[locale] !== "string" || !value[locale].trim()) failures.push(`${path}.${locale} must be a non-empty string`);
    return;
  }
  for (const key of keys) {
    if (/^(rating|reviewCount|reviews|discount|cancellation|cancellationPolicy)$/i.test(key)) failures.push(`${path}.${key} is not allowed in the mock tour catalog`);
    walk(value[key], `${path}.${key}`);
  }
}

const ids = new Set();
const slugs = new Set();
for (const id of requiredIds) if (!records.some((tour) => tour.id === id)) failures.push(`missing required tour ${id}`);
for (const tour of records) {
  if (ids.has(tour.id)) failures.push(`duplicate id ${tour.id}`);
  if (slugs.has(tour.slug)) failures.push(`duplicate slug ${tour.slug}`);
  ids.add(tour.id); slugs.add(tour.slug);
  if (!tour.details || !tour.details.layout) failures.push(`${tour.id} is missing details/layout`);
  if (!Array.isArray(tour.details?.highlights) || !tour.details.highlights.length) failures.push(`${tour.id} is missing highlights`);
  if (!Array.isArray(tour.details?.overview) || !tour.details.overview.length) failures.push(`${tour.id} is missing overview paragraphs`);
  if (!Array.isArray(tour.details?.faqs) || !tour.details.faqs.length) failures.push(`${tour.id} is missing FAQs`);
  if (tour.details?.layout === "multi-day") {
    if (!Array.isArray(tour.details.days) || tour.details.days.length !== tour.durationDays) failures.push(`${tour.id} days must match durationDays`);
  } else if (tour.details?.days) failures.push(`${tour.id} has days but is not a multi-day layout`);
  if (tour.recommendedTier !== undefined && !tiers.includes(tour.recommendedTier)) failures.push(`${tour.id} has invalid recommendedTier ${tour.recommendedTier}`);
  if (tour.stays !== undefined && tour.details?.layout !== "multi-day") failures.push(`${tour.id} has stays but is not a circuit`);
  if (tour.transferAddon !== undefined && typeof tour.transferAddon !== "boolean") failures.push(`${tour.id} transferAddon must be boolean`);
  if (tour.transferAddon && tour.details?.layout !== "multi-day") failures.push(`${tour.id} enables transfer add-ons outside a circuit`);
  if (tour.stays && !tour.durationNights) failures.push(`${tour.id} needs durationNights when stays are listed`);
  if (tour.stays && tour.durationNights) {
    for (const tier of tiers) {
      const nights = (tour.stays[tier] ?? []).flatMap((stay) => stay.nights);
      const expected = Array.from({length: tour.durationNights}, (_, index) => index + 1);
      if (nights.slice().sort((a, b) => a - b).join(",") !== expected.join(",")) failures.push(`${tour.id}.${tier} stays must cover every night exactly once`);
      for (const stay of tour.stays[tier] ?? []) walk(stay, `tour:${tour.id}.stays.${tier}`);
    }
  }
  if (tour.details?.layout !== "multi-day" && !Array.isArray(tour.details?.steps)) failures.push(`${tour.id} needs steps for its ${tour.details?.layout} layout`);
  if (tour.id === "marrakech-airport-transfer" && tour.details?.layout !== "service") failures.push(`${tour.id} must use service layout`);
  if (["hammam-massage", "hammam-traditional"].includes(tour.id) && tour.details?.layout !== "wellness") failures.push(`${tour.id} must use wellness layout`);
  if (tour.pricing.kind === "offers") {
    if (Object.keys(tour.pricing.tiers).sort().join(",") !== [...tiers].sort().join(",")) failures.push(`${tour.id} requires all three offer tiers`);
    for (const amount of Object.values(tour.pricing.tiers)) if (!Number.isFinite(amount) || amount <= 0) failures.push(`${tour.id} has an invalid offer price`);
    for (const item of tour.pricing.features) if (Object.keys(item.tiers).sort().join(",") !== [...tiers].sort().join(",")) failures.push(`${tour.id}.${item.id} requires all three feature tiers`);
  } else if (tour.pricing.kind === "single") {
    if ("tiers" in tour.pricing || "features" in tour.pricing) failures.push(`${tour.id} single-price tour must not have offer tiers`);
  } else if (tour.pricing.kind !== "quote") failures.push(`${tour.id} has unknown pricing kind`);
  walk(tour, `tour:${tour.id}`);
}

const namespaceNames = ["TourDetail", "TourOffers", "Booking", "Contact", "Legal"];
const messageTrees = locales.map((locale) => JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")));
for (const namespace of namespaceNames) {
  const shape = (value) => JSON.stringify(Object.keys(value).sort().map((key) => [key, value[key] && typeof value[key] === "object" ? JSON.parse(shape(value[key])) : null]));
  const expected = shape(messageTrees[0][namespace] ?? {});
  for (let index = 1; index < locales.length; index++) if (shape(messageTrees[index][namespace] ?? {}) !== expected) failures.push(`${namespace} keys do not match in ${locales[index]}`);
}

if (failures.length) {
  console.error(`Catalog validation failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${records.length} tour records, localized content, layouts, and pricing rules.`);
}
