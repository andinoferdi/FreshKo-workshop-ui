export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export interface Order {
  id: number
  date: string
  status: "completed" | "processing" | "shipped" | "cancelled"
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  customer?: string
  email?: string
  phone?: string
  shippingAddress?: string
  paymentMethod?: string
  estimatedDelivery?: string
}

export const orders: Order[] = [
  {
    id: 1001,
    date: "2023-12-15",
    status: "completed",
    items: [
      {
        id: 1,
        name: "Fresh Avocados",
        price: 4.99,
        quantity: 2,
        image: "/images/thumb-avocado.png",
      },
      {
        id: 2,
        name: "Organic Bananas",
        price: 2.99,
        quantity: 1,
        image: "/images/thumb-bananas.png",
      },
    ],
    subtotal: 12.97,
    shipping: 5.99,
    tax: 1.04,
    discount: 0,
    total: 20.0,
    customer: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    shippingAddress: "123 Main St, Anytown, USA 12345",
    paymentMethod: "Credit Card",
    estimatedDelivery: "Dec 18, 2023",
  },
  {
    id: 1002,
    date: "2023-12-14",
    status: "processing",
    items: [
      {
        id: 3,
        name: "Fresh Milk",
        price: 3.49,
        quantity: 2,
        image: "/images/thumb-milk.png",
      },
      {
        id: 5,
        name: "Fresh Tomatoes",
        price: 3.99,
        quantity: 1,
        image: "/images/thumb-tomatoes.png",
      },
    ],
    subtotal: 10.97,
    shipping: 5.99,
    tax: 0.88,
    discount: 2.0,
    total: 15.84,
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    shippingAddress: "456 Oak Ave, Another City, USA 67890",
    paymentMethod: "PayPal",
    estimatedDelivery: "Dec 17, 2023",
  },
  {
    id: 1003,
    date: "2023-12-13",
    status: "shipped",
    items: [
      {
        id: 7,
        name: "Fresh Raspberries",
        price: 6.99,
        quantity: 1,
        image: "/images/thumb-raspberries.png",
      },
      {
        id: 10,
        name: "Natural Honey",
        price: 8.99,
        quantity: 1,
        image: "/images/thumb-honey.jpg",
      },
    ],
    subtotal: 15.98,
    shipping: 0,
    tax: 1.28,
    discount: 0,
    total: 17.26,
    customer: "Bob Johnson",
    email: "bob@example.com",
    phone: "(555) 456-7890",
    shippingAddress: "789 Pine St, Third Town, USA 13579",
    paymentMethod: "Credit Card",
    estimatedDelivery: "Dec 16, 2023",
  },
  {
    id: 1004,
    date: "2023-12-12",
    status: "cancelled",
    items: [
      {
        id: 4,
        name: "Orange Juice",
        price: 5.99,
        quantity: 2,
        image: "/images/thumb-orange-juice.png",
      },
    ],
    subtotal: 11.98,
    shipping: 5.99,
    tax: 0.96,
    discount: 0,
    total: 18.93,
    customer: "Alice Brown",
    email: "alice@example.com",
    phone: "(555) 321-0987",
    shippingAddress: "321 Elm St, Fourth City, USA 24680",
    paymentMethod: "Credit Card",
    estimatedDelivery: "Cancelled",
  },
  {
    id: 1005,
    date: "2023-12-11",
    status: "completed",
    items: [
      {
        id: 6,
        name: "Cucumber",
        price: 1.99,
        quantity: 3,
        image: "/images/thumb-cucumber.png",
      },
      {
        id: 8,
        name: "Tomato Ketchup",
        price: 2.49,
        quantity: 2,
        image: "/images/thumb-tomatoketchup.png",
      },
    ],
    subtotal: 10.95,
    shipping: 5.99,
    tax: 0.88,
    discount: 1.5,
    total: 16.32,
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    phone: "(555) 654-3210",
    shippingAddress: "654 Maple Dr, Fifth Town, USA 97531",
    paymentMethod: "Debit Card",
    estimatedDelivery: "Dec 14, 2023",
  },
]
