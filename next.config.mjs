import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Every indexable URL now carries a locale prefix (/es, /en, /pt), so the
  // pre-i18n paths are redirected once, permanently.
  async redirects() {
    return [
      {source: "/sobre-nosotros", destination: "/es/about", permanent: true},
      {source: "/dashboard", destination: "/es/partner/dashboard", permanent: true},
      {
        source: "/dashboard/:path*",
        destination: "/es/partner/dashboard/:path*",
        permanent: true,
      },
      {source: "/partner/login", destination: "/es/partner/login", permanent: true},
    ];
  },
};

export default withNextIntl(nextConfig);
