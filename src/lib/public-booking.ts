import type {ParsedOfferId} from "@/lib/tour-catalog";
import {getPublicProductBySlug} from "@/app/actions/catalog";

export async function resolvePublicOfferId(value: string): Promise<ParsedOfferId | null> {
  const match = /^(.*)--(base|economic|standard|premium)$/.exec(value);
  if (!match) return null;
  const [, slug, selected] = match;
  const product = await getPublicProductBySlug(slug);
  if (!product) return null;
  if (selected === "base") {
    if (product.pricing.kind !== "single") return null;
    return {tour: product, tier: "base", price: product.pricing.amount, pricing: product.pricing};
  }
  if (product.pricing.kind !== "offers") return null;
  const tier = selected as "economic" | "standard" | "premium";
  return {tour: product, tier, price: product.pricing.tiers[tier], pricing: product.pricing};
}
