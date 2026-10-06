import type {TourRecord} from "@/types/tour-catalog";
import type {TransferTier} from "@/lib/pricing";

export type OfferQueryState = {
  date: string;
  travelers: number;
  arrival: TransferTier;
  departure: TransferTier;
  diff: boolean;
};

const tiers = new Set<TransferTier>(["none", "economic", "standard", "premium"]);

export function parseOfferQuery(query: {date?: string; travelers?: string; arrival?: string; departure?: string; diff?: string}, tour: TourRecord): OfferQueryState {
  const count = Number(query.travelers);
  const travelers = Number.isInteger(count) && count >= 1 && count <= 20 ? count : 2;
  const dateMatch = query.date?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const year = dateMatch ? Number(dateMatch[1]) : 0;
  const month = dateMatch ? Number(dateMatch[2]) : 0;
  const day = dateMatch ? Number(dateMatch[3]) : 0;
  const parsedDate = dateMatch ? new Date(Date.UTC(year, month - 1, day)) : null;
  const validDate = parsedDate && parsedDate.getUTCFullYear() === year && parsedDate.getUTCMonth() === month - 1 && parsedDate.getUTCDate() === day ? query.date! : "";
  const arrival = tour.transferAddon && tiers.has(query.arrival as TransferTier) ? query.arrival as TransferTier : "none";
  const departure = tour.transferAddon && tiers.has(query.departure as TransferTier) ? query.departure as TransferTier : "none";
  return {date: validDate, travelers, arrival, departure, diff: query.diff === "1"};
}
