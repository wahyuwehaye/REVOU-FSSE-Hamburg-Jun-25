import type { ProductSummary } from "@/types/product";

export type AdminProduct = ProductSummary & {
  description: string;
};

const globalStore = globalThis as typeof globalThis & {
  __ADMIN_PRODUCTS__?: AdminProduct[];
};

if (!globalStore.__ADMIN_PRODUCTS__) {
  globalStore.__ADMIN_PRODUCTS__ = [];
}

function getStore() {
  return globalStore.__ADMIN_PRODUCTS__!;
}

export function listAdminProducts(): AdminProduct[] {
  return [...getStore()];
}

export function createAdminProduct(product: AdminProduct): AdminProduct {
  const store = getStore();
  store.push(product);
  return product;
}

export function updateAdminProduct(id: number, product: Partial<AdminProduct>): AdminProduct | null {
  const store = getStore();
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...store[index], ...product };
  store[index] = updated;
  return updated;
}

export function deleteAdminProduct(id: number): boolean {
  const store = getStore();
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
