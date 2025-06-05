export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive" | "suspended"
  joinedDate: string
  lastOrderDate?: string
  address?: string
}

export const customers: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    totalOrders: 15,
    totalSpent: 342.5,
    status: "active",
    joinedDate: "2023-01-15",
    lastOrderDate: "2023-12-10",
    address: "123 Main St, Anytown, USA 12345",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    totalOrders: 8,
    totalSpent: 189.75,
    status: "active",
    joinedDate: "2023-03-22",
    lastOrderDate: "2023-12-08",
    address: "456 Oak Ave, Another City, USA 67890",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "(555) 456-7890",
    totalOrders: 23,
    totalSpent: 567.25,
    status: "active",
    joinedDate: "2022-11-08",
    lastOrderDate: "2023-12-12",
    address: "789 Pine St, Third Town, USA 13579",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@example.com",
    phone: "(555) 321-0987",
    totalOrders: 3,
    totalSpent: 78.9,
    status: "inactive",
    joinedDate: "2023-08-14",
    lastOrderDate: "2023-09-20",
    address: "321 Elm St, Fourth City, USA 24680",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    phone: "(555) 654-3210",
    totalOrders: 12,
    totalSpent: 298.4,
    status: "active",
    joinedDate: "2023-02-28",
    lastOrderDate: "2023-12-05",
    address: "654 Maple Dr, Fifth Town, USA 97531",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana.prince@example.com",
    phone: "(555) 111-2222",
    totalOrders: 0,
    totalSpent: 0,
    status: "suspended",
    joinedDate: "2023-10-01",
    address: "111 Hero Lane, Metropolis, USA 54321",
  },
  {
    id: 7,
    name: "Edward Green",
    email: "edward.green@example.com",
    phone: "(555) 333-4444",
    totalOrders: 7,
    totalSpent: 156.8,
    status: "active",
    joinedDate: "2023-05-17",
    lastOrderDate: "2023-11-28",
    address: "333 Green St, Eco City, USA 11111",
  },
  {
    id: 8,
    name: "Fiona White",
    email: "fiona.white@example.com",
    phone: "(555) 777-8888",
    totalOrders: 19,
    totalSpent: 445.6,
    status: "active",
    joinedDate: "2022-12-03",
    lastOrderDate: "2023-12-14",
    address: "777 White Ave, Snow City, USA 22222",
  },
]
