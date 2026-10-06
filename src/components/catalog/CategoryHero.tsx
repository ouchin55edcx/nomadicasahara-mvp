import Image from "next/image";

export default function CategoryHero({image, imageAlt, eyebrow, title, description, actionLabel}: {image: string; imageAlt: string; eyebrow: string; title: string; description: string; actionLabel: string}) {
  return (
    <section className="relative mb-7">
      <div className="catalog-hero-image">
        <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#101811]/75 via-[#101811]/25 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-3xl flex-col justify-center px-5 text-white sm:px-10 lg:px-14">
          <p className="text-xs font-semibold uppercase text-white/75">{eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">{description}</p>
          <a href="#experiences" className="mt-5 inline-flex w-fit items-center gap-2 border-b border-white/60 pb-1 text-sm font-semibold text-white hover:border-white">{actionLabel}<span aria-hidden="true">↘</span></a>
        </div>
      </div>
    </section>
  );
}
