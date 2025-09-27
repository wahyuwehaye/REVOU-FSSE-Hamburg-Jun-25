import './globals.css';

export const metadata = {
  title: 'Next.js + Tailwind Demo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
          <header className="rounded-3xl bg-slate-900/60 p-8 shadow-2xl ring-1 ring-white/10">
            <h1 className="text-3xl font-semibold">Tailwind Styling Playground</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Gunakan contoh ini untuk mendemonstrasikan utility-first styling, dark mode, responsive class, dan dynamic state.
            </p>
          </header>
          <main className="flex-1 space-y-8">{children}</main>
          <footer className="py-6 text-center text-sm text-slate-500">© 2024 Styling Demo</footer>
        </div>
      </body>
    </html>
  );
}
