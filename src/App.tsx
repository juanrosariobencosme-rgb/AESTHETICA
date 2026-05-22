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
    if (cashSessionState && cashSessionState.isOpen) {
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
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 48 48">
                  <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
                  <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
                  <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
                  <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
                  <path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a
                href={socialsState.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:opacity-80 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={socialsState.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Facebook"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
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
          href={`https://wa.me/${socialsState.whatsAppPhone}?text=${encodeURIComponent(socialsState.whatsAppText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1 hover:scale-110 select-none"
          title="WhatsApp Concierge"
        >
          <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 48 48">
            <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
            <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
            <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
            <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
            <path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"></path>
          </svg>
        </a>
      </div>

    </div>
  );
}
