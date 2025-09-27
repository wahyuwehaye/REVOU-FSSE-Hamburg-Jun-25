export default function GradientButton({ children }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-brand-600 hover:to-indigo-600"
      type="button"
    >
      {children}
    </button>
  );
}
