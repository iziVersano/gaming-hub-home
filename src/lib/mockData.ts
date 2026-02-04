// Mock Data for Local Development
// Set USE_MOCK_DATA to true to use mock data instead of API calls

export const USE_MOCK_DATA = import.meta.env.DEV; // Auto-enable in development

export interface Product {
  id: number;
  sku?: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  flags?: string;
  badges?: string;
}

export interface WarrantyRecord {
  rowKey: string;
  customerName: string;
  email: string;
  product: string;
  serialNumber: string;
  invoiceUrl: string;
  invoiceFileName: string;
  createdAt: string;
}

// Mock Products Data
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: "MQ3-001",
    title: "Meta Quest 3",
    description: "Next-generation VR headset with breakthrough mixed reality.",
    category: "New Arrivals",
    imageUrl: "/images/m3w.png",
    price: 499.99
  },
  {
    id: 2,
    sku: "ROG-001",
    title: "ASUS ROG Gaming Laptop",
    description: "Ultimate gaming performance with cutting-edge graphics.",
    category: "New Arrivals",
    imageUrl: "/images/asus-new.png",
    price: 1799.99
  },
  {
    id: 3,
    sku: "NSW2-001",
    title: "Nintendo Switch 2",
    description: "The next generation of Nintendo gaming.",
    category: "New Arrivals",
    imageUrl: "/images/nin2.jpeg",
    price: 449.99
  },
  {
    id: 4,
    sku: "DRN-001",
    title: "Professional Drones",
    description: "High-performance drones for commercial photography.",
    category: "Drones",
    imageUrl: "/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png",
    price: 1299.99
  },
  {
    id: 5,
    sku: "EBK-001",
    title: "Smart E-Bikes",
    description: "Electric bikes with smart connectivity.",
    category: "E-Bikes",
    imageUrl: "/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png",
    price: 1899.99
  }
];

// Mock Warranty Records Data
export const MOCK_WARRANTY_RECORDS: WarrantyRecord[] = [
  {
    rowKey: "w-001",
    customerName: "John Smith",
    email: "john.smith@email.com",
    product: "Meta Quest 3",
    serialNumber: "MQ3-2024-001234",
    invoiceUrl: "/warranty-uploads/sample-invoice.pdf",
    invoiceFileName: "invoice-john.pdf",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    rowKey: "w-002",
    customerName: "Sarah Johnson",
    email: "sarah.j@gmail.com",
    product: "Nintendo Switch 2",
    serialNumber: "NSW2-2024-005678",
    invoiceUrl: "/warranty-uploads/sample-invoice2.pdf",
    invoiceFileName: "receipt-sarah.pdf",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    rowKey: "w-003",
    customerName: "Michael Chen",
    email: "m.chen@company.org",
    product: "ASUS ROG Gaming Laptop",
    serialNumber: "ROG-2024-009012",
    invoiceUrl: "/warranty-uploads/sample-invoice3.pdf",
    invoiceFileName: "purchase-michael.pdf",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days ago
  },
  {
    rowKey: "w-004",
    customerName: "Emily Davis",
    email: "emily.d@outlook.com",
    product: "Professional Drones",
    serialNumber: "DRN-2024-003456",
    invoiceUrl: "",
    invoiceFileName: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
  },
  {
    rowKey: "w-005",
    customerName: "David Wilson",
    email: "dwilson@tech.io",
    product: "Smart E-Bikes",
    serialNumber: "EBK-2024-007890",
    invoiceUrl: "/warranty-uploads/sample-invoice5.pdf",
    invoiceFileName: "e-bike-receipt.pdf",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() // 14 days ago
  },
  {
    rowKey: "w-006",
    customerName: "Lisa Anderson",
    email: "lisa.a@example.com",
    product: "Meta Quest 3",
    serialNumber: "MQ3-2024-002345",
    invoiceUrl: "/warranty-uploads/sample-invoice6.pdf",
    invoiceFileName: "vr-headset-invoice.pdf",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() // 20 days ago
  },
  {
    rowKey: "w-007",
    customerName: "Robert Taylor",
    email: "r.taylor@mail.com",
    product: "Nintendo Switch 2",
    serialNumber: "NSW2-2024-008901",
    invoiceUrl: "/warranty-uploads/sample-invoice7.pdf",
    invoiceFileName: "nintendo-receipt.pdf",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString() // 25 days ago
  }
];

// Helper functions for mock API simulation
export const getMockProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_PRODUCTS]), 300); // Simulate network delay
  });
};

export const getMockWarrantyRecords = (): Promise<WarrantyRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_WARRANTY_RECORDS]), 300);
  });
};

export const deleteMockWarrantyRecord = (identifier: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const index = MOCK_WARRANTY_RECORDS.findIndex(
      r => r.rowKey === identifier || r.serialNumber === identifier
    );
    if (index !== -1) {
      MOCK_WARRANTY_RECORDS.splice(index, 1);
      setTimeout(() => resolve(true), 200);
    } else {
      setTimeout(() => resolve(false), 200);
    }
  });
};
