export const getCustomers = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/customer`);
  return response.json();
};
