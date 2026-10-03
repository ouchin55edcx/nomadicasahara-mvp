import { PRICING, cancellationTiers, money, ui } from "./checkout-data";

export default function CancellationTimeline() {
  return (
    <section className={ui.card} aria-labelledby="cancellation-title">
      <h2 id="cancellation-title" className={ui.sectionTitle}>
        Condiciones de cancelación
      </h2>
      <p className={ui.sectionLead}>
        En caso de cancelación de la reserva se aplicarán los siguientes límites de reembolso:
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="rounded-sm border border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#222] shadow-sm">
          Hoy 02/10/2026
        </span>
        <span className="rounded-sm border border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#222] shadow-sm">
          Inicio {PRICING.departureDate}
        </span>
      </div>

      <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full">
        {cancellationTiers.map((tier) => (
          <span
            key={tier.when}
            style={{ backgroundColor: tier.color, width: `${tier.width}%` }}
            title={tier.when}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
        {cancellationTiers.map((tier) => (
          <li key={tier.when} className="flex items-start gap-2 text-xs text-[#222]">
            <span
              className="mt-0.5 h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: tier.color }}
              aria-hidden
            />
            <span>
              <span className="font-semibold">{money(tier.amount)}</span> {tier.when}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed text-[#222]/60">
        El importe indicado es la penalización que se retendrá sobre los {money(PRICING.total)}{" "}
        abonados. La devolución del resto se emite al mismo medio de pago en un plazo de 5 a 10
        días hábiles.
      </p>
    </section>
  );
}
