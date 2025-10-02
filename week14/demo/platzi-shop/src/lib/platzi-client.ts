import type { Category, NewUserInput, PlatziApiError, Product } from '@/types/platzi';

const BASE_URL = 'https://api.escuelajs.co/api/v1' as const;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorBody: PlatziApiError | null = null;
    try {
      errorBody = (await res.json()) as PlatziApiError;
    } catch {
      // ignore
    }
    const message = errorBody?.message ?? res.statusText;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories?limit=10`);
  return handleResponse<Category[]>(res);
}

export async function fetchProducts(limit = 24): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products?offset=0&limit=${limit}`);
  return handleResponse<Product[]>(res);
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse<Product>(res);
}

export async function createUser(input: NewUserInput): Promise<{ id: number; email: string; password: string }>
{
  const res = await fetch(`${BASE_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(res);
}
