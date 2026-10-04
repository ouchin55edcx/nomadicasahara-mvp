import { ChevronRight, Compass, Search } from "lucide-react";
import type { CatalogConfig } from "@/data/catalog";
import { getCatalogProducts } from "@/data/catalog";
import CatalogFilters, { CatalogFilterTrigger } from "@/components/catalog/CatalogFilters";
import ProductCard from "@/components/catalog/ProductCard";
import HotelCatalogPage from "@/components/catalog/HotelCatalogPage";
import CatalogLandingPage from "@/components/catalog/CatalogLandingPage";
import {Link} from "@/i18n/navigation";

type Query = Record<string, string | string[] | undefined>;

export default function CatalogPage({ config, query }: { config: CatalogConfig; query: Query }) {
  if (config.kind === "hotel") return <HotelCatalogPage config={config} query={query} />;
  return <CatalogLandingPage config={config} query={query} />;
}