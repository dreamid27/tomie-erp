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

export const createQuotation = async (data: CreateQuotationDto) => {
  const response = await fetch("http://localhost:3000/quotation", {
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
  const response = await fetch("/api/quotation/latest-code");

  if (!response.ok) {
    throw new Error("Failed to generate quotation code");
  }

  const data = await response.json();
  return data.code || "Q-0001";
};
