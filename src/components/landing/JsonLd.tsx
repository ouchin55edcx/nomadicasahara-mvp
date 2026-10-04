import JsonLdRenderer, {
  breadcrumbListSchema,
  faqPageSchema,
  organizationSchema,
  webPageSchema,
} from "@/components/seo/JsonLd";
import type { FaqItem } from "@/data/landing/types";

type ExtraNode = Record<string, unknown>;

type LandingJsonLdProps = {
  path: string;
  name: string;
  description: string;
  updatedAt: string;
  breadcrumb: { name: string; path: string }[];
  faq: FaqItem[];
  extra?: ExtraNode[];
};

export default function LandingJsonLd({
  path,
  name,
  description,
  updatedAt,
  breadcrumb,
  faq,
  extra = [],
}: LandingJsonLdProps) {
  return (
    <JsonLdRenderer
      data={[
        organizationSchema(),
        webPageSchema({ path, name, description, updatedAt }),
        breadcrumbListSchema(breadcrumb),
        faqPageSchema(faq),
        ...extra,
      ]}
    />
  );
}