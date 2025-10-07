"use client";

import { useEffect, useState } from "react";
import type { AdminProduct } from "@/lib/admin-store";

const emptyProduct: AdminProduct = {
  id: 0,
  title: "",
  price: 0,
  image: "https://picsum.photos/seed/revoshop/400/300",
  category: "Internal",
  description: "",
};

export default function AdminProductsPanel() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState<AdminProduct>(emptyProduct);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as AdminProduct[];
      setProducts(data);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleChange = (field: keyof AdminProduct) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = field === "price" || field === "id" ? Number(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const method = products.some((item) => item.id === form.id) ? "PUT" : "POST";
    const url = method === "POST" ? "/api/admin/products" : `/api/admin/products/${form.id}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message ?? "Gagal menyimpan product");
      return;
    }
    setForm(emptyProduct);
    await loadProducts();
  };

  const handleEdit = (product: AdminProduct) => {
    setForm(product);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Hapus produk ini?");
    if (!confirmed) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadProducts();
    }
  };

  return (
    <div className="admin-grid" style={{ marginTop: "2rem" }}>
      <form onSubmit={handleSubmit} className="card">
        <h2>{products.some((p) => p.id === form.id) ? "Edit Produk" : "Tambah Produk"}</h2>
        <label>
          <span>ID</span>
          <input type="number" value={form.id || ""} onChange={handleChange("id")} required min={1} />
        </label>
        <label>
          <span>Judul</span>
          <input value={form.title} onChange={handleChange("title")} required />
        </label>
        <label>
          <span>Harga</span>
          <input type="number" value={form.price} onChange={handleChange("price")} min={0} required />
        </label>
        <label>
          <span>Gambar (URL)</span>
          <input value={form.image} onChange={handleChange("image")} />
        </label>
        <label>
          <span>Kategori</span>
          <input value={form.category} onChange={handleChange("category")} />
        </label>
        <label>
          <span>Deskripsi</span>
          <textarea value={form.description} onChange={handleChange("description")} rows={4} />
        </label>
        {error && <p className="badge" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>{error}</p>}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" className="button">
            Simpan
          </button>
          <button type="button" className="button secondary" onClick={() => setForm(emptyProduct)}>
            Reset
          </button>
        </div>
      </form>

      <div className="card" style={{ overflowX: "auto" }}>
        <h2>Daftar Produk Internal</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">Belum ada data. Tambahkan lewat form.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Judul</th>
                <th>Harga</th>
                <th>Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>Rp {product.price.toLocaleString("id-ID")}</td>
                  <td>{product.category}</td>
                  <td style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="button" className="button secondary" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button type="button" className="button" style={{ background: "#ef4444" }} onClick={() => handleDelete(product.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
