import type {Locale} from "@/i18n/routing";
import type {PriceUnit, Tier} from "@/types/tour-catalog";

export type TransferTier = "none" | Tier;

export type PriceBreakdown = {
  baseUnitPrice: number;
  travelers: number;
  baseTotal: number;
  arrivalTotal: number;
  departureTotal: number;
  total: number;
};

const roundMoney = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

export function calculatePrice(input: {
  unit: PriceUnit;
  tierPrice: number;
  travelers: number;
  arrival?: TransferTier;
  departure?: TransferTier;
  transferPrices?: Record<Tier, number>;
}): PriceBreakdown {
  const travelers = Math.max(1, Math.floor(input.travelers));
  const chargePerTraveler = input.unit === "person" || input.unit === "ticket";
  const baseTotal = roundMoney(input.tierPrice * (chargePerTraveler ? travelers : 1));
  const arrivalTotal = input.arrival && input.arrival !== "none" ? roundMoney(input.transferPrices?.[input.arrival] ?? 0) : 0;
  const departureTotal = input.departure && input.departure !== "none" ? roundMoney(input.transferPrices?.[input.departure] ?? 0) : 0;
  return {baseUnitPrice: roundMoney(input.tierPrice), travelers, baseTotal, arrivalTotal, departureTotal, total: roundMoney(baseTotal + arrivalTotal + departureTotal)};
}

export function formatPrice(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(locale, {style: "currency", currency: "EUR", maximumFractionDigits: 0}).format(amount);
}
