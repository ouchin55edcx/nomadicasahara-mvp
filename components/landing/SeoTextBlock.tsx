import type { SeoBlock } from "@/content/landing/types";

const labels = {
  updated: "Última actualización",
} as const;

type SeoTextBlockProps = {
  block: SeoBlock;
  updatedAt: string;
};

export default function SeoTextBlock({ block, updatedAt }: SeoTextBlockProps) {
  return (
    <section aria-labelledby="seo-heading" className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-3 py-12">
        <div className="max-w-3xl">
          <h2 id="seo-heading" className="text-[22px] font-semibold leading-tight text-ink sm:text-[26px]">
            {block.heading}
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink/85">{block.intro}</p>

          {block.sections.map((section) => (
            <div key={section.heading} className="mt-7">
              <h3 className="text-[17px] font-semibold text-ink">{section.heading}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-2 text-[15px] leading-[1.75] text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          <p className="mt-8 text-[13px] text-muted">
            {labels.updated}:{" "}
            <time dateTime={updatedAt}>{updatedAt}</time>
          </p>
        </div>
      </div>
    </section>
  );
}