import { MessageCircle } from "lucide-react";

const labels = {
  phone: "Habla con un experto",
  note: "Respondemos en menos de 10 minutos, de lunes a sábado.",
} as const;

export type CtaCopy = {
  title: string;
  body: string;
  ctaLabel: string;
};

type CtaBannerProps = {
  content: CtaCopy;
  whatsappNumber?: string;
};

export default function CtaBanner({
  content,
  whatsappNumber = "34600111222",
}: CtaBannerProps) {
  const href = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-3 py-12">
        <div className="rounded-sm border border-line bg-[var(--accent-soft)] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-[22px] font-semibold leading-tight text-ink md:text-[26px]">
                {content.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{content.body}</p>
              <p className="mt-2 text-[13px] text-muted">{labels.note}</p>
            </div>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent shrink-0"
            >
              <MessageCircle aria-hidden="true" className="mr-2 size-4" />
              {content.ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}