export default function Hero({ onAddFeature }) {
  return (
    <header className="hero">
      <h1>React Basic Demo</h1>
      <p>
        Contoh sederhana untuk mendemonstrasikan state, props, dan event dalam sesi kelas. Edit konten ini dan
        perhatikan perubahan langsung di browser.
      </p>
      <button type="button" onClick={onAddFeature}>
        Tambah Fitur Dummy
      </button>
    </header>
  );
}
