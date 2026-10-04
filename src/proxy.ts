import createMiddleware from "next-intl/middleware";

import {routing} from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals, the image optimizer and files with an extension.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
