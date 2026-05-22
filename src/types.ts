export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  size: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  image: string;
  concern: 'radiance' | 'sculpt' | 'hydration' | 'calm';
  rating: number;
  texture: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Editorial {
  id: string;
  title: string;
  subtitle: string;
  paragraph: string;
  image: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  glowResult: string;
}

export enum SkinType {
  DRY = "DRY",
  OILY = "OILY",
  COMBINATION = "COMBINATION",
  SENSITIVE = "SENSITIVE",
  NORMAL = "NORMAL"
}

export enum SkinConcern {
  WRINKLES = "WRINKLES",
  REDNESS = "REDNESS",
  DULLNESS = "DULLNESS",
  BREAKOUTS = "BREAKOUTS",
  DEHYDRATION = "DEHYDRATION"
}

export interface RitualProfile {
  name: string;
  age: number;
  skinType: SkinType;
  primaryConcern: SkinConcern;
  climate: string;
  lifestyle: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface BookingDetails {
  fullName: string;
  email: string;
  date: string;
  time: string;
  ritualType: string;
  notes?: string;
}

export interface PromotionBundle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  productIds: string[];
  price: number;
  valuePrice?: number;
  image: string;
  tag?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  date: string; // ISO String
  status: 'PENDIENTE' | 'DEPOSITADO' | 'COMPLETADO' | 'ENVIADO';
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'IMPERIAL_RAW' | 'LOGISTICA' | 'CUPONES' | 'PERSONAL' | 'MARKETING' | 'OTROS';
  date: string;
  notes?: string;
}

export interface CashSession {
  isOpen: boolean;
  openedAt: string;
  closedAt: string | null;
  startingBalance: number;
  salesCash: number;
  salesTransfer: number;
  totalExpenses: number;
  expectedBalance: number;
  actualBalance?: number;
  difference?: number;
  history?: {
    date: string;
    action: string;
    amount: number;
    notes?: string;
  }[];
}

export interface SocialConfig {
  whatsAppPhone: string;
  whatsAppText: string;
  instagramUrl: string;
  facebookUrl: string;
}

