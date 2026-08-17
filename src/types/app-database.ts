export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "XXL" | "XXXL";

export type OrderStatus =
  | "new"
  | "pending_payment"
  | "for_verification"
  | "paid"
  | "preparing"
  | "packed"
  | "shipped"
  | "for_pickup"
  | "completed"
  | "cancelled"
  | "failed";

export type PaymentMethod = "cod" | "gcash" | "maya" | "bank_transfer";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  category: string | null;
  image_url: string | null;
  images: string[] | null;
  stock_quantity: number;
  low_stock_threshold: number;
  weight_grams: number | null;
  is_active: boolean;
  created_by_email?: string | null;
  updated_by_email?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;
export type ProductUpdate = Partial<ProductInsert>;

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes: string | null;
  proof_of_payment_url: string | null;
  proof_uploaded_at: string | Date | null;
  payment_reference_number: string | null;
  hitpay_payment_id?: string | null;
  waybill_number: string | null;
  user_id: string | null;
  affiliate_id?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export type OrderInsert = Omit<Order, "id" | "order_number" | "created_at" | "updated_at">;
export type OrderUpdate = Partial<Omit<Order, "id" | "order_number" | "created_at" | "updated_at">>;

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  size: string | null;
  unit_price: number;
  total_price: number;
  created_at: string | Date;
}

export type OrderItemInsert = Omit<OrderItem, "id" | "created_at">;

export interface EventCarouselItem {
  id: string;
  image_url: string;
  title: string;
  caption: string | null;
  created_at: string | Date;
}

export type EventCarouselInsert = Omit<EventCarouselItem, "id" | "created_at">;
export type EventCarouselUpdate = Partial<EventCarouselInsert>;

export interface EventTicketTier {
  slug: string;
  name: string;
  price: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string | Date;
  ends_at: string | Date | null;
  price: number;
  promo_code: string | null;
  promo_discount_percent: number;
  max_attendees: number;
  payment_instructions: string | null;
  image_url: string | null;
  ticket_tiers: EventTicketTier[];
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  registration_count?: number;
}

export type EventInsert = Omit<Event, "id" | "created_at" | "updated_at" | "registration_count">;
export type EventUpdate = Partial<EventInsert>;

export type EventPaymentStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface EventRegistration {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  ticket_slug: string | null;
  ticket_name: string | null;
  promo_code_used: string | null;
  subtotal: number;
  discount_amount: number;
  final_amount: number;
  payment_status: EventPaymentStatus;
  payment_reference: string | null;
  hitpay_payment_id?: string | null;
  check_in_code: string;
  checked_in: boolean;
  checked_in_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export type EventRegistrationInsert = {
  event_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
  ticket_slug?: string | null;
  promo_code_used?: string | null;
};

export type EventRegistrationUpdate = Partial<
  Pick<EventRegistration, "payment_status" | "checked_in" | "checked_in_at" | "payment_reference">
>;
