import type {ComponentProps, ComponentType} from "react";
import type {UrlObject} from "url";
import {createNavigation} from "next-intl/navigation";

import {routing} from "./routing";

// Locale-aware replacements for next/link, next/navigation and usePathname.
// Always import these instead of the next/* originals so hrefs stay prefixed.
const navigation = createNavigation(routing);

type RouteHref = {pathname: string; params?: Record<string, string>; query?: Record<string, string | number | boolean | undefined>};
type FlexibleHref = string | UrlObject | RouteHref;
type FlexibleLinkProps = Omit<ComponentProps<typeof navigation.Link>, "href"> & {href: FlexibleHref};

// Keep the locale-aware runtime component while allowing the legacy routes that
// predate the pathname map to remain linked until they receive their own map.
export const Link = navigation.Link as unknown as ComponentType<FlexibleLinkProps>;
export function redirect(href: FlexibleHref | {href: string; locale: string}): never {
  return navigation.redirect(href as never);
}
export const usePathname = navigation.usePathname;
export const getPathname = navigation.getPathname;

type Router = ReturnType<typeof navigation.useRouter>;
type FlexibleRouter = Omit<Router, "push" | "replace" | "prefetch"> & {
  push: (href: FlexibleHref, options?: {scroll?: boolean}) => void;
  replace: (href: FlexibleHref, options?: {scroll?: boolean}) => void;
  prefetch: (href: FlexibleHref, options?: {onInvalidate?: () => void}) => void;
};

export function useRouter(): FlexibleRouter {
  const router = navigation.useRouter();
  return {
    ...router,
    push: (href, options) => router.push(href as never, options),
    replace: (href, options) => router.replace(href as never, options),
    prefetch: (href, options) => router.prefetch(href as never, options),
  };
}
