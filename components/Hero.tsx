import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative mt-3 h-[190px] overflow-hidden md:h-[300px]">
      <Image
        src="/images/hero.jpg"
        alt="Paisaje del sur de Marruecos entre dunas, palmeras y kasbahs de adobe"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1200px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/65 via-ink/10 to-transparent" />
      <p className="absolute bottom-6 left-5 max-w-xl text-2xl font-medium leading-snug text-white md:left-8 md:text-[32px]">
        El Sáhara y Marruecos, donde el silencio también se escucha.
      </p>
    </section>
  );
}
