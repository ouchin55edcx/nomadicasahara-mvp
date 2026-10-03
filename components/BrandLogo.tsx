import Image from "next/image";

export default function BrandLogo({
  variant = "header",
  className = "",
}: {
  variant?: "header" | "footer";
  className?: string;
}) {
  return (
    <Image
      src={
        variant === "footer"
          ? "/images/logo_nomadica-footer.png"
          : "/images/logo_nomadica-trim.png"
      }
      alt="Nomadica Sahara"
      width={578}
      height={92}
      priority={variant === "header"}
      className={`block h-8 w-auto max-w-[58vw] object-contain sm:h-10 sm:max-w-[270px] ${className}`}
    />
  );
}