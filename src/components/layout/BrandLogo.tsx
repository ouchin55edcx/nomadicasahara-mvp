export default function BrandLogo({
  variant = "header",
  className = "",
}: {
  variant?: "header" | "footer";
  className?: string;
}) {
  return (
    <span
      aria-label="Toledano viajes"
      className={`inline-flex items-baseline gap-2 whitespace-nowrap ${
        variant === "footer" ? "text-white" : "text-[#171918]"
      } ${className}`}
    >
      <span className="text-[27px] font-semibold tracking-tight sm:text-[31px]">
        Toledano
      </span>
      <span
        className="-rotate-2 text-[31px] font-black leading-none tracking-[-0.08em] sm:text-[37px]"
        style={{fontFamily: "'Brush Script MT', 'Segoe Script', cursive"}}
      >
        viajes
      </span>
    </span>
  );
}
