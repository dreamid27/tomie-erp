export interface Customer {
  id: string;
  name: string;
  street_address?: string;
  city?: string;
  phone?: string;
}

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/customer`);
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
};
