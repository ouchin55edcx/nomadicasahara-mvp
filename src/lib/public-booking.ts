import type {ParsedOfferId} from "@/lib/tour-catalog";
import {getPublicProductBySlug} from "@/app/actions/catalog";

export async function resolvePublicOfferId(value: string): Promise<ParsedOfferId | null> {
  const match = /^(.*)--base$/.exec(value);
  if (!match) return null;
  const [, slug] = match;
  const product = await getPublicProductBySlug(slug);
  if (!product) return null;
  if (product.pricing.kind !== "single") return null;
  return {tour: product, tier: "base", price: product.pricing.amount, pricing: product.pricing};
}
