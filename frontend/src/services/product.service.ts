export interface Product {
  id: string;
  name: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/product`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};
