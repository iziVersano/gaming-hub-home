// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
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

// Fallback products data (used when API is unavailable)
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 8,
    title: "Meta Quest 3",
    description: "Next-generation VR headset with breakthrough mixed reality, powerful performance, and an expanding library of immersive experiences.",
    category: "New Arrivals",
    imageUrl: "/images/m3w.png",
    price: 499.99
  },
  {
    id: 9,
    title: "ASUS ROG Gaming Laptop",
    description: "Ultimate gaming performance with cutting-edge graphics, high-refresh display, and advanced cooling technology for serious gamers.",
    category: "New Arrivals",
    imageUrl: "/images/asus-new.png",
    price: 1799.99
  },
  {
    id: 10,
    title: "Nintendo Switch 2",
    description: "The next generation of Nintendo gaming. Experience enhanced graphics, faster performance, and an expanded game library.",
    category: "New Arrivals",
    imageUrl: "/images/nin2.jpeg",
    price: 449.99
  },
  {
    id: 3,
    title: "Professional Drones",
    description: "High-performance drones for commercial photography, surveying, and recreational flying with advanced stabilization.",
    category: "Drones",
    imageUrl: "/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png",
    price: 1299.99
  },
  {
    id: 4,
    title: "Smart E-Bikes",
    description: "Electric bikes with smart connectivity, long-range batteries, and advanced motor systems for urban mobility.",
    category: "E-Bikes",
    imageUrl: "/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png",
    price: 1899.99
  },
  {
    id: 5,
    title: "4K Smart TVs",
    description: "Ultra-high definition smart TVs with AI upscaling, HDR support, and built-in streaming platforms.",
    category: "TVs",
    imageUrl: "/images/6df37998-af04-426e-b749-365ffeb66787.png",
    price: 799.99
  },
  {
    id: 6,
    title: "Gaming Accessories",
    description: "Premium gaming peripherals including controllers, headsets, and racing wheels from top brands.",
    category: "Gaming",
    imageUrl: "/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png",
    price: 149.99
  },
  {
    id: 7,
    title: "Smart Home Electronics",
    description: "Connected home devices including smart speakers, security cameras, and automation systems.",
    category: "Electronics",
    imageUrl: "/images/6df37998-af04-426e-b749-365ffeb66787.png",
    price: 299.99
  }
];

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

// Auth helpers
export const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('adminToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API helper function
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/admin/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auth API
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Get current locale from i18n context.
 * This function should be called from within React components where useI18n hook is available.
 * For use outside components, pass locale explicitly to API functions.
 */
export const getCurrentLocale = (): string => {
  // Try to get from localStorage (set by I18nContext)
  return localStorage.getItem('language') || 'en';
};

// Products API with localization support
/**
 * Fetch all products with localized content.
 * Accepts optional locale parameter (defaults to current i18n locale).
 * API returns already-localized products based on locale.
 */
export const getProducts = async (locale?: string): Promise<Product[]> => {
  try {
    const lang = locale || getCurrentLocale();
    return await fetchApi(`/products?lang=${lang}`);
  } catch (error) {
    console.log('API unavailable, using fallback products');
    return FALLBACK_PRODUCTS;
  }
};

/**
 * Fetch a single product with localized content.
 * Accepts optional locale parameter (defaults to current i18n locale).
 */
export const getProduct = async (id: number, locale?: string): Promise<Product> => {
  const lang = locale || getCurrentLocale();
  return fetchApi(`/products/${id}?lang=${lang}`);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  return fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
};

export const updateProduct = async (id: number, product: Product): Promise<void> => {
  return fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  return fetchApi(`/products/${id}`, {
    method: 'DELETE',
  });
};

// Upload API
export const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/admin/login';
    }
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

// Get full image URL (handles both relative and absolute URLs)
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '/placeholder.svg';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) {
    // Image uploaded to our backend API
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${imageUrl}`;
  }
  if (imageUrl.startsWith('/lovable-uploads/')) {
    // Legacy lovable-uploads path - map to /images/ folder
    const filename = imageUrl.replace('/lovable-uploads/', '');
    return `/images/${filename}`;
  }
  if (imageUrl.startsWith('/images/')) {
    // Images from frontend's public/images folder
    return imageUrl;
  }
  return imageUrl;
};
