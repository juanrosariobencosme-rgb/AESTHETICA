import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Plus, Trash2, Edit3, Save, Download, Search, Settings, 
  DollarSign, Users, ShoppingBag, Tag, Calculator, FileText, X, Check, 
  CheckCircle2, Lock, Unlock, Calendar, ArrowDownRight, ArrowUpRight, 
  Info, AlertTriangle, Printer, HelpCircle 
} from 'lucide-react';
import { Product, Order, Expense, CashSession, PromotionBundle, SocialConfig } from '../types';
import { convertAndFormatPrice } from '../utils/currency';
import { productsApi } from '../lib/api/products';
import { ordersApi } from '../lib/api/orders';
import { promotionsApi } from '../lib/api/promotions';
import { expensesApi } from '../lib/api/expenses';
import { cashSessionApi } from '../lib/api/cashSession';
import { socialsApi } from '../lib/api/socials';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  promotions: PromotionBundle[];
  setPromotions: (promotions: PromotionBundle[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  cashSession: CashSession;
  setCashSession: (session: CashSession) => void;
  socials: SocialConfig;
  setSocials: (config: SocialConfig) => void;
  selectedCountryCode: string;
}

export default function AdminPanel({
  products,
  setProducts,
  promotions,
  setPromotions,
  orders,
  setOrders,
  expenses,
  setExpenses,
  cashSession,
  setCashSession,
  socials,
  setSocials,
  selectedCountryCode
}: AdminPanelProps) {
  // Tabs: 'dashboard', 'inventory', 'orders', 'expenses', 'clients', 'promotions', 'cashier', 'socials'
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search filters
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  // Modals / forms state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [creatingPromo, setCreatingPromo] = useState<boolean>(false);
  const [showOpenCashForm, setShowOpenCashForm] = useState<boolean>(false);
  const [showCloseCashForm, setShowCloseCashForm] = useState<boolean>(false);
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);

  // Manual cash entry state
  const [manualCashAmount, setManualCashAmount] = useState<number>(0);
  const [manualCashType, setManualCashType] = useState<'cash' | 'transfer' | 'expense'>('cash');
  const [manualCashDescription, setManualCashDescription] = useState<string>('');

  // Cash history state
  const [cashHistory, setCashHistory] = useState<any[]>([]);

  // New product input state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(100);
  const [newProdSize, setNewProdSize] = useState('50 ml');
  const [newProdTexture, setNewProdTexture] = useState('Silk micro-emulsion');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=1000');
  const [newProdConcern, setNewProdConcern] = useState<'radiance' | 'sculpt' | 'hydration' | 'calm'>('radiance');
  const [newProdIngredients, setNewProdIngredients] = useState('Saffron Peptides, Pure Squalane');
  const [newProdBenefits, setNewProdBenefits] = useState('Increases natural collagen, Infuses deep moisture');
  const [newProdUsage, setNewProdUsage] = useState('Apply 2-3 drops after routine cleansing.');

  // New promotion state
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoSubtitle, setNewPromoSubtitle] = useState('');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoPrice, setNewPromoPrice] = useState(150);
  const [newPromoVal, setNewPromoVal] = useState(250);
  const [newPromoImage, setNewPromoImage] = useState('https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000');
  const [newPromoTag, setNewPromoTag] = useState('Edición Limitada');
  const [newPromoProdIds, setNewPromoProdIds] = useState<string[]>([]);

  // New Expense state
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseCategory, setExpenseCategory] = useState<'IMPERIAL_RAW' | 'LOGISTICA' | 'CUPONES' | 'PERSONAL' | 'MARKETING' | 'OTROS'>('IMPERIAL_RAW');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');

  // Cash closure counting states
  const [closurePhysicalCash, setClosurePhysicalCash] = useState<number>(0);

  // Manual cash registration handler
  const handleRegisterCash = () => {
    if (!manualCashAmount || manualCashAmount <= 0) {
      showFeedback('Por favor ingresa un monto válido', true);
      return;
    }

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: manualCashType === 'expense' ? -manualCashAmount : manualCashAmount,
      type: manualCashType,
      description: manualCashDescription || (manualCashType === 'cash' ? 'Venta en efectivo' : manualCashType === 'transfer' ? 'Transferencia' : 'Gasto')
    };

    setCashHistory([...cashHistory, entry]);
    
    // Update cash session
    if (cashSession?.isOpen) {
      if (manualCashType === 'cash') {
        setCashSession({
          ...cashSession,
          salesCash: cashSession.salesCash + manualCashAmount,
          history: [...(cashSession.history || []), {
            date: new Date().toISOString(),
            action: 'Venta Efectivo Manual',
            amount: manualCashAmount,
            notes: manualCashDescription
          }]
        });
      } else if (manualCashType === 'transfer') {
        setCashSession({
          ...cashSession,
          salesTransfer: cashSession.salesTransfer + manualCashAmount,
          history: [...(cashSession.history || []), {
            date: new Date().toISOString(),
            action: 'Transferencia Manual',
            amount: manualCashAmount,
            notes: manualCashDescription
          }]
        });
      } else if (manualCashType === 'expense') {
        setCashSession({
          ...cashSession,
          history: [...(cashSession.history || []), {
            date: new Date().toISOString(),
            action: 'Gasto Registrado',
            amount: -manualCashAmount,
            notes: manualCashDescription
          }]
        });
      }
    }

    // Reset form
    setManualCashAmount(0);
    setManualCashDescription('');
    setShowRegisterForm(false);
    showFeedback('Movimiento registrado exitosamente');
  };

  // Custom finance ranges
  const [customRangeStart, setCustomRangeStart] = useState('');
  const [customRangeEnd, setCustomRangeEnd] = useState('');
  const [customRangeRevenue, setCustomRangeRevenue] = useState<number | null>(null);

  // Trigger feedback banner helper
  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 3500);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  // --- Dynamic Financial Calculations ---
  const dynamicFinance = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Helper to calculate start of this week (Monday)
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1; // 0 is Sunday, 1 is Monday...
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let dailyRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;
    let yearlyRevenue = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const total = order.total;

      if (orderDate >= startOfToday) dailyRevenue += total;
      if (orderDate >= startOfWeek) weeklyRevenue += total;
      if (orderDate >= startOfMonth) monthlyRevenue += total;
      if (orderDate >= startOfYear) yearlyRevenue += total;
      totalRevenue += total;
    });

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    return {
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      totalRevenue,
      totalExpenses,
      netProfit
    };
  }, [orders, expenses]);

  // Handle Custom Finance calculation
  const handleCalculateCustomRange = () => {
    if (!customRangeStart || !customRangeEnd) {
      showFeedback('Por favor introduce ambas fechas', true);
      return;
    }
    const start = new Date(customRangeStart);
    const end = new Date(customRangeEnd);
    end.setHours(23, 59, 59, 999); // include full end day

    let sum = 0;
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      if (orderDate >= start && orderDate <= end) {
        sum += order.total;
      }
    });
    setCustomRangeRevenue(sum);
    showFeedback(`Reporte calculado para el periodo especificado`);
  };

  // --- Product Management Actions ---
  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSubtitle || newProdPrice <= 0) {
      showFeedback('Por favor introduce datos válidos para el producto', true);
      return;
    }

    const newProd: Product = {
      id: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newProdName,
      subtitle: newProdSubtitle,
      description: newProdDesc,
      price: Number(newProdPrice),
      size: newProdSize,
      ingredients: newProdIngredients.split(',').map(s => s.trim()).filter(Boolean),
      benefits: newProdBenefits.split(',').map(s => s.trim()).filter(Boolean),
      usage: newProdUsage,
      image: newProdImage,
      concern: newProdConcern,
      rating: 4.8,
      texture: newProdTexture
    };

    try {
      await productsApi.create(newProd);
      const updated = [...products, newProd];
      setProducts(updated);
      
      // Clear forms
      setNewProdName('');
      setNewProdSubtitle('');
      setNewProdDesc('');
      setNewProdPrice(100);
      setNewProdIngredients('Saffron Peptides, Pure Squalane');
      setNewProdBenefits('Increases natural collagen, Infuses deep moisture');
      setCreatingProduct(false);
      showFeedback(`Elixir "${newProd.name}" creado e insertado al catálogo.`);
    } catch (error) {
      console.error('Error creating product:', error);
      showFeedback('Error al crear producto en Supabase', true);
    }
  };

  const handleUpdateProductStockAndPrice = async (id: string, updatedPrice: number, updatedTexture: string) => {
    try {
      await productsApi.update(id, { price: Number(updatedPrice), texture: updatedTexture });
      const updated = products.map(p => {
        if (p.id === id) {
          return {
            ...p,
            price: Number(updatedPrice),
            texture: updatedTexture
          };
        }
        return p;
      });
      setProducts(updated);
      setEditingProduct(null);
      showFeedback('Datos del producto actualizados correctamente.');
    } catch (error) {
      console.error('Error updating product:', error);
      showFeedback('Error al actualizar producto en Supabase', true);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este elixir del catálogo permanentemente? Esto modificará las promociones secundarias.')) {
      try {
        await productsApi.delete(id);
        setProducts(products.filter(p => p.id !== id));
        showFeedback('Elixir eliminado del catálogo.');
      } catch (error) {
        console.error('Error deleting product:', error);
        showFeedback('Error al eliminar producto en Supabase', true);
      }
    }
  };

  // --- Promotions Actions ---
  const handleTogglePromoProductId = (id: string) => {
    setNewPromoProdIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCreatePromotion = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPromoTitle || newPromoPrice <= 0 || newPromoProdIds.length === 0) {
      showFeedback('Por favor introduce un título, precio y al menos un producto asociado', true);
      return;
    }

    const newBundle: PromotionBundle = {
      id: `bundle-${Date.now()}`,
      title: newPromoTitle,
      subtitle: newPromoSubtitle,
      description: newPromoDesc,
      productIds: newPromoProdIds,
      price: Number(newPromoPrice),
      valuePrice: Number(newPromoVal),
      image: newPromoImage,
      tag: newPromoTag
    };

    try {
      await promotionsApi.create(newBundle);
      setPromotions([...promotions, newBundle]);
      setNewPromoTitle('');
      setNewPromoSubtitle('');
      setNewPromoDesc('');
      setNewPromoProdIds([]);
      setCreatingPromo(false);
      showFeedback(`Promoción "${newBundle.title}" ha sido publicada en la página principal.`);
    } catch (error) {
      console.error('Error creating promotion:', error);
      showFeedback('Error al crear promoción en Supabase', true);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (confirm('¿Eliminar esta promoción permanentemente?')) {
      try {
        await promotionsApi.delete(id);
        setPromotions(promotions.filter(p => p.id !== id));
        showFeedback('Promoción retirada.');
      } catch (error) {
        console.error('Error deleting promotion:', error);
        showFeedback('Error al eliminar promoción en Supabase', true);
      }
    }
  };

  // --- Expenses Actions ---
  const handleAddExpense = async (e: FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || expenseAmount <= 0) {
      showFeedback('Por favor ingresa un título y monto de egreso válido', true);
      return;
    }

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      title: expenseTitle,
      amount: Number(expenseAmount),
      category: expenseCategory,
      date: expenseDate,
      notes: expenseNotes
    };

    try {
      await expensesApi.create(newExp);
      setExpenses([newExp, ...expenses]);
      setExpenseTitle('');
      setExpenseAmount(0);
      setExpenseNotes('');
      showFeedback('Egreso registrado correctamente.');
    } catch (error) {
      console.error('Error creating expense:', error);
      showFeedback('Error al registrar egreso en Supabase', true);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('¿Eliminar este egreso registrado?')) {
      try {
        await expensesApi.delete(id);
        setExpenses(expenses.filter(e => e.id !== id));
        showFeedback('Egreso eliminado.');
      } catch (error) {
        console.error('Error deleting expense:', error);
        showFeedback('Error al eliminar egreso en Supabase', true);
      }
    }
  };

  // --- Cashier session control ---
  const handleOpenCashSession = async (starting: number) => {
    const updated: CashSession = {
      isOpen: true,
      openedAt: new Date().toISOString(),
      closedAt: null,
      startingBalance: Number(starting),
      salesCash: 0,
      salesTransfer: 0,
      totalExpenses: 0,
      expectedBalance: Number(starting),
      history: [
        {
          date: new Date().toISOString(),
          action: 'Apertura de Caja',
          amount: Number(starting),
          notes: 'Session iniciada manualmente por el administrador'
        }
      ]
    };
    try {
      const created = await cashSessionApi.create(updated);
      setCashSession(created);
      showFeedback('Caja Abierta y habilitada para recibir ingresos.');
    } catch (error) {
      console.error('Error opening cash session:', error);
      showFeedback('Error al abrir sesión de caja en Supabase', true);
    }
  };

  const handleCloseCashSession = async () => {
    if (!cashSession?.id) {
      showFeedback('No hay sesión de caja activa para cerrar', true);
      return;
    }

    const totalCashIn = cashSession.startingBalance + cashSession.salesCash;
    const expected = totalCashIn - cashSession.totalExpenses;
    const diff = closurePhysicalCash - expected;

    const finalSession: CashSession = {
      ...cashSession,
      isOpen: false,
      closedAt: new Date().toISOString(),
      expectedBalance: expected,
      actualBalance: Number(closurePhysicalCash),
      difference: diff,
      history: [
        ...(cashSession.history || []),
        {
          date: new Date().toISOString(),
          action: 'Cierre de Caja',
          amount: Number(closurePhysicalCash),
          notes: `Cierre verificado. Faltante/Sobrante neto: ${diff}`
        }
      ]
    };

    try {
      await cashSessionApi.closeSession(cashSession.id);
      setCashSession(finalSession);
      setClosurePhysicalCash(0);
      showFeedback(`Caja de venta CERRADA con éxito. Diferencia registrada: ${convertAndFormatPrice(diff, selectedCountryCode)}`);
    } catch (error) {
      console.error('Error closing cash session:', error);
      showFeedback('Error al cerrar sesión de caja en Supabase', true);
    }
  };


  // Dynamic lists with search selectors
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.subtitle.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.concern.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
    o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredExpenses = expenses.filter(e => 
    e.title.toLowerCase().includes(expenseSearch.toLowerCase()) || 
    e.category.toLowerCase().includes(expenseSearch.toLowerCase())
  );

  // Client database built from both direct orders and spa appointments (simulated CRM board)
  const clientsCRM = useMemo(() => {
    const registry: { [email: string]: { name: string; email: string; ordersCount: number; spent: number; lastDate: string } } = {};
    
    orders.forEach(o => {
      const email = o.customerEmail.toLowerCase();
      if (!registry[email]) {
        registry[email] = {
          name: o.customerName,
          email: o.customerEmail,
          ordersCount: 0,
          spent: 0,
          lastDate: o.date
        };
      }
      registry[email].ordersCount += 1;
      registry[email].spent += o.total;
      if (new Date(o.date) > new Date(registry[email].lastDate)) {
        registry[email].lastDate = o.date;
      }
    });

    // Match users from search field
    return Object.values(registry).filter(c => 
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [orders, clientSearch]);

  return (
    <div className="bg-[#FAF8F5] text-[#2A2621] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Branding */}
        <div className="border-b border-[#EADCC9]/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] font-bold block mb-1">
              Atelier Skin Lab
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2621] font-light">
              Mesa Administrativa Interna
            </h1>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#7D7569] bg-stone-100 px-3 py-2 border border-stone-200">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modo Root Conectado</span>
            </div>
          </div>
        </div>

        {/* Global Error/Success Notification Banner */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-50 border border-emerald-400 text-emerald-800 p-4 text-xs font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-rose-50 border border-rose-400 text-rose-800 p-4 text-xs font-medium flex items-center gap-2"
            >
              <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Grid layout: Left Sidebar controls vs Right Panel details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation drawer menu column */}
          <div className="lg:col-span-3 space-y-2 bg-[#FAF8F5] border border-[#EADCC9]/50 p-4 shadow-2xs">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#7D7569] px-2 mb-4">
              Módulos Operacionales
            </p>
            {[
              { id: 'dashboard', label: 'Dashboard & Finanzas', icon: TrendingUp },
              { id: 'inventory', label: 'Control Inventario', icon: ShoppingBag },
              { id: 'orders', label: 'Facturas y Órdenes', icon: FileText },
              { id: 'expenses', label: 'Egresos y Gastos', icon: DollarSign },
              { id: 'clients', label: 'Cartelera de Clientes', icon: Users },
              { id: 'promotions', label: 'Campañas Promociones', icon: Tag },
              { id: 'cashier', label: 'Caja y Cierre Diario', icon: Calculator },
              { id: 'socials', label: 'Ajustes Redes Sociales', icon: Settings },
            ].map(tab => {
              const IconComp = tab.icon;
              const isSelected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-3 py-3 rounded-none text-xs uppercase tracking-wider font-semibold transition-all ${
                    isSelected 
                      ? 'bg-[#2A2621] text-white' 
                      : 'text-[#7D7569] hover:bg-stone-100 hover:text-[#2A2621]'
                  }`}
                >
                  <IconComp className="w-4.5 h-4.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Work Canvas column */}
          <div className="lg:col-span-9 bg-white border border-[#EADCC9]/55 p-6 sm:p-8 rounded-none shadow-sm min-h-[500px]">
            
            {/* ====== SUB TIER 1: FINANCIAL DASHBOARD ====== */}
            {activeSubTab === 'dashboard' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-4">
                  <h2 className="font-serif text-xl tracking-tight text-[#1A1816]">Indicadores de Ingresos & Auditoría</h2>
                  <span className="text-[10px] uppercase font-mono text-[#C5A880] font-bold">Resumen de ventas</span>
                </div>

                {/* KPI Metrics List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#FAF8F5] border border-[#EADCC9]/50 p-4 space-y-1 rounded-none shadow-3xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7D7569] block">Ingreso del Día</span>
                    <span className="font-serif text-lg font-bold text-emerald-700">{convertAndFormatPrice(dynamicFinance.dailyRevenue, selectedCountryCode)}</span>
                    <span className="text-[9px] text-[#A59F95] block italic font-sans">Hoy en curso</span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EADCC9]/50 p-4 space-y-1 rounded-none shadow-3xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7D7569] block">Ingreso Semanal</span>
                    <span className="font-serif text-lg font-bold text-[#2A2621]">{convertAndFormatPrice(dynamicFinance.weeklyRevenue, selectedCountryCode)}</span>
                    <span className="text-[9px] text-[#A59F95] block italic font-sans">Semana actual</span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EADCC9]/50 p-4 space-y-1 rounded-none shadow-3xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7D7569] block">Ingreso Mensual (Mes)</span>
                    <span className="font-serif text-lg font-bold text-[#2A2621]">{convertAndFormatPrice(dynamicFinance.monthlyRevenue, selectedCountryCode)}</span>
                    <span className="text-[9px] text-[#A59F95] block italic font-sans">Mayo 2026</span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EADCC9]/50 p-4 space-y-1 rounded-none shadow-3xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7D7569] block">Ingreso Anual (Año)</span>
                    <span className="font-serif text-lg font-bold text-[#2A2621]">{convertAndFormatPrice(dynamicFinance.yearlyRevenue, selectedCountryCode)}</span>
                    <span className="text-[9px] text-[#A59F95] block italic font-sans">Todo 2026</span>
                  </div>
                </div>

                {/* Global Balances: Net Profit Audit */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-50 border border-[#EADCC9]/40 p-4">
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#7D7569] block">Ingresos Brutos Acumulados</span>
                    <p className="font-serif text-xl font-bold text-[#2A2621] mt-1">{convertAndFormatPrice(dynamicFinance.totalRevenue, selectedCountryCode)}</p>
                  </div>
                  <div className="text-left border-t md:border-t-0 md:border-x border-[#EADCC9]/40 pt-2 md:pt-0 md:px-4">
                    <span className="text-[9px] uppercase tracking-wider text-[#7D7569] block">Gastos Registrados (Egresos)</span>
                    <p className="font-serif text-xl font-bold text-rose-700 mt-1">-{convertAndFormatPrice(dynamicFinance.totalExpenses, selectedCountryCode)}</p>
                  </div>
                  <div className="text-left pt-2 md:pt-0 md:pl-4">
                    <span className="text-[9px] uppercase tracking-wider text-[#7D7569] block">Utilidad NETA (Net Profit)</span>
                    <p className={`font-serif text-xl font-bold mt-1 ${dynamicFinance.netProfit >= 0 ? "text-indigo-900" : "text-rose-800"}`}>
                      {convertAndFormatPrice(dynamicFinance.netProfit, selectedCountryCode)}
                    </p>
                  </div>
                </div>

                {/* Customizable Financial Range Tool (Personalizado) */}
                <div className="bg-[#FAF8F5] border border-[#EADCC9]/50 p-4 space-y-4">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-[#2A2621] flex items-center gap-1.5">
                    <Calendar className="w-4.5 h-4.5 text-[#C5A880]" />
                    Generación de Reporte Personalizado
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#7D7569] block mb-1">Fecha Inicio</label>
                      <input 
                        type="date" 
                        value={customRangeStart} 
                        onChange={e => setCustomRangeStart(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-[#EADCC9] rounded-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#7D7569] block mb-1">Fecha Fin</label>
                      <input 
                        type="date" 
                        value={customRangeEnd} 
                        onChange={e => setCustomRangeEnd(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-[#EADCC9] rounded-none focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#EADCC9]/30">
                    <button
                      onClick={handleCalculateCustomRange}
                      className="px-4 py-2 bg-[#2A2621] hover:bg-[#C5A880] text-white text-[10px] uppercase tracking-widest font-bold transition-all"
                    >
                      Calcular Ingreso de Rango
                    </button>
                    {customRangeRevenue !== null && (
                      <div className="text-right">
                        <span className="text-[9px] text-[#7D7569] block uppercase">Ventas totales procesadas en rango:</span>
                        <span className="text-sm font-serif font-bold text-emerald-800">{convertAndFormatPrice(customRangeRevenue, selectedCountryCode)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gorgeous Visual Line / Bar Analytics Chart built on responsive SVG */}
                <div className="bg-[#FAF8F5] border border-[#EADCC9]/50 p-6 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-xs uppercase font-bold tracking-widest text-[#2A2621]">Gráfica de Ingresos Consolidados</h4>
                      <p className="text-[10px] text-[#7D7569] mt-0.5 font-sans">Simulación de tendencias diarias en los últimos periodos</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-700 block"></span><span>Ventas</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#C5A880] block"></span><span>Proyección</span></div>
                    </div>
                  </div>

                  {/* SVG Bar / Chart representing data points */}
                  <div className="h-44 w-full bg-white border border-[#EADCC9]/40 relative flex items-end p-2 px-6 pt-6">
                    <div className="absolute inset-x-6 top-12 border-b border-stone-100"></div>
                    <div className="absolute inset-x-6 top-24 border-b border-stone-100 font-mono text-[8px] text-stone-300 text-right pr-2">Cresta Media</div>
                    <div className="absolute inset-x-6 top-32 border-b border-stone-100"></div>
                    
                    {/* Columns representing calendar ranges */}
                    <div className="flex-1 flex justify-around items-end h-full z-10">
                      {[
                        { day: 'Lun', amt: 45, proj: 30 },
                        { day: 'Mar', amt: 85, proj: 40 },
                        { day: 'Mie', amt: 60, proj: 55 },
                        { day: 'Jue', amt: 120, proj: 90 },
                        { day: 'Vie', amt: 145, proj: 120 },
                        { day: 'Sab', amt: 210, proj: 160 },
                        { day: 'Dom', amt: (dynamicFinance.dailyRevenue / 10) || 50, proj: 90 }
                      ].map((bar, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 w-full max-w-[40px]">
                          <div className="w-full flex items-end gap-1 h-32 justify-center">
                            <div 
                              style={{ height: `${Math.min(100, bar.amt / 2)}%` }}
                              className="w-3 bg-indigo-900/90 transition-all duration-700 hover:opacity-85" 
                              title={`Ventas: $${bar.amt * 10}`} 
                            />
                            <div 
                              style={{ height: `${Math.min(100, bar.proj / 2)}%` }}
                              className="w-1.5 bg-[#C5A880]/70 transition-all duration-700" 
                            />
                          </div>
                          <span className="font-mono text-[9px] text-[#7D7569]">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ====== SUB TIER 2: CONTROL INVENTARIO (Add/Mod/Delete) ====== */}
            {activeSubTab === 'inventory' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#2A2621] tracking-tight">Especímenes en Laboratorio</h2>
                    <p className="text-[10px] text-[#7D7569] mt-0.5">Gestione precios, texturas, adiciones y catálogo molecular.</p>
                  </div>
                  <button
                    onClick={() => setCreatingProduct(true)}
                    className="bg-[#2A2621] text-white hover:bg-[#C5A880] px-4 py-2 text-[10px] tracking-widest font-bold uppercase transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Subir Nuevo Elixir
                  </button>
                </div>

                {/* Sub-form modal/block to compose products */}
                {creatingProduct && (
                  <form onSubmit={handleCreateProduct} className="p-5 border border-amber-300 bg-amber-50/15 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-2">
                      <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-800">Fórmula de Adición Molecular</h3>
                      <button type="button" onClick={() => setCreatingProduct(false)}><X className="w-4 h-4 text-stone-500" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Nombre Comercial</label>
                        <input type="text" placeholder="Velours Sublime" value={newProdName} onChange={e => setNewProdName(e.target.value)} required className="w-full p-2.5 border bg-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Subtítulo Descriptivo</label>
                        <input type="text" placeholder="Active Blue Copper & Peptides" value={newProdSubtitle} onChange={e => setNewProdSubtitle(e.target.value)} required className="w-full p-2.5 border bg-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-semibold text-stone-700 block mb-1">Narrativa de Beneficio (Descripción)</label>
                        <textarea placeholder="Un elixir concentrado..." value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} className="w-full p-2.5 border bg-white h-20" />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Precio Unitario (USD Base)</label>
                        <input type="number" value={newProdPrice} onChange={e => setNewProdPrice(Number(e.target.value))} required className="w-full p-2.5 border bg-white" />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Tamaño embotellado</label>
                        <input type="text" value={newProdSize} onChange={e => setNewProdSize(e.target.value)} className="w-full p-2.5 border bg-white" />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Textura sugerida</label>
                        <input type="text" value={newProdTexture} onChange={e => setNewProdTexture(e.target.value)} className="w-full p-2.5 border bg-white" />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Imagen URL</label>
                        <input type="text" value={newProdImage} onChange={e => setNewProdImage(e.target.value)} className="w-full p-2.5 border bg-white" />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Categoría Diagnóstico</label>
                        <select value={newProdConcern} onChange={e => setNewProdConcern(e.target.value as any)} className="w-full p-2.5 border bg-white">
                          <option value="radiance">Luminosidad (Radiance)</option>
                          <option value="sculpt">Firmeza (Sculpt)</option>
                          <option value="hydration">Hidratación (Hydration)</option>
                          <option value="calm">Calma (Calm)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-semibold text-stone-700 block mb-1">Ingredientes Claves (separados por coma)</label>
                        <input type="text" value={newProdIngredients} onChange={e => setNewProdIngredients(e.target.value)} className="w-full p-2.5 border bg-white" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-[#2A2621] hover:bg-stone-800 text-white text-[10px] uppercase font-bold tracking-widest">
                      Comprometer Fórmulas y Publicar
                    </button>
                  </form>
                )}

                {/* Filter and layout List table */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por molécula, beneficio o categoría..."
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="w-full bg-stone-50 border border-[#EADCC9]/55 pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:bg-white focus:border-[#C5A880] transition-colors rounded-none placeholder:text-stone-400"
                    />
                  </div>

                  <div className="overflow-x-auto border border-[#EADCC9]/40">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F5] border-b border-[#EADCC9]/40 text-[#7D7569] uppercase tracking-[0.1em] font-bold text-[9px]">
                          <th className="py-3 px-4">Elixir</th>
                          <th className="py-3 px-4">Diagnóstico</th>
                          <th className="py-3 px-4 text-right">Precio Base</th>
                          <th className="py-3 px-4">Especificación / Textura</th>
                          <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredProducts.map(p => {
                          const isEditing = editingProduct?.id === p.id;
                          return (
                            <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <img src={p.image} className="w-9 h-9 object-cover border border-[#EADCC9]/50" referrerPolicy="no-referrer" />
                                  <div>
                                    <span className="font-serif font-bold text-[#2A2621] block">{p.name}</span>
                                    <span className="text-[10px] text-[#C5A880] font-sans font-light">{p.subtitle}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] tracking-wider uppercase font-semibold bg-stone-100 text-stone-700">
                                  {p.concern}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-bold">
                                {isEditing ? (
                                  <input 
                                    type="number" 
                                    value={editingProduct.price}
                                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                    className="w-20 text-right p-1 border"
                                  />
                                ) : (
                                  convertAndFormatPrice(p.price, selectedCountryCode)
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-[#7D7569]">
                                {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={editingProduct.texture}
                                    onChange={e => setEditingProduct({ ...editingProduct, texture: e.target.value })}
                                    className="w-full p-1 border text-stone-700"
                                  />
                                ) : (
                                  <>
                                    <span className="block font-medium">{p.size}</span>
                                    <span className="text-[10px] font-mono italic block text-[#A59F95]">{p.texture}</span>
                                  </>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {isEditing ? (
                                    <>
                                      <button 
                                        onClick={() => handleUpdateProductStockAndPrice(p.id, editingProduct.price, editingProduct.texture)}
                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                                        title="Guardar"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => setEditingProduct(null)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                                        title="Cancelar"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button 
                                        onClick={() => setEditingProduct(p)}
                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                                        title="Modificar precio y textura"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteProduct(p.id)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                                        title="Eliminar"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ====== SUB TIER 3: FACTURACIÓN & INVOICES ====== */}
            {activeSubTab === 'orders' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#2A2621] tracking-tight">Egresor de Ventas & Facturas Emitidas</h2>
                    <p className="text-[10px] text-[#7D7569] mt-0.5">Gestione envíos, verifique transferencias bancarias y imprima recibos oficiales.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C5A880]">Total: {orders.length} Facturas</span>
                </div>

                {/* Direct Factura Viewer Modal */}
                <AnimatePresence>
                  {selectedInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs" onClick={() => setSelectedInvoice(null)} />
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white border border-[#EADCC9] shadow-2xl relative z-10 w-full max-w-2xl p-6 sm:p-8 rounded-none font-sans"
                      >
                        {/* Close button */}
                        <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 p-1 border hover:bg-stone-100"><X className="w-4 h-4" /></button>
                        
                        {/* Print Frame / Layout */}
                        <div id="invoice-print-area" className="space-y-6 text-stone-800 text-xs">
                          {/* Invoice Logo */}
                          <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                            <div>
                              <h3 className="font-serif text-lg tracking-widest text-stone-900">AESTHETICA ATELIER</h3>
                              <p className="text-[8px] uppercase tracking-wider text-stone-400">Atelier Skin Lab SA de CV</p>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-stone-600 block">{selectedInvoice.id}</span>
                              <span className="text-[9px] text-[#7D7569]">{new Date(selectedInvoice.date).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Customer data and payment details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] text-stone-400 uppercase tracking-widest block font-bold mb-0.5">Comprador</span>
                              <p className="font-bold text-stone-800">{selectedInvoice.customerName}</p>
                              <p className="text-stone-500 font-mono">{selectedInvoice.customerEmail}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-stone-400 uppercase tracking-widest block font-bold mb-0.5">Método de Liquidación</span>
                              <p className="font-bold text-stone-800 uppercase">{selectedInvoice.paymentMethod}</p>
                              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold rounded mt-1">Estatus: {selectedInvoice.status}</span>
                            </div>
                          </div>

                          {/* Products Table in invoice */}
                          <div className="border border-stone-100">
                            <div className="bg-stone-50 grid grid-cols-12 font-bold p-2 text-[9px] text-stone-500 uppercase">
                              <span className="col-span-7">Elixir de Cuidado</span>
                              <span className="col-span-2 text-center">Cant.</span>
                              <span className="col-span-3 text-right">Subtotal</span>
                            </div>
                            {selectedInvoice.items.map((item, index) => (
                              <div key={index} className="grid grid-cols-12 p-2.5 border-t border-stone-100 text-stone-700">
                                <span className="col-span-7 font-semibold">{item.product.name} ({item.product.size})</span>
                                <span className="col-span-2 text-center font-mono">{item.quantity}</span>
                                <span className="col-span-3 text-right font-mono">{convertAndFormatPrice(item.product.price * item.quantity, selectedCountryCode)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Summary ledger box */}
                          <div className="w-full max-w-xs ml-auto space-y-1.5 text-right font-sans pt-1">
                            <div className="flex justify-between">
                              <span className="text-stone-400">Subtotal:</span>
                              <span className="font-mono text-stone-800">{convertAndFormatPrice(selectedInvoice.subtotal, selectedCountryCode)}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-stone-400">Impuesto IVA (16%):</span>
                              <span className="font-mono text-stone-800">{convertAndFormatPrice(selectedInvoice.tax, selectedCountryCode)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-400">Seguro Courier DHL Express:</span>
                              <span className="font-mono text-stone-800">{convertAndFormatPrice(selectedInvoice.shipping, selectedCountryCode)}</span>
                            </div>
                            <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-bold">
                              <span>Total Neto Liquidado:</span>
                              <span className="font-serif text-stone-900 border-b border-double border-stone-400">{convertAndFormatPrice(selectedInvoice.total, selectedCountryCode)}</span>
                            </div>
                          </div>

                          {/* Footer and physical print triggers */}
                          <div className="border-t border-stone-200 pt-4 text-center space-y-4">
                            <p className="text-[8px] text-stone-400 italic">Este ticket representa un comprobante formal de adquisición molecular dermatológica. Gracias por preferir el Atelier Aesthetica.</p>
                            <button
                              onClick={() => window.print()}
                              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-[10px] tracking-widest font-bold uppercase cursor-pointer inline-flex items-center gap-1.5 rounded-none"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Imprimir Recibo Físico
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Sub-block selector lists */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por código (FAC-), nombre del cliente o email..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="w-full bg-stone-50 border border-[#EADCC9]/55 pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:bg-white focus:border-[#C5A880] transition-colors rounded-none placeholder:text-stone-400"
                    />
                  </div>

                  <div className="overflow-x-auto border border-[#EADCC9]/40">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F5] border-b border-[#EADCC9]/40 text-[#7D7569] uppercase tracking-[0.1em] font-bold text-[9px]">
                          <th className="py-3 px-4">Código Factura</th>
                          <th className="py-3 px-4">Cliente</th>
                          <th className="py-3 px-4">Fecha</th>
                          <th className="py-3 px-4">Método Pago</th>
                          <th className="py-3 px-4 text-right">Monto Total</th>
                          <th className="py-3 px-4 text-center">Detalle / Recibo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredOrders.map(o => (
                          <tr key={o.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-stone-800">{o.id}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-stone-800 block">{o.customerName}</span>
                              <span className="text-[10px] text-[#7D7569] block">{o.customerEmail}</span>
                            </td>
                            <td className="py-3.5 px-4 text-stone-500 font-mono">{new Date(o.date).toLocaleString()}</td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2.5 py-0.5 bg-stone-100 border text-[9px] font-mono tracking-wider text-stone-700 rounded select-none">
                                {o.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-serif font-bold text-stone-900">{convertAndFormatPrice(o.total, selectedCountryCode)}</td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedInvoice(o)}
                                className="px-3 py-1.5 bg-stone-150 hover:bg-stone-200 border border-stone-200 text-stone-700 text-[10px] font-bold uppercase transition-all rounded"
                              >
                                Ver / Imprimir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ====== SUB TIER 4: REGISTRAR GASTOS ====== */}
            {activeSubTab === 'expenses' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#2A2621] tracking-tight">Egresos & Costos Corrientes</h2>
                    <p className="text-[10px] text-[#7D7569] mt-0.5">Registre la compra de insumos dermatológicos, costos logísticos o marketing.</p>
                  </div>
                </div>

                {/* Gastos registration form */}
                <form onSubmit={handleAddExpense} className="p-4 border bg-stone-50 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">Título / Concepto</label>
                    <input 
                      type="text" 
                      placeholder="Moléculas Saffron Extract" 
                      value={expenseTitle} 
                      onChange={e => setExpenseTitle(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border"
                      required
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">Monto (USD)</label>
                    <input 
                      type="number" 
                      placeholder="350" 
                      value={expenseAmount || ''} 
                      onChange={e => setExpenseAmount(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-white border"
                      required
                    />
                  </div>
                  <div className="w-40 space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">Categoría</label>
                    <select 
                      value={expenseCategory} 
                      onChange={e => setExpenseCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-white border"
                    >
                      <option value="IMPERIAL_RAW">Materia Prima Imperial</option>
                      <option value="LOGISTICA">Logística / Envíos</option>
                      <option value="CUPONES">Reembolsos / Cupones</option>
                      <option value="PERSONAL">Nómina / Personal</option>
                      <option value="MARKETING">Pautas / Publicidad</option>
                      <option value="OTROS">Otros Gastos</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="px-5 py-3 bg-[#2A2621] hover:bg-[#C5A880] text-white text-[10px] uppercase font-bold tracking-widest transition-colors h-10.5"
                  >
                    Registrar Egreso
                  </button>
                </form>

                {/* Ledger output */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar egresos..."
                      value={expenseSearch}
                      onChange={e => setExpenseSearch(e.target.value)}
                      className="w-full bg-stone-50 border border-[#EADCC9]/55 pl-9 pr-4 py-2.5 text-xs focus:outline-none placeholder:text-stone-400"
                    />
                  </div>

                  <div className="overflow-x-auto border border-[#EADCC9]/40">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F5] border-b border-[#EADCC9]/40 text-[#7D7569] uppercase tracking-[0.1em] font-bold text-[9px]">
                          <th className="py-3 px-4">Concepto</th>
                          <th className="py-3 px-4">Fecha</th>
                          <th className="py-3 px-4">Categoría</th>
                          <th className="py-3 px-4 text-right">Importe</th>
                          <th className="py-3 px-4 text-center">Quitar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map(e => (
                          <tr key={e.id} className="border-b border-stone-100 hover:bg-stone-50">
                            <td className="py-3 px-4 font-bold text-stone-800">{e.title}</td>
                            <td className="py-3 px-4 text-stone-500 font-mono">{e.date}</td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-1.5 py-0.5 font-mono text-[9px] uppercase bg-rose-50 text-rose-800 rounded">
                                {e.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">-{convertAndFormatPrice(e.amount, selectedCountryCode)}</td>
                            <td className="py-3 px-4 text-center">
                              <button onClick={() => handleDeleteExpense(e.id)} className="text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                          <tr><td colSpan={5} className="py-6 text-center text-[#7D7569]">No hay egresos que coincidan con la búsqueda.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ====== SUB TIER 5: CLIENT CRM (Cartelera de Clientes) ====== */}
            {activeSubTab === 'clients' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#2A2621] tracking-tight">Cartelera Consolidada de Clientes (CRM)</h2>
                    <p className="text-[10px] text-[#7D7569] mt-0.5">Consulte interacciones, gasto acumulado y active la fidelidad de sus clientes frecuentes.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por cliente o correo..."
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      className="w-full bg-stone-50 border border-[#EADCC9]/55 pl-9 pr-4 py-2.5 text-xs focus:outline-none placeholder:text-stone-400"
                    />
                  </div>

                  <div className="overflow-x-auto border border-[#EADCC9]/40">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F5] border-b border-[#EADCC9]/40 text-[#7D7569] uppercase tracking-[0.1em] font-bold text-[9px]">
                          <th className="py-3 px-4">Rostro de Cliente</th>
                          <th className="py-3 px-4">Última Compra</th>
                          <th className="py-3 px-4 text-center">Ordenes Completas</th>
                          <th className="py-3 px-4 text-right">Gasto Acumulado</th>
                          <th className="py-3 px-4">Tier / Fidelidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientsCRM.map((c, i) => (
                          <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-[#C5A880]/15 text-[#C5A880] rounded-full flex items-center justify-center font-bold font-mono text-[10px]">
                                  {c.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-stone-800 block">{c.name}</span>
                                  <span className="text-[10px] text-[#7D7569] block">{c.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-stone-500 font-mono text-[10px]">{new Date(c.lastDate).toLocaleDateString()}</td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-900">{c.ordersCount}</td>
                            <td className="py-3.5 px-4 text-right font-serif font-bold text-stone-900">{convertAndFormatPrice(c.spent, selectedCountryCode)}</td>
                            <td className="py-3.5 px-4">
                              {c.spent > 300 ? (
                                <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold uppercase rounded">VVIP GOLD MEMBER</span>
                              ) : (
                                <span className="inline-block px-2.5 py-0.5 bg-stone-100 text-stone-600 text-[8px] font-bold uppercase rounded">INNER CIRCLE MEMBER</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {clientsCRM.length === 0 && (
                          <tr><td colSpan={5} className="py-6 text-center text-[#7D7569]">No hay registros de clientes integrados. Las compras generadas en Checkout aparecerán automáticamente aquí.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ====== SUB TIER 6: CAMPAÑAS Y PROMOCIONES ====== */}
            {activeSubTab === 'promotions' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#2A2621] tracking-tight">Compositor de Campañas & Promociones</h2>
                    <p className="text-[10px] text-[#7D7569] mt-0.5">Agrupe sus fórmulas moleculares en sets de regalo o kits promocionales instantáneos.</p>
                  </div>
                  <button
                    onClick={() => setCreatingPromo(!creatingPromo)}
                    className="bg-[#2A2621] text-white hover:bg-[#C5A880] px-4 py-2 text-[10px] tracking-widest font-bold uppercase transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Diseñar Promo
                  </button>
                </div>

                {/* Create Promo bundle form */}
                {creatingPromo && (
                  <form onSubmit={handleCreatePromotion} className="p-4 border border-indigo-200 bg-indigo-50/15 space-y-4 text-xs">
                    <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-indigo-900 border-b pb-2">Nuevo Dueto o Set Especial</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Título de Set</label>
                        <input type="text" placeholder="The Gold Collection" value={newPromoTitle} onChange={e => setNewPromoTitle(e.target.value)} required className="w-full p-2 border" />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Subtítulo Comercial</label>
                        <input type="text" placeholder="Double Dose of Saffron Radiance" value={newPromoSubtitle} onChange={e => setNewPromoSubtitle(e.target.value)} className="w-full p-2 border" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-bold text-stone-700 block mb-1">Ventajas del Ritual Promocional</label>
                        <textarea placeholder="Composición molecular dirigida..." value={newPromoDesc} onChange={e => setNewPromoDesc(e.target.value)} className="w-full p-2 border h-16" />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Precio Compra ($)</label>
                        <input type="number" value={newPromoPrice} onChange={e => setNewPromoPrice(Number(e.target.value))} required className="w-full p-2 border" />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Valor Comercial Estimado ($)</label>
                        <input type="number" value={newPromoVal} onChange={e => setNewPromoVal(Number(e.target.value))} className="w-full p-2 border" />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Etiqueta de Cintilla</label>
                        <input type="text" value={newPromoTag} onChange={e => setNewPromoTag(e.target.value)} className="w-full p-2 border" />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Imagen URL del Set</label>
                        <input type="text" value={newPromoImage} onChange={e => setNewPromoImage(e.target.value)} className="w-full p-2 border" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[10px] uppercase font-bold tracking-widest text-stone-700 block">Fórmulas que Incluye (Detección Molecular Múltiple)</label>
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border p-2 bg-white rounded">
                        {products.map(p => {
                          const isAssoc = newPromoProdIds.includes(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleTogglePromoProductId(p.id)}
                              className={`p-2 border transition-all text-left flex items-center justify-between text-[11px] ${
                                isAssoc ? "bg-indigo-50 border-indigo-400 text-indigo-900" : "bg-stone-50/50 hover:bg-stone-100/50"
                              }`}
                            >
                              <span>{p.name}</span>
                              {isAssoc && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#2A2621] hover:bg-stone-800 text-white font-bold text-[10px] tracking-widest uppercase">
                      Lanzar Promo en Web
                    </button>
                  </form>
                )}

                {/* Render Banners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promotions.map(bundle => (
                    <div key={bundle.id} className="border border-[#EADCC9]/55 p-3 flex gap-4 bg-[#FAF8F5]/30">
                      <img src={bundle.image} className="w-20 h-24 object-cover border shrink-0" referrerPolicy="no-referrer" />
                      <div className="space-y-1 relative w-full text-left">
                        <button
                          onClick={() => handleDeletePromotion(bundle.id)}
                          className="absolute top-0 right-0 p-1 text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-[8px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase block w-max">{bundle.tag}</span>
                        <h4 className="font-serif font-bold text-stone-950 text-sm mt-1">{bundle.title}</h4>
                        <p className="text-[10px] text-[#C5A880] italic leading-tight">{bundle.subtitle}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-stone-800 font-bold">{convertAndFormatPrice(bundle.price, selectedCountryCode)}</span>
                          {bundle.valuePrice && (
                            <span className="text-[10px] text-stone-400 line-through">Valor {convertAndFormatPrice(bundle.valuePrice, selectedCountryCode)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ====== SUB TIER 7: SISTEMA DE CAJA CHICA COMPLETO ====== */}
            {activeSubTab === 'cashier' && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#EADCC9]/30 pb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#2A2621] tracking-tight">Sistema de Caja Chica Completo</h2>
                    <p className="text-[10px] text-[#7D7569] mt-0.5">Gestión integral de flujo de efectivo, auditoría y control financiero diario.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {cashSession?.isOpen ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 text-[10px] font-mono font-bold uppercase rounded border border-emerald-200">
                        ● Caja Abierta
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-800 bg-rose-50 px-3 py-1 text-[10px] font-mono font-bold uppercase rounded border border-rose-200">
                        ● Caja Cerrada
                      </span>
                    )}
                    {!cashSession?.isOpen && (
                      <button
                        onClick={() => setShowOpenCashForm(!showOpenCashForm)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap"
                      >
                        + Abrir Caja
                      </button>
                    )}
                    {cashSession?.isOpen && (
                      <button
                        onClick={() => setShowCloseCashForm(!showCloseCashForm)}
                        className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap"
                      >
                        Cerrar Caja
                      </button>
                    )}
                    {(showOpenCashForm || showCloseCashForm) && (
                      <button
                        onClick={() => setShowRegisterForm(!showRegisterForm)}
                        className="px-4 py-2 bg-[#C5A880] hover:bg-[#2A2621] text-white text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap"
                      >
                        Registrar
                      </button>
                    )}
                  </div>
                </div>

                {/* Formulario de registro manual */}
                {showRegisterForm && (
                  <div className="border-2 border-[#C5A880] bg-[#FAF8F5] p-4 sm:p-6">
                    <h4 className="font-serif text-base sm:text-lg text-[#2A2621] mb-4">Registrar Movimiento Manual</h4>
                    <p className="text-xs text-[#7D7569] mb-4">Registre ventas, transferencias o gastos manualmente en la caja chica.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-stone-700 block">Tipo de Movimiento</label>
                        <select
                          value={manualCashType}
                          onChange={e => setManualCashType(e.target.value as 'cash' | 'transfer' | 'expense')}
                          className="w-full text-xs p-3 bg-white border border-[#EADCC9] focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value="cash">Venta en Efectivo</option>
                          <option value="transfer">Transferencia</option>
                          <option value="expense">Gasto</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-stone-700 block">Monto (USD)</label>
                        <input
                          type="number"
                          value={manualCashAmount}
                          onChange={e => setManualCashAmount(Number(e.target.value))}
                          placeholder="0.00"
                          className="w-full text-xs p-3 bg-white border border-[#EADCC9] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-stone-700 block">Descripción</label>
                        <input
                          type="text"
                          value={manualCashDescription}
                          onChange={e => setManualCashDescription(e.target.value)}
                          placeholder="Detalles del movimiento..."
                          className="w-full text-xs p-3 bg-white border border-[#EADCC9] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleRegisterCash}
                        className="flex-1 py-3 bg-[#C5A880] hover:bg-[#2A2621] text-white text-[10px] uppercase font-bold tracking-widest transition-all"
                      >
                        Registrar Movimiento
                      </button>
                      <button
                        onClick={() => setShowRegisterForm(false)}
                        className="px-6 py-3 border border-stone-300 text-stone-700 text-[10px] uppercase font-bold tracking-widest hover:bg-stone-100 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Tabla de historial de caja chica */}
                <div className="border border-[#EADCC9] bg-white p-4 sm:p-6">
                  <h4 className="font-serif text-base sm:text-lg text-[#2A2621] mb-4">Historial de Caja Chica</h4>
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-stone-50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-bold text-stone-700">Fecha</th>
                          <th className="text-left p-3 font-bold text-stone-700">Tipo</th>
                          <th className="text-left p-3 font-bold text-stone-700">Descripción</th>
                          <th className="text-right p-3 font-bold text-stone-700">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cashHistory.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-stone-500">No hay movimientos registrados</td>
                          </tr>
                        ) : (
                          cashHistory.map((entry) => (
                            <tr key={entry.id} className="border-b border-stone-100 hover:bg-stone-50">
                              <td className="p-3 text-stone-600">{new Date(entry.date).toLocaleString()}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                                  entry.type === 'cash' ? 'bg-emerald-100 text-emerald-700' :
                                  entry.type === 'transfer' ? 'bg-blue-100 text-blue-700' :
                                  'bg-rose-100 text-rose-700'
                                }`}>
                                  {entry.type === 'cash' ? 'Efectivo' : entry.type === 'transfer' ? 'Transferencia' : 'Gasto'}
                                </span>
                              </td>
                              <td className="p-3 text-stone-800">{entry.description}</td>
                              <td className={`p-3 text-right font-mono font-bold ${
                                entry.amount > 0 ? 'text-emerald-700' : 'text-rose-700'
                              }`}>
                                {entry.amount > 0 ? '+' : ''}{convertAndFormatPrice(entry.amount, selectedCountryCode)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {!cashSession?.isOpen && showOpenCashForm ? (
                  /* Formulario de apertura de caja mejorado */
                  <div className="max-w-2xl mx-auto">
                    <div className="border-2 border-emerald-200 p-6 sm:p-8 bg-emerald-50/30 space-y-6">
                      <div className="text-center space-y-3">
                        <Unlock className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-700 mx-auto" />
                        <div>
                          <h3 className="font-serif text-lg sm:text-xl text-stone-900">Apertura de Caja Chica</h3>
                          <p className="text-xs text-[#7D7569] mt-1">Registre el saldo inicial para iniciar el control financiero de la jornada.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-emerald-800 block">Saldo Inicial (USD)</label>
                          <input 
                            type="number" 
                            defaultValue={150} 
                            id="start-balance-input"
                            className="w-full text-xs p-3 bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-emerald-800 block">Responsable de Caja</label>
                          <input 
                            type="text" 
                            defaultValue="Administrador"
                            id="cashier-name-input"
                            className="w-full text-xs p-3 bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                            placeholder="Nombre del responsable"
                          />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-emerald-800 block">Notas de Apertura</label>
                          <textarea 
                            id="opening-notes-input"
                            className="w-full text-xs p-3 bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500 h-20"
                            placeholder="Observaciones iniciales de la jornada..."
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            const el = document.getElementById('start-balance-input') as HTMLInputElement;
                            const nameEl = document.getElementById('cashier-name-input') as HTMLInputElement;
                            const notesEl = document.getElementById('opening-notes-input') as HTMLTextAreaElement;
                            handleOpenCashSession(el ? Number(el.value) : 150);
                            setShowOpenCashForm(false);
                          }}
                          className="flex-1 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] uppercase font-bold tracking-widest transition-all"
                        >
                          Confirmar Apertura
                        </button>
                        <button
                          onClick={() => setShowOpenCashForm(false)}
                          className="px-6 py-4 border border-emerald-300 text-emerald-700 text-[10px] uppercase font-bold tracking-widest hover:bg-emerald-100 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {cashSession?.isOpen && (
                  /* Panel de caja abierto mejorado */
                  <div className="space-y-6">
                    {/* Resumen financiero en tiempo real */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-4 space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold block">Saldo Inicial</span>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-900">{convertAndFormatPrice(cashSession.startingBalance, selectedCountryCode)}</span>
                        <span className="text-[9px] text-emerald-600 block">{new Date(cashSession.openedAt).toLocaleString()}</span>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-blue-700 font-bold block">Ventas Efectivo</span>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-blue-900">{convertAndFormatPrice(cashSession.salesCash, selectedCountryCode)}</span>
                        <span className="text-[9px] text-blue-600 block">Ingresos directos</span>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4 space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-purple-700 font-bold block">Transferencias</span>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-purple-900">{convertAndFormatPrice(cashSession.salesTransfer, selectedCountryCode)}</span>
                        <span className="text-[9px] text-purple-600 block">Pagos electrónicos</span>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-4 space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-amber-700 font-bold block">Saldo Esperado</span>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-amber-900">{convertAndFormatPrice(cashSession.startingBalance + cashSession.salesCash, selectedCountryCode)}</span>
                        <span className="text-[9px] text-amber-600 block">Total en caja</span>
                      </div>
                    </div>

                    {/* Registro de movimientos de caja */}
                    <div className="border border-[#EADCC9] bg-white p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <h4 className="font-serif text-base sm:text-lg text-[#2A2621]">Movimientos de Caja</h4>
                        <button 
                          onClick={() => setShowRegisterForm(!showRegisterForm)}
                          className="text-[10px] uppercase tracking-wider text-[#C5A880] font-bold hover:text-[#2A2621] whitespace-nowrap"
                        >
                          + Agregar Movimiento Manual
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {(cashSession.history || []).map((h, i) => (
                          <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-stone-50 border border-stone-100 hover:bg-stone-100 transition-colors gap-2">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                h.action.includes('Venta') ? 'bg-emerald-100 text-emerald-700' :
                                h.action.includes('Gasto') ? 'bg-rose-100 text-rose-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {h.action.includes('Venta') ? '💰' : h.action.includes('Gasto') ? '💸' : '📋'}
                              </div>
                              <div className="flex-grow">
                                <span className="font-bold text-stone-800 text-xs block">{h.action}</span>
                                <span className="text-[10px] text-stone-500">{new Date(h.date).toLocaleTimeString()}</span>
                              </div>
                            </div>
                            <span className={`font-mono font-bold text-sm ${
                              h.amount > 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}>
                              {h.amount > 0 ? '+' : ''}{convertAndFormatPrice(h.amount, selectedCountryCode)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resumen de sesión */}
                    <div className="bg-stone-100 border border-stone-200 p-4 sm:p-6">
                      <h4 className="font-serif text-base sm:text-lg text-[#2A2621] mb-4">Resumen de Sesión</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-stone-500 block">Hora Apertura:</span>
                          <span className="font-bold text-stone-800">{new Date(cashSession.openedAt).toLocaleTimeString()}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Duración:</span>
                          <span className="font-bold text-stone-800">
                            {Math.floor((Date.now() - new Date(cashSession.openedAt).getTime()) / 3600000)}h {Math.floor(((Date.now() - new Date(cashSession.openedAt).getTime()) % 3600000) / 60000)}m
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Total Ventas:</span>
                          <span className="font-bold text-emerald-700">{convertAndFormatPrice(cashSession.salesCash + cashSession.salesTransfer, selectedCountryCode)}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Movimientos:</span>
                          <span className="font-bold text-stone-800">{(cashSession.history || []).length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {cashSession?.isOpen && showCloseCashForm ? (
                  /* Formulario de cierre de caja mejorado */
                  <div className="border-2 border-rose-200 bg-rose-50/30 p-4 sm:p-6">
                    <h4 className="font-serif text-lg sm:text-xl text-rose-900 mb-4">Cierre de Caja Chica</h4>
                    <p className="text-xs text-rose-700 mb-6">Complete el arqueo de caja para finalizar la sesión financiera del día.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-rose-800 block">Efectivo Físico Contado (USD)</label>
                        <input
                          type="number"
                          value={closurePhysicalCash || ''}
                          onChange={e => setClosurePhysicalCash(Number(e.target.value))}
                          placeholder="0.00"
                          className="w-full text-xs p-3 bg-white border border-rose-300 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-rose-800 block">Diferencia Calculada</label>
                        <div className={`p-3 bg-white border border-rose-300 font-mono font-bold text-sm ${
                          (closurePhysicalCash - (cashSession.startingBalance + cashSession.salesCash)) >= 0 
                            ? 'text-emerald-700' 
                            : 'text-rose-700'
                        }`}>
                          {convertAndFormatPrice(closurePhysicalCash - (cashSession.startingBalance + cashSession.salesCash), selectedCountryCode)}
                        </div>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-rose-800 block">Observaciones del Cierre</label>
                        <textarea 
                          placeholder="Detalles sobre diferencias, incidentes, etc..."
                          className="w-full text-xs p-3 bg-white border border-rose-300 focus:outline-none focus:border-rose-500 h-20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => {
                          handleCloseCashSession();
                          setShowCloseCashForm(false);
                        }}
                        className="flex-1 py-4 bg-rose-700 hover:bg-rose-800 text-white text-[10px] uppercase font-bold tracking-widest transition-all"
                      >
                        Cerrar Caja y Generar Reporte
                      </button>
                      <button className="px-6 py-4 border border-rose-300 text-rose-700 text-[10px] uppercase font-bold tracking-widest hover:bg-rose-100 transition-all">
                        Imprimir Reporte
                      </button>
                      <button
                        onClick={() => setShowCloseCashForm(false)}
                        className="px-6 py-4 border border-stone-300 text-stone-700 text-[10px] uppercase font-bold tracking-widest hover:bg-stone-100 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}

              </div>
            )}

            {/* ====== SUB TIER 8: REDES SOCIALES CONFIG ====== */}
            {activeSubTab === 'socials' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#EADCC9]/30 pb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#2A2621] tracking-tight">Canales Sociales & Atención</h2>
                    <p className="text-[10px] text-[#7D7569] mt-0.5">Altere las direcciones de contacto sitewide de forma inmediata.</p>
                  </div>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-700 block">Número de WhatsApp (Sin signos, solo dígitos con lada)</label>
                    <input 
                      type="text" 
                      value={socials.whatsAppPhone} 
                      onChange={e => setSocials({ ...socials, whatsAppPhone: e.target.value })}
                      placeholder="18294855693"
                      className="w-full text-xs p-2.5 bg-white border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-700 block">Mensaje predeterminado de consulta</label>
                    <input 
                      type="text" 
                      value={socials.whatsAppText} 
                      onChange={e => setSocials({ ...socials, whatsAppText: e.target.value })}
                      placeholder="Hola, me gustaría agendar consulta molecular..."
                      className="w-full text-xs p-2.5 bg-white border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-700 block">Enlace de Perfil Instagram</label>
                    <input 
                      type="text" 
                      value={socials.instagramUrl} 
                      onChange={e => setSocials({ ...socials, instagramUrl: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-700 block">Enlace de Perfil Facebook</label>
                    <input 
                      type="text" 
                      value={socials.facebookUrl} 
                      onChange={e => setSocials({ ...socials, facebookUrl: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border"
                    />
                  </div>

                  <button 
                    onClick={async () => {
                      try {
                        await socialsApi.update(socials);
                        showFeedback('Ajustes de Redes Sociales actualizados de forma sitewide');
                      } catch (error) {
                        console.error('Error updating social config:', error);
                        showFeedback('Error al guardar configuración social en Supabase', true);
                      }
                    }}
                    className="w-full py-3 bg-[#2A2621] hover:bg-stone-800 text-white font-bold text-[10px] tracking-widest uppercase transition-colors"
                  >
                    Guardar Cambios de Configuración
                  </button>
                </div>

                <div className="bg-[#FAF8F5] p-4 text-xs font-serif text-[#7D7569] flex gap-2 border">
                  <Info className="w-5 h-5 text-[#C5A880] shrink-0" />
                  <p className="leading-relaxed">Los enlaces guardados arriba controlarán el redireccionamiento inmediato de los tres iconos del pie superior de contacto, los formularios y el botón de WhatsApp flotante.</p>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
