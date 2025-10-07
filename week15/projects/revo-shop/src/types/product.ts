export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
  };
}

export interface ProductSummary {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}
