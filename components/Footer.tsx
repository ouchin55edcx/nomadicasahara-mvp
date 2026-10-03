import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const empresa = ["Quiénes somos", "Hazte socio", "Trabaja con nosotros"];
  const enlaces = [
    "Guías de viaje",
    "Condiciones generales",
    "Política de privacidad",
    "Política de cookies",
  ];

  const socials = [
    {
      name: "Instagram",
      path: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.4 1.4 0 1 0 0-2.9 1.4 1.4 0 0 0 0 2.9z",
    },
    {
      name: "X",
      path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.3 22H3.1l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.4 3.8H5.5L17.8 20z",
    },
    {
      name: "Facebook",
      path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",
    },
    {
      name: "YouTube",
      path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z",
    },
  ];

  return (
    <footer className="bg-ink-dark text-white">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-3 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <a href="/" className="inline-flex items-center">
            <BrandLogo variant="footer" />
          </a>
          <p className="mt-3 text-sm leading-[1.6] text-white/60">
            Viajes de autor por Marruecos desde 2012. Desierto, medinas y
            Atlántico con guías locales oficiales.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href="#"
                aria-label={s.name}
                className="text-white/60 transition-colors hover:text-brand"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Empresa */}
        <nav>
          <h3 className="text-[12px] font-semibold uppercase tracking-nav text-white/85">
            Empresa
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {empresa.map((e) => (
              <li key={e}>
                <a href="#" className="transition-colors hover:text-white">
                  {e}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Enlaces de interés */}
        <nav>
          <h3 className="text-[12px] font-semibold uppercase tracking-nav text-white/85">
            Enlaces de interés
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {enlaces.map((e) => (
              <li key={e}>
                <a href="#" className="transition-colors hover:text-white">
                  {e}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Idioma */}
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-nav text-white/85">
            Idioma
          </h3>
          <select
            className="mt-3 w-full max-w-[220px] rounded-sm border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand"
            defaultValue="es-ES"
            aria-label="Seleccionar idioma"
          >
            <option value="es-ES" className="text-ink">
              España — Español
            </option>
            <option value="fr-FR" className="text-ink">
              France — Français
            </option>
            <option value="en-GB" className="text-ink">
              UK — English
            </option>
            <option value="de-DE" className="text-ink">
              Deutschland — Deutsch
            </option>
          </select>
          <p className="mt-3 text-xs leading-[1.6] text-white/45">
            Atención al viajero de lun. a vie., 9:00–19:00 (CET).
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 px-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nomadica Sahara S.L. — Todos los derechos reservados.</p>
          <p>Licencia de agencia de viajes CICMA 4127.</p>
        </div>
      </div>
    </footer>
  );
}
