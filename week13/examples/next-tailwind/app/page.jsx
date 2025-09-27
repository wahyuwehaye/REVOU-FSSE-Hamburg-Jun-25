import GradientButton from './components/GradientButton.jsx';
import PricingCard from './components/PricingCard.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

const pricing = [
  {
    title: 'Starter',
    price: '0K',
    features: ['3 komponen UI', 'Dokumentasi dasar', 'Akses komunitas'],
  },
  {
    title: 'Pro',
    price: '149K',
    features: ['Komponen premium', 'Tema gelap', 'Tips best-practice'],
    featured: true,
  },
  {
    title: 'Scale',
    price: '349K',
    features: ['Review kode', 'Template Next.js', 'Dukungan prioritas'],
  },
];

export default function TailwindPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-3xl bg-white/5 p-10 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Tailwind Utility First</p>
        <h2 className="text-4xl font-semibold text-white">Bangun layout indah dengan class sederhana</h2>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
          Tailwind memberikan utilitas kecil yang dapat disusun untuk membuat UI kompleks tanpa meninggalkan file komponen.
          Gunakan contoh ini untuk menunjukkan responsive design, stateful styling, dan kombinasi dengan komponen client.
        </p>
        <GradientButton>Eksperimen Kelas</GradientButton>
      </section>

      <section>
        <h3 className="mb-4 text-2xl font-semibold text-white">Paket Bootcamp</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {pricing.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
      </section>

      <ThemeToggle />
    </div>
  );
}
