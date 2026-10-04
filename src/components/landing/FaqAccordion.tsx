"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/data/landing/types";

const labels = {
  heading: "Preguntas frecuentes",
} as const;

export default function FaqAccordion({
  faq,
  heading = labels.heading,
}: {
  faq: FaqItem[];
  heading?: string;
}) {
  if (faq.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-3 py-12">
        <h2 id="faq-heading" className="text-[22px] font-semibold text-ink sm:text-[26px]">
          {heading}
        </h2>

        <Accordion type="single" collapsible className="mt-6 w-full border-t border-line">
          {faq.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="min-h-12 justify-between px-0 text-left text-[15px] font-semibold tracking-normal normal-case text-ink hover:text-[var(--accent-text)] focus-visible:ring-[var(--accent-text)]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-0 text-[15px] leading-relaxed text-muted">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}