import { motion, AnimatePresence } from 'motion/react';
import { Gift, Tag, Layers3, Sparkles, ArrowRight, Star, Percent } from 'lucide-react';
import { Product, PromotionBundle, Combo } from '../types';
import { convertAndFormatPrice } from '../utils/currency';

interface OffersViewProps {
  selectedCountryCode?: string;
  products: Product[];
  promotionBundles: PromotionBundle[];
  combos: Combo[];
  onAddToCart: (product: Product) => void;
  onAddBundleToCart: (products: Product[], customName: string, customPrice: number) => void;
  onViewProductDetails: (product: Product) => void;
  enableAnimations?: boolean;
}

export default function OffersView({
  selectedCountryCode = 'DO',
  products,
  promotionBundles,
  combos,
  onAddToCart,
  onAddBundleToCart,
  onViewProductDetails,
  enableAnimations = false
}: OffersViewProps) {
  const offerProducts = products.filter(
    (p) => Boolean(p.isOffer) || Boolean(p.salePrice) || Boolean(p.promotionTag)
  );

  const handleCheckoutBundle = (productIds: string[], customName: string, bundlePrice: number) => {
    const selectedProducts = products.filter((p) => productIds.includes(p.id));
    onAddBundleToCart(selectedProducts, customName, bundlePrice);
  };

  const hasContent = offerProducts.length > 0 || promotionBundles.length > 0 || combos.length > 0;

  return (
    <div className="bg-[#0F0D0B] min-h-screen text-white relative overflow-hidden">

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#C5A880]/6 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#C5A880]/4 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#C5A880]/3 blur-[80px]" />
      </div>

      {/* Hero banner */}
      <section className="relative border-b border-white/8 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={enableAnimations ? { opacity: 0, y: 20 } : undefined}
            animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
            transition={enableAnimations ? { duration: 0.6 } : undefined}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A880] font-bold">Rituales de Temporada</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-white leading-[1.1] tracking-wide">
              Elevaciones<br />
              <span className="text-[#C5A880] italic">Exclusivas</span>
            </h1>
            <p className="text-sm text-white/40 max-w-xl mx-auto leading-relaxed">
              Un espacio curado para ofertas excepcionales, rituales en sets y combos de edición limitada — a precios que honran tu ritual.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={enableAnimations ? { opacity: 0 } : undefined}
            animate={enableAnimations ? { opacity: 1 } : undefined}
            transition={enableAnimations ? { duration: 0.6, delay: 0.2 } : undefined}
            className="flex justify-center gap-8 pt-4"
          >
            {[
              { label: 'Ofertas Activas', value: offerProducts.length },
              { label: 'Promociones', value: promotionBundles.length },
              { label: 'Combos', value: combos.length },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-serif font-light text-[#C5A880]">{stat.value}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/30 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 relative">

        {/* ─────────────────────────────── */}
        {/* 1) OFERTAS DEL INVENTARIO       */}
        {/* ─────────────────────────────── */}
        {offerProducts.length > 0 && (
          <section className="space-y-8">
            {/* Section header */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
                  <Tag className="w-4.5 h-4.5 text-[#C5A880]" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white tracking-wide">Elixires en Oferta</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Precios especiales del inventario</p>
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#C5A880]/30 to-transparent" />
              <span className="text-[10px] text-[#C5A880] font-mono font-bold bg-[#C5A880]/10 border border-[#C5A880]/20 px-3 py-1 rounded-full">
                {offerProducts.length} disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {offerProducts.map((product, index) => {
                const discount = product.salePrice
                  ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                  : null;

                return (
                  <motion.article
                    key={product.id}
                    initial={enableAnimations ? { opacity: 0, y: 24 } : undefined}
                    animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
                    transition={enableAnimations ? { duration: 0.4, delay: index * 0.06 } : undefined}
                    className="group relative bg-[#161412] border border-white/8 hover:border-[#C5A880]/40 transition-all duration-500 overflow-hidden flex flex-col"
                  >
                    <div className="relative h-60 overflow-hidden bg-[#1A1714]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-transparent" />
                      {discount && (
                        <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#C5A880] flex flex-col items-center justify-center shadow-lg shadow-[#C5A880]/30">
                          <span className="text-[10px] font-black text-[#1C1917] leading-none">-{discount}%</span>
                        </div>
                      )}
                      {product.promotionTag && (
                        <span className="absolute top-3 left-3 bg-[#1C1917]/90 backdrop-blur-sm border border-[#C5A880]/40 text-[#C5A880] text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold">
                          {product.promotionTag}
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-3 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <button
                          type="button"
                          onClick={() => onViewProductDetails(product)}
                          className="text-left w-full space-y-0.5 group/btn"
                        >
                          <h3 className="text-base font-serif text-white group-hover/btn:text-[#C5A880] transition-colors leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-[10px] text-white/40 line-clamp-1 leading-relaxed">{product.subtitle}</p>
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 pt-1">
                        {product.salePrice ? (
                          <>
                            <span className="text-lg font-serif font-semibold text-[#C5A880]">
                              {convertAndFormatPrice(product.salePrice, selectedCountryCode)}
                            </span>
                            <span className="text-xs line-through text-white/25">
                              {convertAndFormatPrice(product.price, selectedCountryCode)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-serif font-semibold text-white">
                            {convertAndFormatPrice(product.price, selectedCountryCode)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="w-full py-2.5 border border-[#C5A880]/30 bg-transparent text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1C1917] text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Comprar
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        )}

        {/* ─────────────────────────────── */}
        {/* 2) PROMOCIONES (BUNDLES)        */}
        {/* ─────────────────────────────── */}
        {promotionBundles.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-[#C5A880]" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white tracking-wide">Rituales en Set</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Colecciones curadas a precio especial</p>
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#C5A880]/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotionBundles.map((bundle, index) => {
                const savings = bundle.valuePrice ? bundle.valuePrice - bundle.price : null;
                return (
                  <motion.article
                    key={bundle.id}
                    initial={enableAnimations ? { opacity: 0, y: 30 } : undefined}
                    animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
                    transition={enableAnimations ? { duration: 0.5, delay: index * 0.08 } : undefined}
                    className="group relative bg-[#161412] border border-white/8 hover:border-[#C5A880]/40 overflow-hidden transition-all duration-500 flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-[#1A1714]">
                      <img
                        src={bundle.image}
                        alt={bundle.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=1000';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B] via-[#0F0D0B]/20 to-transparent" />
                      {bundle.tag && (
                        <span className="absolute top-4 left-4 bg-[#C5A880] text-[#1C1917] text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 font-black shadow-lg">
                          {bundle.tag}
                        </span>
                      )}
                      {savings && (
                        <div className="absolute bottom-4 right-4 bg-[#1C1917]/90 border border-[#C5A880]/30 backdrop-blur-sm px-3 py-1.5 text-center">
                          <span className="block text-[9px] text-white/40 uppercase tracking-widest">Ahorro</span>
                          <span className="block text-sm font-bold text-[#C5A880]">{convertAndFormatPrice(savings, selectedCountryCode)}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-4 flex-grow flex flex-col">
                      <div className="flex-grow space-y-1.5">
                        <h3 className="font-serif text-lg text-white group-hover:text-[#C5A880] transition-colors">
                          {bundle.title}
                        </h3>
                        {bundle.subtitle && (
                          <p className="text-[10px] text-[#C5A880]/60 uppercase tracking-widest italic">{bundle.subtitle}</p>
                        )}
                        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mt-2">{bundle.description}</p>
                      </div>

                      <div className="flex items-baseline gap-3 pt-1 border-t border-white/8">
                        <span className="font-serif text-2xl font-light text-white">
                          {convertAndFormatPrice(bundle.price, selectedCountryCode)}
                        </span>
                        {bundle.valuePrice && (
                          <span className="text-sm line-through text-white/25">
                            {convertAndFormatPrice(bundle.valuePrice, selectedCountryCode)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCheckoutBundle(bundle.productIds, bundle.title, bundle.price)}
                        className="w-full py-3 bg-gradient-to-r from-[#C5A880] to-[#A88B60] text-[#1C1917] text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 hover:shadow-lg hover:shadow-[#C5A880]/20 hover:from-[#D4B990] hover:to-[#C5A880] flex items-center justify-center gap-2"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Comprar
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        )}

        {/* ─────────────────────────────── */}
        {/* 3) COMBOS                       */}
        {/* ─────────────────────────────── */}
        {combos.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
                  <Layers3 className="w-4.5 h-4.5 text-[#C5A880]" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white tracking-wide">Combos Moleculares</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Sets sinérgicos de máxima eficiencia</p>
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#C5A880]/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.map((combo, index) => {
                const savings = combo.valuePrice ? combo.valuePrice - combo.price : null;
                return (
                  <motion.article
                    key={combo.id}
                    initial={enableAnimations ? { opacity: 0, y: 30 } : undefined}
                    animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
                    transition={enableAnimations ? { duration: 0.5, delay: index * 0.08 } : undefined}
                    className="group relative bg-[#161412] border border-white/8 hover:border-[#C5A880]/40 overflow-hidden transition-all duration-500 flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-[#1A1714]">
                      <img
                        src={combo.image}
                        alt={combo.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B] via-[#0F0D0B]/20 to-transparent" />
                      {combo.tag && (
                        <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold">
                          {combo.tag}
                        </span>
                      )}
                      {savings && (
                        <div className="absolute bottom-4 right-4 bg-[#C5A880]/20 border border-[#C5A880]/40 backdrop-blur-sm px-3 py-1.5 text-center">
                          <span className="block text-[9px] text-[#C5A880]/60 uppercase tracking-widest">Economiza</span>
                          <span className="block text-sm font-bold text-[#C5A880]">{convertAndFormatPrice(savings, selectedCountryCode)}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-4 flex-grow flex flex-col">
                      <div className="flex-grow space-y-1.5">
                        <h3 className="font-serif text-lg text-white group-hover:text-[#C5A880] transition-colors">{combo.title}</h3>
                        {combo.subtitle && (
                          <p className="text-[10px] text-[#C5A880]/60 uppercase tracking-widest italic">{combo.subtitle}</p>
                        )}
                        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mt-2">{combo.description}</p>
                      </div>

                      <div className="flex items-baseline gap-3 pt-1 border-t border-white/8">
                        <span className="font-serif text-2xl font-light text-white">
                          {convertAndFormatPrice(combo.price, selectedCountryCode)}
                        </span>
                        {combo.valuePrice && (
                          <span className="text-sm line-through text-white/25">
                            {convertAndFormatPrice(combo.valuePrice, selectedCountryCode)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCheckoutBundle(combo.productIds, combo.title, combo.price)}
                        className="w-full py-3 bg-white/8 border border-white/15 text-white hover:bg-[#C5A880] hover:border-[#C5A880] hover:text-[#1C1917] text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Layers3 className="w-3.5 h-3.5" />
                        Comprar
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!hasContent && (
          <div className="text-center py-24 space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white/20" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-white/40">Pronto habrá Elevaciones</h2>
              <p className="text-sm text-white/25 max-w-sm mx-auto">
                Estamos preparando ofertas exclusivas y rituales especiales. Vuelve pronto.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom decorative border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent" />
    </div>
  );
}
