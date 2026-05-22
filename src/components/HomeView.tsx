import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Leaf, Star, ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { PRODUCTS, EDITORIALS, TESTIMONIALS } from '../data';
import { Product, PromotionBundle } from '../types';
import { convertAndFormatPrice } from '../utils/currency';

interface HomeViewProps {
  onExploreCollection: () => void;
  onViewProductDetails: (product: Product) => void;
  selectedCountryCode?: string;
  products?: Product[];
  promotionBundles?: PromotionBundle[];
  onAddBundleToCart?: (products: Product[], customName: string, customPrice: number) => void;
}

export default function HomeView({ 
  onExploreCollection, 
  onViewProductDetails,
  selectedCountryCode = 'MX',
  products = PRODUCTS,
  promotionBundles = [],
  onAddBundleToCart
}: HomeViewProps) {
  // Highlight three products on home screen
  const featuredProducts = products.slice(0, 3);

  // Carousel Items definition
  const CAROUSEL_ITEMS = [
    {
      product: products[0] || PRODUCTS[0], // Lumière Dorée
      quote: "Tratamiento concentrado con péptidos y partículas finas de oro 24K para un brillo de seda.",
      badge: "Elixir Destacado",
      image: (products[0] || PRODUCTS[0]).image
    },
    {
      product: products[1] || PRODUCTS[1], // Aura Essentials
      quote: "Bálsamo cremoso a base de absoluto de jazmín que purifica y fortalece la barrera cutánea.",
      badge: "Pureza Sensorial",
      image: (products[1] || PRODUCTS[1]).image
    },
    {
      product: products[2] || PRODUCTS[2], // Hydro-Plump Nectar
      quote: "Néctar hidratante con ácido hialurónico molecular y agua pura de glaciar suizo.",
      badge: "Bote de Humedad",
      image: (products[2] || PRODUCTS[2]).image
    },
    {
      product: products[3] || PRODUCTS[3], // Aurum Velvet
      quote: "Crema exquisita con escualano vegetal y hojuelas de oro para esculpir profundamente.",
      badge: "Lifting Esculpido",
      image: (products[3] || PRODUCTS[3]).image
    }
  ];

  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [CAROUSEL_ITEMS.length]);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const activeCarousel = CAROUSEL_ITEMS[carouselIndex];

  return (
    <div className="bg-[#FAF8F5] text-[#2A2621]">
      
      {/* 1. Hero Section - Quiet Luxury Overlapping Layout */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden py-12 md:py-20 lg:py-24 border-b border-[#EADCC9]/20">
        <div className="absolute inset-0 bg-radial-[circle_at_70%_50%] from-[#F2ECE4] via-[#FAF8F5] to-[#FAF8F5] opacity-65 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Display Typography & Poetic Hooks */}
            <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-3"
              >
                <span className="text-[11px] uppercase tracking-[0.35em] text-[#C5A880] font-sans font-semibold inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" /> Re-definiendo la Pureza
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.12] text-[#1C1917] tracking-wide">
                  Tu piel es un <br />
                  <span className="font-serif italic text-[#C5A880]">Lienzo Elemental</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg text-[#7D7569] leading-relaxed max-w-xl font-sans"
              >
                Bienvenido al atelier de Aesthetica. Recetas moleculares fusionadas con elixires botánicos de oro y azafrán, diseñadas para sanar, iluminar y esculpir la arquitectura de su rostro.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <button
                  onClick={onExploreCollection}
                  className="px-8 py-4 bg-[#2A2621] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C5A880] transition-colors duration-500 shadow-md flex items-center justify-center gap-2 group border border-transparent"
                >
                  Explorar Colección
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>

              {/* Minimal Trust Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-4 border-t border-[#EADCC9]/50 pt-8 mt-12"
              >
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span className="text-[10px] uppercase tracking-wider text-[#7D7569]">Fórmulas Clínicas</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span className="text-[10px] uppercase tracking-wider text-[#7D7569]">Libre de Crueldad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span className="text-[10px] uppercase tracking-wider text-[#7D7569]">Hecho a Mano</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Luxury Product Carousel with Floating Card */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-t-full overflow-hidden border border-[#EADCC9]/40 shadow-xl">
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={carouselIndex}
                    src={activeCarousel.image}
                    alt={activeCarousel.product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {/* Floating Detail Tag Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Minimalist Carousel Buttons Overlaid inside the image */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-20">
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full border border-white/60 bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full border border-white/60 bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer"
                    title="Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Little Page Indicator Dots */}
                <div className="absolute top-4 right-6 flex space-x-1.5 z-20">
                  {CAROUSEL_ITEMS.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCarouselIndex(dotIdx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        dotIdx === carouselIndex ? 'bg-[#C5A880] w-3' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Alabaster Card with Animated Transition details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-4 -left-4 sm:left-4 bg-[#FAF8F5]/95 backdrop-blur-md p-6 max-w-[260px] border border-[#EADCC9] shadow-lg text-left z-10"
                >
                  <p className="font-serif italic text-sm text-[#C5A880]">{activeCarousel.badge}</p>
                  <h3 className="font-serif tracking-widest text-[#2A2621] uppercase text-base mt-1">{activeCarousel.product.name}</h3>
                  <p className="text-xs text-[#7D7569] mt-2 leading-relaxed h-[60px] overflow-hidden">
                    {activeCarousel.quote}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#1C1917]">
                      {convertAndFormatPrice(activeCarousel.product.price, selectedCountryCode)}
                    </span>
                    <button
                      onClick={() => onViewProductDetails(activeCarousel.product)}
                      className="text-[10px] uppercase tracking-widest text-[#2A2621] font-bold border-b border-[#C5A880] hover:text-[#C5A880] transition-colors cursor-pointer"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Editorial Our Philosophy / Concept */}
      <section className="py-20 md:py-28 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {EDITORIALS.map((edit, idx) => (
            <div
              key={edit.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center ${
                idx > 0 ? 'mt-24 md:mt-36' : ''
              }`}
            >
              {/* Image Column */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
                <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 40 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="aspect-square bg-[#EADCC9]/20 relative border border-[#EADCC9]/40 overflow-hidden shadow-md"
                >
                  <img
                    src={edit.image}
                    alt={edit.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-7 space-y-6">
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 30 : -30 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="space-y-4"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
                    {edit.subtitle}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#2A2621]">
                    {edit.title}
                  </h2>
                  <div className="h-[1.5px] w-16 bg-[#C5A880]" />
                  <p className="text-[#7D7569] leading-relaxed text-sm sm:text-base font-sans font-light">
                    {edit.paragraph}
                  </p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Product Spotlight Catalog */}
      <section className="py-20 bg-[#F2ECE4]/40 border-y border-[#EADCC9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold">
              Nuestra Selección Privada
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1917]">
              Fórmulas Destacadas
            </h2>
            <p className="text-xs sm:text-sm text-[#7D7569]">
              Nuestras emulsiones más deseadas de la temporada, infundidas con biocosmética molecular avanzada y oro alquímico.
            </p>
          </div>

          {/* Catalog Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {featuredProducts.map((p, index) => (
              <motion.div
                key={p.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group flex flex-col justify-between bg-[#FAF8F5] border border-[#EADCC9]/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Product Image Panel */}
                <div className="relative aspect-4/5 overflow-hidden bg-stone-100 border-b border-[#EADCC9]/40">
                  <span className="absolute top-4 left-4 z-10 bg-[#FAF8F5]/90 backdrop-blur-xs text-[9px] uppercase tracking-[0.25em] text-[#C5A880] px-3 py-1 font-semibold">
                    {p.size}
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Quick-View Shield overlay */}
                  <div className="absolute inset-0 bg-[#2A2621]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => onViewProductDetails(p)}
                      className="px-6 py-3 bg-[#FAF8F5] text-stone-900 text-[10px] uppercase tracking-[0.2em] font-medium transition-all transform translate-y-2 group-hover:translate-y-0"
                    >
                      Ver Elixir
                    </button>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-6 space-y-3 bg-[#FAF8F5]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#C5A880] transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-[#C5A880] uppercase tracking-wider italic">
                        {p.subtitle}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-[#1C1917] font-semibold">{convertAndFormatPrice(p.price, selectedCountryCode)}</span>
                  </div>
                  
                  <p className="text-xs text-[#7D7569] line-clamp-2 leading-relaxed font-light">
                    {p.description}
                  </p>

                  <div className="border-t border-[#EADCC9]/30 pt-4 flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#7D7569] bg-[#F2ECE4]/60 px-2 py-0.5">
                      Textura: {p.texture.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => onViewProductDetails(p)}
                      className="text-[10px] uppercase tracking-[0.15em] text-[#2A2621] font-bold border-b border-[#C5A880] transition-colors"
                    >
                      Detalle Completo →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={onExploreCollection}
            className="inline-flex py-4 px-10 border border-[#2A2621] text-xs uppercase tracking-[0.2em] hover:bg-[#2A2621] hover:text-white transition-colors duration-500 font-medium"
          >
            Ver Colección Completa
          </button>
        </div>
      </section>

      {/* 3.5. Promotions Section */}
      {promotionBundles && promotionBundles.length > 0 && (
        <section className="py-16 sm:py-20 bg-[#FAF8F5] border-y border-[#EADCC9]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 sm:space-y-12">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" />
                Ofertas Exclusivas
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1917]">
                Promociones Especiales
              </h2>
              <p className="text-xs sm:text-sm text-[#7D7569]">
                Sets curados y rituales exclusivos de edición limitada diseñados para transformar su piel a nivel celular.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
              {promotionBundles.slice(0, 3).map((bundle, index) => (
                <motion.div
                  key={bundle.id}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 50 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group flex flex-col justify-between bg-[#FAF8F5] border border-[#EADCC9]/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-stone-100 border-b border-[#EADCC9]/40">
                    {bundle.tag && (
                      <span className="absolute top-4 left-4 z-10 bg-[#FAF8F5]/90 backdrop-blur-xs text-[9px] uppercase tracking-[0.25em] text-[#C5A880] px-3 py-1 font-semibold">
                        {bundle.tag}
                      </span>
                    )}
                    <img
                      src={bundle.image}
                      alt={bundle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-4 sm:p-6 space-y-3 bg-[#FAF8F5]">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base sm:text-lg text-[#1C1917] group-hover:text-[#C5A880] transition-colors">
                          {bundle.title}
                        </h3>
                        <p className="text-[11px] text-[#C5A880] uppercase tracking-wider italic">
                          {bundle.subtitle}
                        </p>
                      </div>
                      <div className="text-right sm:text-left">
                        <span className="font-mono text-sm text-[#1C1917] font-semibold">{convertAndFormatPrice(bundle.price, selectedCountryCode)}</span>
                        {bundle.valuePrice && (
                          <span className="block text-[9px] text-[#A59F95] line-through">{convertAndFormatPrice(bundle.valuePrice, selectedCountryCode)}</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-[#7D7569] line-clamp-2 leading-relaxed font-light">
                      {bundle.description}
                    </p>

                    <div className="border-t border-[#EADCC9]/30 pt-4">
                      {onAddBundleToCart && (
                        <button
                          onClick={() => {
                            const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));
                            onAddBundleToCart(bundleProducts, bundle.title, bundle.price);
                          }}
                          className="w-full py-3 bg-[#2A2621] hover:bg-[#C5A880] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                          <Gift className="w-4 h-4" />
                          Agregar Promoción
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => window.location.hash = 'promotions'}
              className="inline-flex py-4 px-8 sm:px-10 border border-[#2A2621] text-xs uppercase tracking-[0.2em] hover:bg-[#2A2621] hover:text-white transition-colors duration-500 font-medium"
            >
              Ver Todas las Promociones
            </button>
          </div>
        </section>
      )}

      {/* 4. Interactive Skin Type Canvas Finder Quiz */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold">
              Explorador de Lienzo
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2A2621]">
              ¿Conoces las necesidades de tu dermis?
            </h2>
            <p className="text-xs sm:text-sm text-[#7D7569] max-w-xl mx-auto">
              Cada piel clama un cuidado particular. Identifica tu lienzo y descubre qué elixir selecto te guiará al florecimiento celular.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            {[
              { type: 'Deshidratado', goal: 'Hidratación Plena', icon: '💧', advice: 'Sugerimos el Hydro-Plump Nectar para rellenar.' },
              { type: 'Apagado o Opaco', goal: 'Radiancia & Oro', icon: '✨', advice: 'El Lumière Dorée despertará tu luz innata.' },
              { type: 'Falta de Elasticidad', goal: 'Soporte Firm-Sculpt', icon: '🏆', advice: 'Recomendamos reestructurar con Aurum Velvet.' },
              { type: 'Sensible / Enrojecido', goal: 'Tratamiento Calma', icon: '🌱', advice: 'Aura Essentials y Nectar de Soleil sanarán tu barrera.' }
            ].map((box, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="border border-[#EADCC9] p-6 bg-[#FAF8F5] flex flex-col justify-between items-center min-h-[180px] hover:border-[#C5A880] hover:shadow-xs transition-all relative group cursor-pointer"
                onClick={onExploreCollection}
              >
                <span className="text-2xl mb-2">{box.icon}</span>
                <div>
                  <h4 className="font-serif uppercase text-xs tracking-wider text-[#2A2621]">{box.type}</h4>
                  <p className="text-[10px] text-[#C5A880] uppercase tracking-widest mt-1 font-medium">{box.goal}</p>
                </div>
                <p className="text-[10px] text-[#7D7569] leading-tight mt-3 italic group-hover:text-stone-900 transition-colors">
                  {box.advice}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="pt-4">
            <p className="text-xs text-[#7D7569]">
              ¿Deseas explorar toda nuestra colección?{' '}
              <span
                onClick={onExploreCollection}
                className="text-[#C5A880] font-bold border-b border-[#C5A880] cursor-pointer hover:text-stone-900"
              >
                Ver Colección Completa
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 5. Editorial Testmonial Section */}
      <section className="py-20 md:py-28 bg-[#F2ECE4]/30 border-t border-[#EADCC9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Testimonios Editoriales
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2A2621]">
              Vigilantes de la Belleza Auténtica
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#FAF8F5] p-8 border border-[#EADCC9]/40 flex flex-col justify-between gap-6 relative shadow-xs"
              >
                <div className="absolute top-4 right-6 font-serif text-5xl text-[#C5A880]/15 select-none">“</div>
                <div className="space-y-4">
                  <span className="inline-block text-[9px] font-sans font-bold bg-[#FAF8F5] border border-[#C5A880] text-[#C5A880] px-2 py-0.5 uppercase tracking-widest">
                    {t.glowResult}
                  </span>
                  <p className="text-xs sm:text-sm text-[#7D7569] leading-relaxed italic font-light font-serif">
                     "{t.quote}"
                  </p>
                </div>

                <div className="border-t border-[#EADCC9]/30 pt-4 flex flex-col">
                  <span className="font-serif uppercase text-xs tracking-wider text-[#2A2621]">{t.author}</span>
                  <span className="text-[10px] text-[#C5A880] uppercase tracking-widest mt-0.5">{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
