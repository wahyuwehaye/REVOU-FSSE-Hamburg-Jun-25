import { fetchProducts } from '@/lib/platzi-client';

export const metadata = {
  title: 'Dashboard Orders',
};

export default async function OrdersPage() {
  const products = await fetchProducts(8);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard Orders (Dummy)</h1>
      <p className="text-gray-600">
        Untuk demo, kita memakai daftar produk sebagai data order yang dibatasi 8 item.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produk</th>
            <th>Harga</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>Rp {product.price.toLocaleString('id-ID')}</td>
              <td>{product.category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
