export interface SalesOrder {
  id: string;
  code: string;
  date: string;
  customer_name: string;
  customer_id: string;
  street_address: string;
  city: string;
  phone: string;
  note: string;
  subtotal: number;
  other_amount: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  quotation_id: string;
  details: Array<{
    id: string;
    product_id: string;
    description: string;
    note: string;
    unit_price: number;
    qty: number;
    total_price: number;
    created_at: string;
    updated_at: string;
    sales_orderId: string;
  }>;
}

export const getSalesOrder = async (): Promise<SalesOrder[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/sales-order`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
