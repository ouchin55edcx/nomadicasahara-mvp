export type ThemeId = "all";

export type Theme = {
  id: ThemeId;
  /** Base accent: fills, badges, active cells. */
  accent: string;
  /** Pressed / emphasised variant of the accent. */
  accentDark: string;
  /** Tinted surfaces behind accent content. */
  accentSoft: string;
  /** AA-safe accent for text and links on white or accentSoft. */
  accentText: string;
  /** Secondary decorative colour. */
  accentAlt?: string;
  /** Body text colour for the page. */
  ink: string;
  /** Foreground used on top of `accent`. */
  onAccent: string;
  /** Foreground used on top of `accentDark`. */
  onAccentDark: string;
  /** Overlay painted above the hero image. */
  heroOverlay: string;
};

export const themes: Record<ThemeId, Theme> = {
  all: {
    id: "all",
    accent: "#66B600",
    accentDark: "#559A00",
    accentSoft: "#EAF6D6",
    accentText: "#467A00",
    accentAlt: "#66B600",
    ink: "#222222",
    onAccent: "#1A1A1A",
    onAccentDark: "#FFFFFF",
    heroOverlay: "rgba(34, 34, 34, 0.28)",
  },
};

export function getTheme(id: ThemeId): Theme {
  return themes[id];
}
