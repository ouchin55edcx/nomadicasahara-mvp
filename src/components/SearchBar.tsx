"use client";

import { useEffect, useState } from "react";

export default function SearchBar() {
  const [count, setCount] = useState(14);

  useEffect(() => {
    const t = setInterval(
      () => setCount((c) => (c >= 16 ? 12 : c + 1)),
      6000
    );
    return () => clearInterval(t);
  }, []);

  const field =
    "w-full border border-line bg-white px-3 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <section className="bg-ink-dark text-white">
      <div className="flex flex-col gap-3 px-3 py-4 lg:flex-row lg:items-center">
        <form
          className="flex flex-1 flex-col gap-2 md:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="flex-1">
            <span className="sr-only">Destino</span>
            <select className={field} defaultValue="">
              <option value="" disabled>
                Destino
              </option>
              <option>Desierto de Merzouga</option>
              <option>Marrakech</option>
              <option>Fez</option>
              <option>Alto Atlas</option>
              <option>Essaouira y costa atlántica</option>
              <option>Ruta de las Kasbahs</option>
            </select>
          </label>
          <label className="md:w-48">
            <span className="sr-only">Fecha</span>
            <input type="date" className={field} />
          </label>
          <button type="submit" className="btn btn-primary md:px-8">
            Buscar
          </button>
        </form>
        <p className="whitespace-nowrap text-[13px] uppercase tracking-nav text-white/75 lg:text-right">
          <span className="mr-1 text-base font-semibold text-brand">{count}</span>
          experiencias disponibles
        </p>
      </div>
    </section>
  );
}
