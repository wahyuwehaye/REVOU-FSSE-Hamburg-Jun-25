export type Category = {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  creationAt: string;
  updatedAt: string;
  category: Category;
};

export type NewUserInput = {
  name: string;
  email: string;
  password: string;
  avatar: string;
};

export type PlatziApiError = {
  message: string;
  statusCode?: number;
};
