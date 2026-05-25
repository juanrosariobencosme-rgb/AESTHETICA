import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { convertAndFormatPrice } from '../utils/currency';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  selectedCountryCode?: string;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  selectedCountryCode = 'DO'
}: CartSidebarProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">

      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pointer-events-none">

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="w-screen max-w-[420px] pointer-events-auto"
        >
          <div className="h-full flex flex-col bg-[#1C1917] shadow-2xl overflow-hidden">

            {/* Decorative top gradient bar */}
            <div className="h-[3px] w-full bg-gradient-to-r from-[#C5A880] via-[#E8CFA0] to-[#C5A880]" />

            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C5A880]/15 flex items-center justify-center border border-[#C5A880]/30">
                  <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                </div>
                <div>
                  <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-white font-semibold">
                    Tu Bolso Sensorial
                  </h2>
                  {itemCount > 0 && (
                    <p className="text-[10px] text-[#C5A880] tracking-wider mt-0.5">
                      {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} seleccionados
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-all focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {subtotal > 0 && (
              <div className="px-6 py-4 border-b border-white/8 space-y-2.5">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        ¡Envío premium sin costo!
                      </span>
                    ) : (
                      <span className="text-white/50">
                        Faltan <span className="text-[#C5A880] font-bold">{convertAndFormatPrice(freeShippingThreshold - subtotal, selectedCountryCode)}</span> para envío gratis
                      </span>
                    )}
                  </p>
                </div>
                <div className="w-full bg-white/10 h-[3px] overflow-hidden rounded-full">
                  <motion.div
                    className="bg-gradient-to-r from-[#C5A880] to-[#E8CFA0] h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToFreeShipping}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-grow overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col justify-center items-center text-center space-y-5 py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-white/20 stroke-[1.5]" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-lg text-white/60 italic">Su bolso está deshabitado</p>
                    <p className="text-[11px] text-white/30 leading-relaxed max-w-[200px]">Descubra nuestros elixires de lujo y comience su ritual</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="py-2.5 px-7 border border-[#C5A880]/40 text-[#C5A880] text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A880]/10 transition-colors"
                  >
                    Explorar Colección
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4 items-start pb-4 border-b border-white/8 last:border-0 text-left group"
                    >
                      {/* Product Image */}
                      <div className="relative shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-[68px] h-[84px] object-cover border border-white/10 bg-[#2A2621]"
                        />
                        <div className="absolute inset-0 border border-[#C5A880]/0 group-hover:border-[#C5A880]/30 transition-colors" />
                      </div>

                      {/* Details */}
                      <div className="flex-grow space-y-2 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm text-white leading-tight truncate">{item.product.name}</h4>
                            <p className="text-[9px] text-[#C5A880] uppercase tracking-widest mt-0.5 truncate">{item.product.subtitle}</p>
                          </div>
                          <span className="font-mono text-sm font-bold text-white shrink-0">
                            {convertAndFormatPrice(item.product.price * item.quantity, selectedCountryCode)}
                          </span>
                        </div>

                        <p className="text-[10px] text-white/30 leading-tight line-clamp-1">{item.product.texture}</p>

                        {/* Qty + Delete */}
                        <div className="flex justify-between items-center pt-1">
                          <div className="flex items-center border border-white/15 bg-white/5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-mono font-bold text-white min-w-[28px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-white/20 hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-500/10 rounded"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Bottom Panel */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4 bg-[#161412]">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Subtotal</span>
                    <span className="text-sm font-mono text-white/70">{convertAndFormatPrice(subtotal, selectedCountryCode)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-white/8 pt-2">
                    <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">Total Estimado</span>
                    <span className="font-serif text-xl font-semibold text-white">{convertAndFormatPrice(subtotal, selectedCountryCode)}</span>
                  </div>
                </div>

                <p className="text-[9px] text-white/25 italic leading-snug">
                  *Impuestos y envío calculados al completar el checkout.
                </p>

                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={onCheckout}
                    className="w-full py-4 bg-gradient-to-r from-[#C5A880] to-[#A88B60] hover:from-[#D4B990] hover:to-[#C5A880] text-[#1C1917] text-[11px] uppercase tracking-[0.2em] font-bold transition-all cursor-pointer flex justify-center items-center gap-2.5 shadow-lg shadow-[#C5A880]/20 group"
                  >
                    Proceder al Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-center text-white/30 hover:text-white/60 text-[10px] uppercase tracking-widest font-medium transition-all"
                  >
                    Continuar Explorando
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
