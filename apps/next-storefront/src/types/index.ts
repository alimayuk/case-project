export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  vat_rate: number;
  status: number;
  created_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  variant_name: string;
  quantity: number;
  price_override: number | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_variant_id: number;
  qty: number;
  unit_price_snapshot: number;
  vat_rate_snapshot: number;
  created_at: string;
  updated_at: string;
  variant?: ProductVariant;
}

export interface Cart {
  id: number;
  user_id: number | null;
  session_key: string;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
  summary?: CartSummary;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  variant_name: string;
  quantity: number;
  price_override: number | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_variant_id: number;
  qty: number;
  unit_price_snapshot: number;
  vat_rate_snapshot: number;
  created_at: string;
  updated_at: string;
  variant?: ProductVariant;
}

export interface CartSummary {
  subtotal_excl_vat: number;
  vat_total: number;
  grand_total: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}