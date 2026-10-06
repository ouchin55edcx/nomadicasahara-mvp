import Image from "next/image";
import {
  Car,
  Compass,
  Home,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Tent,
  User,
  Users,
  Wallet,
  Waves,
} from "lucide-react";

import type { Tile } from "@/data/landing/types";
import { cn } from "@/lib/utils";
import {Link} from "@/i18n/navigation";

const labels = {
  explore: "Explorar",
} as const;

const icons = {
  pool: Waves,
  spa: Sparkles,
  family: Users,
  adults: User,
  star: Star,
  riad: Home,
  wave: Waves,
  tent: Tent,
  car: Car,
  chat: MessageCircle,
  guide: Compass,
  lotus: Leaf,
  shield: ShieldCheck,
  tag: Tag,
  users: Users,
  wallet: Wallet,
} as const;

type CategoryTilesProps = {
  tiles: Tile[];
  variant?: "mosaic" | "grid";
  columns?: 2 | 3 | 4 | 6;
};

const mosaicClass: Record<NonNullable<CategoryTilesProps["columns"]>, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export default function CategoryTiles({
  tiles,
  variant = "grid",
  columns = 4,
}: CategoryTilesProps) {
  if (tiles.length === 0) return null;

  if (variant === "mosaic") {
    return (
      <ul className={cn("grid gap-3", mosaicClass[columns])}>
        {tiles.map((tile) => {
          const body = (
            <>
              {tile.image ? (
                <Image
                  src={tile.image}
                  alt={tile.alt ?? tile.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <span aria-hidden="true" className="absolute inset-0 bg-[var(--accent-soft)]" />
              )}
              <span aria-hidden="true" className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/25" />
              <span className="relative flex w-full flex-col p-4">
                <span className="text-[15px] font-semibold uppercase tracking-nav text-white">
                  {tile.title}
                </span>
                <span className="mt-1 text-[13px] leading-snug text-white/85">{tile.description}</span>
              </span>
            </>
          );
          return (
            <li key={tile.href ?? tile.title} className="card-accent">
              {tile.href ? (
                <Link
                  href={tile.href}
                  className="group relative flex h-40 items-end focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-text)] sm:h-48"
                >
                  {body}
                </Link>
              ) : (
                <div className="group relative flex h-40 items-end sm:h-48">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={cn("grid gap-4", mosaicClass[columns])}>
      {tiles.map((tile) => {
        const Icon = tile.icon ? icons[tile.icon] : null;
        return (
          <li key={tile.href ?? tile.title} className="card-accent">
            <div className="flex min-h-12 flex-col gap-2 p-5">
              {Icon ? <Icon aria-hidden="true" className="size-6 text-[var(--accent-text)]" /> : null}
              <span className="text-[15px] font-semibold uppercase tracking-nav text-ink">{tile.title}</span>
              <span className="text-[14px] leading-relaxed text-muted">{tile.description}</span>
              {tile.href ? (
                <Link
                  href={tile.href}
                  className="mt-auto pt-2 text-[12px] font-semibold uppercase tracking-nav text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-text)]"
                >
                  {labels.explore}
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
