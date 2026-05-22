import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, ShoppingBag, Sparkles, Check, Heart, Shield, Award, HelpCircle, MessageSquare, Lock, Key, Eye, MessageCircle, Instagram, Facebook } from 'lucide-react';

// Data & Components imports
import { PRODUCTS } from './data';
import { Product, CartItem, PromotionBundle, Order, Expense, CashSession, SocialConfig } from './types';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import PromotionsView from './components/PromotionsView';
import ContactView from './components/ContactView';
import CheckoutView from './components/CheckoutView';
import OrderSuccessView from './components/OrderSuccessView';
import CartSidebar from './components/CartSidebar';
import AboutView from './components/AboutView';
import AdminPanel from './components/AdminPanel';
import { convertAndFormatPrice } from './utils/currency';
import { productsApi } from './lib/api/products';
import { ordersApi } from './lib/api/orders';
import { promotionsApi } from './lib/api/promotions';
import { expensesApi } from './lib/api/expenses';
import { cashSessionApi } from './lib/api/cashSession';
import { socialsApi } from './lib/api/socials';

const DEFAULT_PROMOTIONS: PromotionBundle[] = [];
const DEFAULT_ORDERS: Order[] = [];
const DEFAULT_EXPENSES: Expense[] = [];
const DEFAULT_SESSION: CashSession | null = null;
const DEFAULT_SOCIALS: SocialConfig = {
  whatsAppPhone: '18294855693',
  whatsAppText: 'Hola Aesthetica, me gustaría hacer una consulta sobre sus elixires.',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('MX');
  
  // Checkout & Order completion context
  const [orderSuccessInfo, setOrderSuccessInfo] = useState<{ name: string; email: string; paymentMethod: string; finalTotal: number; items?: CartItem[] } | null>(null);

  // Dynamic collections & databases state
  const [productsArr, setProductsArr] = useState<Product[]>(PRODUCTS);
  const [promotionsArr, setPromotionsArr] = useState<PromotionBundle[]>(DEFAULT_PROMOTIONS);
  const [ordersArr, setOrdersArr] = useState<Order[]>(DEFAULT_ORDERS);
  const [expensesArr, setExpensesArr] = useState<Expense[]>(DEFAULT_EXPENSES);
  const [cashSessionState, setCashSessionState] = useState<CashSession>(DEFAULT_SESSION);
  const [socialsState, setSocialsState] = useState<SocialConfig>(DEFAULT_SOCIALS);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, promotions, orders, expenses, cashSession, socials] = await Promise.all([
          productsApi.getAll().catch(() => PRODUCTS),
          promotionsApi.getAll().catch(() => DEFAULT_PROMOTIONS),
          ordersApi.getAll().catch(() => DEFAULT_ORDERS),
          expensesApi.getAll().catch(() => DEFAULT_EXPENSES),
          cashSessionApi.getCurrent().catch(() => DEFAULT_SESSION),
          socialsApi.get().catch(() => DEFAULT_SOCIALS)
        ]);

        setProductsArr(products);
        setPromotionsArr(promotions);
        setOrdersArr(orders);
        setExpensesArr(expenses);
        if (cashSession) setCashSessionState(cashSession);
        if (socials) setSocialsState(socials);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);

  // State persist triggers with Supabase
  const setProductsWithSync = async (p: Product[]) => {
    setProductsArr(p);
    try {
      await productsApi.upsert(p);
    } catch (error) {
      console.error('Error syncing products to Supabase:', error);
    }
  };

  const setPromotionsWithSync = async (pm: PromotionBundle[]) => {
    setPromotionsArr(pm);
    try {
      await promotionsApi.upsert(pm);
    } catch (error) {
      console.error('Error syncing promotions to Supabase:', error);
    }
  };

  const setOrdersWithSync = async (o: Order[]) => {
    setOrdersArr(o);
    // Orders are created individually, not bulk synced
  };

  const setExpensesWithSync = async (e: Expense[]) => {
    setExpensesArr(e);
    // Expenses are created individually, not bulk synced
  };

  const setCashSessionWithSync = async (cs: CashSession) => {
    setCashSessionState(cs);
    try {
      if (cs.id) {
        await cashSessionApi.update(cs.id, cs);
      } else {
        await cashSessionApi.create(cs);
      }
    } catch (error) {
      console.error('Error syncing cash session to Supabase:', error);
    }
  };

  const setSocialsWithSync = async (sc: SocialConfig) => {
    setSocialsState(sc);
    try {
      await socialsApi.update(sc);
    } catch (error) {
      console.error('Error syncing social config to Supabase:', error);
    }
  };

  // Admin authentication simulation fields
  const [adminPass, setAdminPass] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState('');

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin' || adminPass === '1234' || adminPass.toLowerCase() === 'admin22') {
      setAdminLoggedIn(true);
      setAdminError('');
    } else {
      setAdminError('Passcode incorrecto. Ingrese "admin" o el bypass rápido para desbloquear.');
    }
  };

  // Cart action triggers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Open Cart Sidebar for high feedback
    setCartOpen(true);
  };

  const handleAddBundleToCart = (products: Product[], customName: string, customPrice: number) => {
    products.forEach((p) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === p.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === p.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { product: p, quantity: 1 }];
      });
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderComplete = async (orderData: { name: string; email: string; paymentMethod: string; finalTotal: number; items: CartItem[] }) => {
    // Generate a beautiful, fully-functional invoice/order record
    const sub = orderData.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const mockOrder: Order = {
      id: `FAC-${Math.floor(Math.random() * 90000) + 10000}`,
      customerName: orderData.name,
      customerEmail: orderData.email,
      paymentMethod: orderData.paymentMethod === 'cash_delivery' ? 'EFECTIVO' : 'TRANSFERENCIA',
      items: orderData.items,
      subtotal: sub,
      tax: sub * 0.16,
      shipping: 15,
      total: orderData.finalTotal,
      date: new Date().toISOString(),
      status: 'PENDIENTE',
      notes: 'Orden de preventa registrada de manera automática por el cliente en el checkout'
    };

    // Save order to Supabase
    try {
      await ordersApi.create(mockOrder);
    } catch (error) {
      console.error('Error saving order to Supabase:', error);
    }

    // Update in-memory orders
    const updatedOrders = [mockOrder, ...ordersArr];
    setOrdersArr(updatedOrders);

    // If active cash drawer is open, record this inflow!
    if (cashSessionState.isOpen) {
      const isCash = mockOrder.paymentMethod === 'EFECTIVO';
      const updatedSession: CashSession = {
        ...cashSessionState,
        salesCash: cashSessionState.salesCash + (isCash ? mockOrder.total : 0),
        salesTransfer: cashSessionState.salesTransfer + (!isCash ? mockOrder.total : 0),
        expectedBalance: cashSessionState.expectedBalance + (isCash ? mockOrder.total : 0),
        history: [
          ...(cashSessionState.history || []),
          {
            date: new Date().toISOString(),
            action: `Venta Checkout (${mockOrder.paymentMethod})`,
            amount: mockOrder.total,
            notes: `Orden ${mockOrder.id} por ${mockOrder.customerName}`
          }
        ]
      };
      await setCashSessionWithSync(updatedSession);
    }

    setOrderSuccessInfo(orderData);
    setCart([]); // Clean cart
    setActiveTab('success');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between selection:bg-[#C5A880]/30 selection:text-[#2A2621]">
      
      {/* 1. Brand Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
        selectedCountryCode={selectedCountryCode}
        setSelectedCountryCode={setSelectedCountryCode}
      />

      {/* 2. Primary Layout Render box */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
          >
            {activeTab === 'home' && (
              <HomeView
                onExploreCollection={() => setActiveTab('catalog')}
                onViewProductDetails={(p) => setSelectedProduct(p)}
                selectedCountryCode={selectedCountryCode}
                products={productsArr}
                promotionBundles={promotionsArr}
                onAddBundleToCart={handleAddBundleToCart}
              />
            )}

            {activeTab === 'catalog' && (
              <CatalogView
                onAddToCart={handleAddToCart}
                onViewProductDetails={(p) => setSelectedProduct(p)}
                showPricesAndCart={false}
                selectedCountryCode={selectedCountryCode}
                products={productsArr}
                promotionBundles={promotionsArr}
                onAddBundleToCart={handleAddBundleToCart}
              />
            )}

            {activeTab === 'products' && (
              <CatalogView
                onAddToCart={handleAddToCart}
                onViewProductDetails={(p) => setSelectedProduct(p)}
                showPricesAndCart={true}
                selectedCountryCode={selectedCountryCode}
                products={productsArr}
                promotionBundles={promotionsArr}
                onAddBundleToCart={handleAddBundleToCart}
              />
            )}

            {activeTab === 'about' && (
              <AboutView
                onExploreCollection={() => setActiveTab('catalog')}
              />
            )}

            {activeTab === 'promotions' && (
              <PromotionsView
                onAddBundleToCart={handleAddBundleToCart}
                onExploreCollection={() => setActiveTab('catalog')}
                promotionBundles={promotionsArr}
                products={productsArr}
              />
            )}

            {activeTab === 'contact' && <ContactView />}

            {activeTab === 'admin' && (
              !adminLoggedIn ? (
                <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white border border-[#EADCC9] p-8 sm:p-10 shadow-2xl relative text-left"
                  >
                    <div className="text-center space-y-3 mb-8">
                      <div className="w-12 h-12 bg-[#F2ECE4] rounded-full flex items-center justify-center mx-auto text-[#C5A880]">
                        <Lock className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <h2 className="font-serif text-2xl text-[#2A2621]">Atelier Control</h2>
                      <p className="text-xs text-[#7D7569] uppercase tracking-[0.2em]">Mesa de Control Admin</p>
                      <div className="h-[1px] w-12 bg-[#C5A880] mx-auto mt-2" />
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#7D7569] font-bold block">
                          Passcode de Acceso
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="password"
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            placeholder="Por favor ingrese passcode"
                            className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EADCC9]/80 text-xs text-[#2A2621] focus:outline-none focus:border-[#C5A880] rounded-none pr-10 font-mono tracking-widest"
                          />
                          <Key className="w-4 h-4 text-[#C5A880] absolute right-3.5 top-3.5" />
                        </div>
                        {adminError && (
                          <p className="text-[11px] text-rose-600 font-medium pt-1 font-sans">
                            {adminError}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-[#2A2621] hover:bg-[#C5A880] text-white text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-md cursor-pointer text-center"
                      >
                        Verificar Credenciales
                      </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-stone-100 text-center">
                      <p className="text-[10px] text-stone-400 font-sans tracking-wide">
                        Sugerencia de Pruebas: ingrese <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[#C5A880] font-mono font-bold">admin</code> para desbloquear la consola demo de administración con persistencia.
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <AdminPanel
                  products={productsArr}
                  setProducts={setProductsWithSync}
                  promotions={promotionsArr}
                  setPromotions={setPromotionsWithSync}
                  orders={ordersArr}
                  setOrders={setOrdersWithSync}
                  expenses={expensesArr}
                  setExpenses={setExpensesWithSync}
                  cashSession={cashSessionState}
                  setCashSession={setCashSessionWithSync}
                  socials={socialsState}
                  setSocials={setSocialsWithSync}
                  selectedCountryCode={selectedCountryCode}
                />
              )
            )}

            {activeTab === 'checkout' && (
              <CheckoutView
                cart={cart}
                total={cartTotal}
                onBackToCatalog={() => setActiveTab('catalog')}
                onOrderComplete={handleOrderComplete}
                selectedCountryCode={selectedCountryCode}
              />
            )}

            {activeTab === 'success' && (
              <OrderSuccessView
                orderInfo={orderSuccessInfo}
                onReturnHome={() => {
                  setOrderSuccessInfo(null);
                  setActiveTab('home');
                }}
                selectedCountryCode={selectedCountryCode}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Floating Interactive Cart Sidebar Panel */}
      <AnimatePresence>
        {cartOpen && (
          <CartSidebar
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => {
              setCartOpen(false);
              setActiveTab('checkout');
            }}
            selectedCountryCode={selectedCountryCode}
          />
        )}
      </AnimatePresence>

      {/* 4. Complete Formula / Inspección Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            {/* Modal Card Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#EADCC9] shadow-2xl rounded-none overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close icon absolute */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-1 px-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Side-by-Side Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Visual Image col */}
                <div className="md:col-span-5 relative aspect-square md:aspect-auto md:h-full min-h-[300px] bg-stone-100 border-b md:border-b-0 md:border-r border-[#EADCC9]/55">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activeTab !== 'catalog' && (
                    <div className="absolute top-4 left-4 bg-[#FAF8F5]/90 border border-[#EADCC9] text-[10px] uppercase tracking-widest text-[#C5A880] px-3 py-1 font-bold">
                      {selectedProduct.size}
                    </div>
                  )}
                </div>

                {/* Narrative col */}
                <div className="md:col-span-7 p-6 sm:p-8 md:p-10 space-y-6 text-left flex flex-col justify-center">
                  
                  {/* Title Header */}
                  <div className="space-y-1.5 pr-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] bg-[#F2ECE4]/60 text-[#C5A880] px-2.5 py-0.5 rounded-xs font-semibold">
                      {activeTab === 'catalog' ? 'Catálogo de Especímenes' : 'Composición Molecular'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#2A2621]">{selectedProduct.name}</h2>
                    <p className="text-xs text-[#C5A880] uppercase tracking-[0.18em] italic">{selectedProduct.subtitle}</p>
                    
                    {/* Rating and texture */}
                    {activeTab !== 'catalog' && (
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-0.5 text-xs text-[#C5A880]">
                          <Star className="w-3.5 h-3.5 fill-[#C5A880] stroke-none" />
                          <span className="font-mono font-bold text-[#2A2621] pl-0.5">{selectedProduct.rating}</span>
                        </div>
                        <span className="text-stone-300">|</span>
                        <span className="text-xs text-[#7D7569] uppercase tracking-wider font-bold">Textura: {selectedProduct.texture}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing and description */}
                  {activeTab !== 'catalog' && (
                    <div className="space-y-2 border-y border-[#EADCC9]/50 py-4 flex justify-between items-center bg-stone-50/50 px-4">
                      <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#7D7569]">Precio Unitario:</span>
                      <span className="font-serif text-2xl font-semibold text-[#1C1917]">{convertAndFormatPrice(selectedProduct.price, selectedCountryCode)}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {activeTab === 'catalog' && (
                      <h4 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#211E1A] tracking-wider uppercase">Descripción del Elixir</h4>
                    )}
                    <p className="text-xs sm:text-sm text-[#7D7569] leading-relaxed font-light font-sans">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Custom spec details for Catalog */}
                  {activeTab === 'catalog' && (
                    <div className="grid grid-cols-2 gap-4 border-t border-[#EADCC9]/40 pt-4 text-xs font-sans">
                      <div>
                        <span className="text-[10px] text-[#A59F95] uppercase tracking-widest font-semibold block mb-0.5">Contenido Neto</span>
                        <span className="text-[#2A2621] font-medium">{selectedProduct.size}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A59F95] uppercase tracking-widest font-semibold block mb-0.5">Diagnóstico Ideal</span>
                        <span className="text-[#2A2621] font-medium uppercase text-[11px]">{selectedProduct.concern}</span>
                      </div>
                    </div>
                  )}

                  {/* Active Molecular Ingredients bullet list */}
                  {activeTab !== 'catalog' && (
                    <>
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2A2621]">Ingredientes Clave:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProduct.ingredients.map((ing, i) => (
                            <span key={i} className="text-[10px] bg-[#F2ECE4]/70 text-[#2A2621] px-3 py-1 border border-[#EADCC9]/40 font-medium">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits check list */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2A2621]">Beneficios Clínicos:</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7D7569]">
                          {selectedProduct.benefits.map((ben, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="font-light">{ben}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ritual de uso */}
                      <div className="bg-[#F2ECE4]/40 p-4 border border-[#EADCC9]/40 text-xs">
                        <h4 className="font-serif italic text-stone-800 font-bold flex items-center gap-1.5 mb-1 text-[13px]">
                           <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" /> El Ritual de Aplicación:
                        </h4>
                        <p className="text-[#7D7569] leading-relaxed font-light">{selectedProduct.usage}</p>
                      </div>
                    </>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex gap-4 pt-2 mt-auto">
                    {activeTab !== 'catalog' ? (
                      <>
                        <button
                          onClick={() => {
                            handleAddToCart(selectedProduct);
                            setSelectedProduct(null);
                          }}
                          className="flex-grow py-4 bg-[#2A2621] hover:bg-[#C5A880] text-white text-xs uppercase tracking-[0.25em] font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Agregar al Bolso Sensorial
                        </button>
                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="px-6 py-4 border border-[#EADCC9] text-stone-700 hover:text-stone-900 text-xs uppercase tracking-[0.15em] font-bold hover:bg-stone-50 transition-colors"
                        >
                          Regresar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="w-full py-4 bg-[#2A2621] hover:bg-[#C5A880] text-white text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-md"
                      >
                        Regresar al Catálogo
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Minimal Branded Footer */}
      <footer className="bg-[#1C1917] text-white py-12 border-t border-[#FAF8F5]/10 mt-auto font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-xs">
          
          <div className="space-y-4">
            <h3 className="font-serif text-lg tracking-[0.2em]">AESTHETICA</h3>
            <p className="text-[#7D7569] leading-relaxed font-light">
              Donde la medicina celular se funde con los elixires minerales más excelsos de la naturaleza universal.
            </p>
            <p className="text-[10px] text-[#C5A880] uppercase tracking-widest font-mono">
              © Atelier Skin Lab 2026. CDMX
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold font-sans">Explorar</h4>
            <ul className="space-y-2 text-[#7D7569] font-light">
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('home')}>Inicio</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('catalog')}>Catálogo</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('products')}>Productos</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('promotions')}>Promociones</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('about')}>Sobre Nosotros</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold font-sans">Servicio Concierge</h4>
            <ul className="space-y-2 text-[#7D7569] font-light">
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('contact')}>Agendar Sesión de Spa</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('contact')}>Atención Express WhatsApp</li>
              <li>Términos del Atelier</li>
              <li>Políticas de Envío Express</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold font-sans">Síguenos</h4>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${socialsState.whatsAppPhone}?text=${encodeURIComponent(socialsState.whatsAppText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={socialsState.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:opacity-80 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={socialsState.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[9px] text-[#7D7569] leading-relaxed font-light pt-2">
              Conéctate con nosotros para recibir actualizaciones exclusivas y ofertas especiales.
            </p>
          </div>

        </div>
      </footer>

      {/* 6. Floating Persistent WhatsApp Circular Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/18294855693?text=Hola%20Aesthetica%2C%20quisiera%20hacer%20una%20consulta%20sobre%20sus%20elixires."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1 hover:scale-110 select-none"
          title="WhatsApp Concierge"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965-1.862-1.864-4.335-2.889-6.972-2.89-5.442 0-9.866 4.372-9.87 9.802 0 2.011.528 3.978 1.533 5.74l-.946 3.458 3.548-.921zM17.13 15.3c-.278-.14-.1.65-.63.95-.53.3-1.06-.11-2.45-.66-1.57-.62-2.61-2.2-2.69-2.3-.08-.1-1.39-1.85-1.39-3.53 0-1.68.87-2.51 1.18-2.85.3-.34.68-.43.9-.43H12.9c.2 0 .46.07.7.63.24.56.83 2.01.9 2.15.07.14.12.3.02.5-.1.2-.22.42-.37.59-.15.17-.31.35-.45.5-.15.17-.31.35-.45.5-.15.15-.3.31-.13.6.17.29.77 1.27 1.65 2.06.9.8 1.66 1.05 1.96 1.19.3.14.47.12.65-.08.18-.2.77-.9 1.15-1.2.38-.3.76-.25 1.02-.15s1.65.78 1.93.92c.28.14.46.21.53.33.07.12.07.7-.21 1.53-.28.83-1.6 1.62-2.22 1.66-.62.04-.61.03-.9-.05z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
