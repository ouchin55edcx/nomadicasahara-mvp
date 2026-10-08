import {parseOfferId, type ParsedOfferId} from "@/lib/tour-catalog";
import {getPublicProductBySlug} from "@/app/actions/catalog";

export async function resolvePublicOfferId(value: string): Promise<ParsedOfferId | null> {
  const staticOffer = parseOfferId(value);
  if (staticOffer) return staticOffer;
  if (!value.endsWith("--base")) return null;
  const slug = value.slice(0, -"--base".length);
  const product = await getPublicProductBySlug(slug);
  if (!product || product.pricing.kind !== "single") return null;
  return {tour: product, tier: "base", price: product.pricing.amount, pricing: product.pricing};
}
