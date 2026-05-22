import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Product, PromotionBundle } from '../types';

interface PromotionsViewProps {
  onAddBundleToCart: (products: Product[], customName: string, customPrice: number) => void;
  onExploreCollection: () => void;
  promotionBundles: PromotionBundle[];
  products: Product[];
}

export default function PromotionsView({ 
  onAddBundleToCart, 
  onExploreCollection,
  promotionBundles,
  products
}: PromotionsViewProps) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  // Bundle click buy handler
  const handleCheckoutBundle = (productIds: string[], customName: string, bundlePrice: number) => {
    // Collect the exact core products from molecular database
    const selectedProducts = products.filter(p => productIds.includes(p.id));
    onAddBundleToCart(selectedProducts, customName, bundlePrice);
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setJoined(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Hero Section */}
      <section className="w-full relative min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden mb-24">
        <div className="absolute inset-0 z-0 bg-[#EFE7DC] opacity-30 mix-blend-multiply"></div>
        <img
          alt="Luxury skincare setup"
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoeFhJm7pyjoB9FRxyTMcnsP1QyKjXfbJcYYMqjCiJJ0Ac81Mr8x9yJBNfveVvylrQYvRZaHgkDdVTSIbXP1ILPyqs0Q1sAaA4FeHZAJv4N80zpQkcS_iS9pm7vm5snjvDFCVvb3_QNOJ7F0QfSu_I1PEylC8r4dGa61rPXkdCvO8IJ0a11zDV6GTyBr2RrgrJlNw0mZT007BwAXhjX1StoWdVt78Fv4pZnpD2fJ9U9fcWLSkcCEa_0ZyLhHv6kdPtuVKYbquWhKnF"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent z-0"></div>
        
        <div className="relative z-10 text-center max-w-2xl px-6 mt-16 sm:mt-24 space-y-6">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-bold">
            Ofertas Exclusivas
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-primary leading-tight">
            Elevaciones de Temporada
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-md mx-auto leading-relaxed font-sans font-light">
            Descubra sets curados y rituales exclusivos de edición limitada diseñados para transformar su piel a nivel celular.
          </p>
          <button
            onClick={onExploreCollection}
            className="bg-primary-container text-on-primary-container px-8 py-4 font-semibold text-[10px] tracking-widest uppercase hover:bg-primary hover:text-white transition-colors duration-300 border border-transparent shadow-sm cursor-pointer"
          >
            Explorar Colecciones
          </button>
        </div>
      </section>

      {/* Bento Grid - Promos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-primary font-light">Sets & Rituales Deluxes</h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 font-sans font-light">
                Combinaciones moleculares sinérgicas con un valor preferencial exclusivo.
              </p>
            </div>
          </div>

          {/* Adaptive bento-grid wrapping the dynamic list */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {promotionBundles.map((bundle, index) => {
              // Alternate grid sizes for a dynamic editorial layout
              const isLarge = index === 0 || (index > 0 && index % 4 === 0);
              const gridSpan = isLarge ? 'md:col-span-8' : 'md:col-span-4';

              return (
                <div 
                  key={bundle.id} 
                  className={`${gridSpan} relative group overflow-hidden bg-[#EFE7DC] flex flex-col justify-end p-8 min-h-[420px] border border-outline-variant/20 shadow-xs`}
                >
                  <img
                    alt={bundle.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103 z-0 opacity-85"
                    src={bundle.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent z-10"></div>
                  
                  <div className="relative z-20 text-left w-full mt-auto">
                    {bundle.tag && (
                      <span className="inline-block bg-primary/10 text-primary px-3 py-1 font-semibold text-[9px] uppercase tracking-widest rounded-full mb-3">
                        {bundle.tag}
                      </span>
                    )}
                    <h3 className={`font-serif text-primary leading-tight mb-2 ${isLarge ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                      {bundle.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-6 leading-relaxed font-sans font-light max-w-md">
                      {bundle.description}
                    </p>
                    
                    <div className="flex justify-between items-center bg-white/75 backdrop-blur-xs p-3.5 rounded-none border border-outline-variant/20">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl text-primary font-bold">${bundle.price} USD</span>
                        {bundle.valuePrice && (
                          <span className="text-[10px] text-outline line-through">${bundle.valuePrice} USD</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleCheckoutBundle(bundle.productIds, bundle.title, bundle.price)}
                        className="py-2 px-4 bg-primary text-white text-[9px] font-bold tracking-widest uppercase hover:bg-on-surface transition-colors cursor-pointer"
                      >
                        Adquirir Set
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Inner Circle Signup Block */}
            <div className="md:col-span-8 relative group overflow-hidden bg-[#FAF8F5] flex flex-col justify-center items-center text-center p-10 border border-outline-variant/30 shadow-2xs">
              <span className="text-primary text-3xl mb-4 text-center">✨</span>
              <h3 className="font-serif text-2xl text-primary mb-3 font-light">Aesthetica Inner Circle</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed font-sans font-light">
                Únase a nuestro círculo de membresía para recibir envíos premium sin cargo, accesos anticipados y beneficios exclusivos del atelier.
              </p>

              <div className="w-full max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  {!joined ? (
                    <motion.form
                      key="subscribe"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubscribe}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu dirección de correo"
                        className="flex-1 px-4 py-3 text-xs bg-white border border-outline-variant text-[#2A2621] focus:outline-none focus:border-primary focus:ring-0 transition-colors rounded-none"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-on-surface transition-all duration-300 cursor-pointer text-center"
                      >
                        {loading ? 'Validando...' : 'Unirse al Círculo'}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="registered"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50/50 p-5 rounded border border-emerald-300 space-y-2 text-center"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="text-xs text-[#2A2621] font-semibold">¡Suscripción Capturada con éxito!</p>
                      <p className="text-[11px] text-[#7D7569]">Revisa tu buzón para redimir un 15% de cortesía en tu primera compra molecular.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </section>
      </div>

    </div>
  );
}
