export type ProductCategory = 
  | 'Bulks'
  | 'Lollies'
  | 'Kulfi'
  | 'Kasata'
  | 'Balls'
  | 'Jumbo Refill'
  | 'Black Forest'
  | '1/2 Liters'
  | '1 Liter';

export interface Product {
  id: number;
  name: string;
  price: number;
  category?: ProductCategory;
  icon_url?: string | null;
  is_active?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DiscountProduct {
  id: string;
  product_name: string;
  original_price: number;
  discounted_price: number;
  category?: ProductCategory;
}

// Category configuration with icons and colors
export const CATEGORIES: Record<ProductCategory, { 
  icon: string; 
  color: string; 
  description: string;
}> = {
  'Bulks': { 
    icon: '📦', 
    color: 'bg-blue-100 text-blue-800', 
    description: 'Large quantity items' 
  },
  'Lollies': { 
    icon: '🍭', 
    color: 'bg-pink-100 text-pink-800', 
    description: 'Ice cream lollies and sticks' 
  },
  'Kulfi': { 
    icon: '🧊', 
    color: 'bg-cyan-100 text-cyan-800', 
    description: 'Traditional Indian kulfi' 
  },
  'Kasata': { 
    icon: '🍨', 
    color: 'bg-purple-100 text-purple-800', 
    description: 'Kasata and swinger items' 
  },
  'Balls': { 
    icon: '⚪', 
    color: 'bg-gray-100 text-gray-800', 
    description: 'Ice cream balls' 
  },
  'Jumbo Refill': { 
    icon: '🔄', 
    color: 'bg-orange-100 text-orange-800', 
    description: 'Large refill containers' 
  },
  'Black Forest': { 
    icon: '🌲', 
    color: 'bg-green-100 text-green-800', 
    description: 'Black forest special items' 
  },
  '1/2 Liters': { 
    icon: '🥤', 
    color: 'bg-yellow-100 text-yellow-800', 
    description: 'Half liter containers' 
  },
  '1 Liter': { 
    icon: '🍶', 
    color: 'bg-indigo-100 text-indigo-800', 
    description: 'One liter containers' 
  }
};

// Helper function to categorize products based on name
export const categorizeProduct = (productName: string): ProductCategory => {
  const name = productName.toLowerCase();
  
  if (name.includes('bulk') || name.includes('big') && name.includes('cup')) return 'Bulks';
  if (name.includes('lollie')) return 'Lollies';
  if (name.includes('kulfi')) return 'Kulfi';
  if (name.includes('kasata') || name.includes('swinger')) return 'Kasata';
  if (name.includes('ball')) return 'Balls';
  if (name.includes('jumbo') && name.includes('refill')) return 'Jumbo Refill';
  if (name.includes('black forest')) return 'Black Forest';
  if (name.includes('1/2') || name.includes('half')) return '1/2 Liters';
  if (name.includes('1 liter') || name.includes('one liter')) return '1 Liter';
  
  // Default fallback
  return 'Bulks';
};

export const products: Product[] = [
  { id: 1, name: "Cups (BIG)", price: 40 },
  { id: 2, name: "Cups (Small)", price: 25 },
  { id: 3, name: "Chocofiest", price: 50 },
  { id: 4, name: "Chocobar (Big)", price: 45 },
  { id: 5, name: "Chocobar (Small)", price: 30 },
  { id: 6, name: "Rajberry & Mango Duet", price: 60 },
  { id: 7, name: "Lollies", price: 20 },
  { id: 8, name: "Punjabi Kufi", price: 70 },
  { id: 9, name: "Big Cone", price: 55 },
  { id: 10, name: "Small Cone", price: 35 },
  { id: 11, name: "Small Cone-V", price: 40 },
  { id: 12, name: "Sunday Refill", price: 80 },
  { id: 13, name: "Swinger (Big) / Kasata", price: 90 },
  { id: 14, name: "Swinger (Small)", price: 65 },
  { id: 15, name: "Jumbo Refill", price: 100 },
  { id: 16, name: "Black Forest", price: 120 },
  { id: 17, name: "Mutka Kulfi", price: 75 },
  { id: 18, name: "Balls", price: 30 },
  { id: 19, name: "Bulks", price: 500 }
];