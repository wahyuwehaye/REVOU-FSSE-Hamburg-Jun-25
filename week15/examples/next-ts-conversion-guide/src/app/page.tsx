import Link from "next/link";

export default function ConversionGuidePage() {
  return (
    <section>
      <h1 className="text-3xl" style={{ fontWeight: 700 }}>Template Migrasi JSX ➜ TypeScript</h1>
      <p className="text-gray-300">
        Pakai proyek ini saat mendemokan langkah migrasi file `.jsx` ke `.tsx`. Folder <code>migration-samples/</code>
        berisi versi sebelum & sesudah yang bisa dibandingkan langsung.
      </p>

      <section>
        <h2>Langkah Demo</h2>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Buka <code>migration-samples/BlogPost.jsx</code> (versi awal).</li>
          <li>Jelaskan error potensial ketika data tidak bertipe.</li>
          <li>Tunjukkan hasil akhir pada <code>src/components/BlogPost.tsx</code> dan <code>src/app/page.tsx</code>.</li>
          <li>Terapkan strategi renaming + penambahan type alias secara bertahap.</li>
        </ol>
      </section>

      <section>
        <h2>Link Cepat</h2>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <a href="./migration-samples/BlogPost.jsx" className="badge">Lihat versi JSX</a>
          </li>
        </ul>
      </section>
    </section>
  );
}
