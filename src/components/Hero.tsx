import Image from "next/image";

type HeroProps = {
  image: string;
  alt: string;
  title: string;
};

export default function Hero({ image, alt, title }: HeroProps) {
  return (
    <section className="relative mt-3 h-[190px] overflow-hidden md:h-[300px]">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1200px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/65 via-ink/10 to-transparent" />
      <p className="absolute bottom-6 left-5 max-w-xl text-2xl font-medium leading-snug text-white md:left-8 md:text-[32px]">
        {title}
      </p>
    </section>
  );
}
