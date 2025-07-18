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
  note?: string;
  other_amount: number;
  details: QuotationDetail[];
}

const API_URL = `${import.meta.env.VITE_API_URL}`;

export interface AuditLogEntry {
  action: 'created' | 'status_changed' | 'updated';
  user: string;
  timestamp: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export type AuditLog = AuditLogEntry[];

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
}

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
  audit_log?: AuditLog;
  created_at: string;
  updated_at: string;
  details: {
    id: string;
    product_id: string;
    description: string;
    note: string;
    unit_price: number;
    qty: number;
    total_price: number;
    created_at: string;
    updated_at: string;
    quotation_id: string;
  }[];
}

export const fetchQuotations = async (
  page: number = 1,
  pageSize: number = 10,
  status?: string,
  excludeStatus?: string
): Promise<PaginatedResponse<Quotation>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (status) {
    params.append('status', status);
  }

  if (excludeStatus) {
    params.append('excludeStatus', excludeStatus);
  }

  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/quotation?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createQuotation = async (data: CreateQuotationDto) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/quotation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create quotation');
  }

  return await response.json();
};

export const fetchQuotationById = async (id: string): Promise<Quotation> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/quotation/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quotation');
  }
  return response.json();
};

export const approveQuotation = async (id: string) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/quotation/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      status: 'approved',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to approve quotation');
  }

  return await response.text();
};
