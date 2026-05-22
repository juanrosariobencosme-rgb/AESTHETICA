import { motion } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
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
  selectedCountryCode = 'MX'
}: CartSidebarProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        
        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 40 }}
          className="w-screen max-w-md pointer-events-auto"
        >
          <div className="h-full flex flex-col bg-[#FAF8F5] shadow-2xl border-l border-[#EADCC9]/50 overflow-y-hidden">
            
            {/* Header */}
            <div className="p-6 bg-[#FAF8F5] border-b border-[#EADCC9]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
                <h2 className="text-sm font-sans uppercase tracking-[0.25em] text-[#2A2621] font-bold">
                  Tu Bolso Sensorial
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-2 border hover:bg-neutral-50 border-stone-200 text-[#2A2621] hover:text-[#C5A880] transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {subtotal > 0 && (
              <div className="px-6 py-4 bg-stone-50 border-b border-[#EADCC9]/30 text-left space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-[#7D7569]">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-600 font-bold">¡Su entrega asegurada premium no tiene costo!</span>
                  ) : (
                    <span>Le faltan <strong className="text-stone-900">{convertAndFormatPrice(freeShippingThreshold - subtotal, selectedCountryCode)}</strong> para envío sin costo.</span>
                  )}
                </p>
                <div className="w-full bg-stone-200 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-[#C5A880] h-full transition-all duration-305"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items List container */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                  <ShoppingBag className="w-10 h-10 text-[#C5A880] stroke-[1.5]" />
                  <p className="font-serif text-base text-[#7D7569] italic">Su bolso se encuentra deshabitado</p>
                  <button
                    onClick={onClose}
                    className="py-2.5 px-6 border border-[#2A2621] text-[#2A2621] text-[10px] uppercase tracking-widest font-bold hover:bg-[#2A2621] hover:text-white transition-colors"
                  >
                    Seguir Explorando
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 items-start pb-6 border-b border-[#EADCC9]/35 last:border-0 text-left"
                    >
                      {/* Item Image */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover border border-[#EADCC9] bg-stone-50 shrink-0"
                      />

                      {/* Detail Column */}
                      <div className="flex-grow space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-serif text-base text-[#1C1917] font-semibold">{item.product.name}</h4>
                            <p className="text-[9.5px] text-[#C5A880] uppercase tracking-widest leading-none mt-0.5">{item.product.subtitle}</p>
                          </div>
                          <span className="font-mono text-xs font-bold text-stone-950">{convertAndFormatPrice(item.product.price * item.quantity, selectedCountryCode)}</span>
                        </div>

                        <p className="text-[10px] text-[#7D7569] leading-tight line-clamp-1">{item.product.texture}</p>

                        {/* Adjust qty & Delete block */}
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex bg-[#F2ECE4] p-0.5 items-center">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="p-1 text-stone-700 hover:text-stone-900 focus:outline-none"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-mono font-bold text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="p-1 text-stone-700 hover:text-stone-900 focus:outline-none"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-[#7D7569] hover:text-red-500 transition-colors p-1"
                            title="Eliminar del bolso"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom aggregate panel if subtotal is available */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#FAF8F5] border-t border-[#EADCC9]/50 space-y-4 text-left">
                <div className="flex justify-between items-baseline font-sans">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#7D7569]">Total Estimado</span>
                  <span className="font-serif text-xl font-bold text-[#2A2621] font-semibold">{convertAndFormatPrice(subtotal, selectedCountryCode)}</span>
                </div>
                
                <p className="text-[10px] text-[#7D7569] italic leading-tight">
                  *Impuestos, aranceles aduanales y coberturas de envío premium calculados de forma segura en el siguiente panel de checkout.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={onCheckout}
                    className="w-full py-4 bg-[#2A2621] hover:bg-[#C5A880] text-white text-xs uppercase tracking-[0.25em] font-medium transition-all cursor-pointer flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    Proceder al Checkout
                    <ArrowRight className="w-4 h-4 animate-pulse text-[#C5A880]" />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-center text-stone-700 hover:text-stone-950 font-bold text-[10px] uppercase tracking-widest font-sans transition-all"
                  >
                    Continuar Comprando
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
