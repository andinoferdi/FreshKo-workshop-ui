export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface Order {
  id: number;
  date: string;
  status: "completed" | "processing" | "shipped" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  customer?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  estimatedDelivery?: string;
}

// Note: Original hardcoded orders data has been removed
// All orders are now stored and managed through localStorage in the store system
