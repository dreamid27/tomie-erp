export interface QuotationDetail {
  product_id: string;
  description: string;
  note: string;
  unit_price: number;
  qty: number;
}

export interface CreateQuotationDto {
  code: string;
  date: string;
  customer_id: string;
  note: string;
  other_amount: number;
  details: QuotationDetail[];
}

const API_URL = `${import.meta.env.VITE_API_URL}`;

export interface Quotation {
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
}

export const fetchQuotations = async (): Promise<Quotation[]> => {
  const response = await fetch(`${API_URL}/quotation`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const createQuotation = async (data: CreateQuotationDto) => {
  const response = await fetch(`${API_URL}/quotation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create quotation");
  }

  return await response.json();
};

export const generateQuotationCode = async (): Promise<string> => {
  // This is a placeholder. In a real app, you might want to get this from your backend
  const response = await fetch(`${API_URL}/quotation/code`);

  if (!response.ok) {
    throw new Error("Failed to generate quotation code");
  }

  const data = await response.json();
  return data.code || "Q-0001";
};

export const approveQuotation = async (id: string) => {
  const response = await fetch(`${API_URL}/quotation/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "approved",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to approve quotation");
  }

  return await response.json();
};
