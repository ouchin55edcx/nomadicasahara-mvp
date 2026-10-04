import {createNavigation} from "next-intl/navigation";

import {routing} from "./routing";

// Locale-aware replacements for next/link, next/navigation and usePathname.
// Always import these instead of the next/* originals so hrefs stay prefixed.
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
