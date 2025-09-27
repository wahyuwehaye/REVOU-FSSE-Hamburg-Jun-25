export default function PricingCard({ title, price, features, featured = false }) {
  return (
    <article
      className={`flex flex-col gap-6 rounded-3xl border border-white/10 p-8 transition ${
        featured ? 'bg-white/10 shadow-2xl shadow-indigo-500/30 ring-2 ring-brand-500/60' : 'bg-white/5'
      }`}
    >
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{featured ? 'Populer' : 'Paket'}</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-4xl font-bold text-white">
        {price}
        <span className="ml-1 text-base font-normal text-slate-300">/bulan</span>
      </p>
      <ul className="space-y-3 text-sm text-slate-200">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className="mt-auto rounded-xl bg-white/90 py-2 font-semibold text-brand-600 shadow hover:bg-white">
        Pilih Paket
      </button>
    </article>
  );
}
