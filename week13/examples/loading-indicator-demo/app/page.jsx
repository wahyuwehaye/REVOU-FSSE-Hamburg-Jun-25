import { Suspense } from 'react';
import Spinner from './components/Spinner.jsx';
import ProductSkeletonGrid from './components/ProductSkeletonGrid.jsx';
import ProductShelf from './components/ProductShelf.jsx';
import ReviewsPanel from './components/ReviewsPanel.jsx';
import OverlayAction from './components/OverlayAction.jsx';

export default function LoadingPatternsPage() {
  return (
    <main>
      <section>
        <h2>1. Spinner untuk Feedback Cepat</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Spinner cocok untuk proses singkat seperti mem-validasi form atau menunggu respon singkat dari server. Gunakan
          label deskriptif agar pengguna paham apa yang sedang terjadi.
        </p>
        <Spinner label="Memeriksa status pembayaran..." />
      </section>

      <section>
        <h2>2. Skeleton Layout untuk Konten Berat</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Dengan Suspense, kita dapat menampilkan skeleton saat data server masih dimuat. Setelah data siap, skeleton secara
          halus digantikan konten nyata.
        </p>
        <Suspense fallback={<ProductSkeletonGrid />}>
          {/* Server Component yang melakukan fetch */}
          <ProductShelf />
        </Suspense>
      </section>

      <section>
        <h2>3. Skeleton + Spinner di Client Component</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Ketika fetching terjadi di client menggunakan `useEffect`, kita mengontrol state loading dan menampilkan skeleton
          hingga data tersedia. Jika error, tampilkan pesan dengan ikon/spinner kecil.
        </p>
        <ReviewsPanel />
      </section>

      <section>
        <h2>4. Overlay untuk Aksi Blocking</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Overlay digunakan saat aksi tertentu harus memblokir interaksi pengguna sementara, misalnya generasi laporan yang
          membutuhkan beberapa detik.
        </p>
        <OverlayAction />
      </section>
    </main>
  );
}
