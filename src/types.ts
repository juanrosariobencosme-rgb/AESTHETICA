export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  salePrice?: number;
  size: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  image: string;
  concern: 'radiance' | 'sculpt' | 'hydration' | 'calm' | 'balance';
  rating: number;
  texture: string;
  category?: string;
  active?: boolean;
  stock?: number;
  promotionTag?: string;
  skinTypes?: SkinType[];
  isOffer?: boolean;
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
  NORMAL = 'NORMAL',
  SECA = 'SECA',
  GRASA = 'GRASA',
  MIXTA = 'MIXTA',
  SENSIBLE = 'SENSIBLE',
  ACNEICA = 'ACNEICA',
  MADURA = 'MADURA',
  DESHIDRATADA = 'DESHIDRATADA',
  REACTIVA = 'REACTIVA'
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
  active?: boolean;
  category?: string;
}

export interface Combo {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  productIds: string[];
  price: number;
  valuePrice?: number;
  image: string;
  tag?: string;
  active?: boolean;
  category?: string;
}

export interface CarouselBanner {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonUrl?: string;
  relatedProductId?: string;
  active?: boolean;
  priority?: number;
  category?: string;
}

export interface ShippingSettings {
  id?: string;
  districtRate: number;
  outsideRate: number;
  districtKeywords: string[];
}

export interface BankAccount {
  id?: string;
  bankType: string;
  beneficiary: string;
  accountNumber: string;
  clabe?: string;
  active?: boolean;
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
  shippingZone?: string;
  voucherFileName?: string;
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
  id?: string;
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

