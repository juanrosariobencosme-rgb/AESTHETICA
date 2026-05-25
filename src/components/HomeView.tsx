import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Leaf, Star, ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { PRODUCTS, EDITORIALS, TESTIMONIALS } from '../data';
import { Product, PromotionBundle, CarouselBanner } from '../types';
import { convertAndFormatPrice } from '../utils/currency';

interface HomeViewProps {
  onExploreCollection: () => void;
  onExploreOffers: () => void;
  onViewProductDetails: (product: Product) => void;
  selectedCountryCode?: string;
  products?: Product[];
  promotionBundles?: PromotionBundle[];
  carouselBanners?: CarouselBanner[];
  formulasCarouselBanners?: CarouselBanner[];
  onAddBundleToCart?: (products: Product[], customName: string, customPrice: number) => void;
}

export default function HomeView({ 
  onExploreCollection, 
  onExploreOffers,
  onViewProductDetails,
  selectedCountryCode = 'DO',
  products = PRODUCTS,
  promotionBundles = [],
  carouselBanners = [],
  formulasCarouselBanners = [],
  onAddBundleToCart
}: HomeViewProps) {
  const getProductQuote = (productName: string): string => {
    const quotes: Record<string, string> = {
      'Lumière Dorée': 'Tratamiento concentrado con péptidos y partículas finas de oro 24K para un brillo de seda.',
      'Aura Essentials': 'Bálsamo cremoso a base de absoluto de jazmín que purifica y fortalece la barrera cutánea.',
      'Hydro-Plump Nectar': 'Néctar hidratante con ácido hialurónico molecular y agua pura de glaciar suizo.',
      'Aurum Velvet': 'Crema exquisita con escualano vegetal y hojuelas de oro para esculpir profundamente.',
      'Nectar de Soleil': 'Infusión sensorial de 8 aceites botánicos orgánicos para regeneración última.',
      'Sublime Elixir Iris': 'Néctar botánico precioso rico en flavonoides activos de la raíz Iris Pallida.',
      'Caviar Luxe Infusion': 'Complejo marino extraordinario que fusiona ADN de caviar con extractos botánicos.',
      'Botanique Mist Bioactive': 'Mist celular bioactivo ligero que refresca, purifica y optimiza la absorción.',
      'Crystal Dew Serum': 'Serum iluminador revolucionario infundido con polvo de diamante micronizado.',
      'Midnight Repair': 'Aceite nocturno intensivo formulado con bakuchiol y aceite de rosa mosqueta.',
      'Arctic Algae Mask': 'Máscara desintoxicante poderosa que combina extractos de algas árticas con arcilla volcánica.',
      'Peptide Lift Cream': 'Crema anti-envejecimiento potente con complejo de péptidos propietario.',
      'Rose Quartz Roller': 'Rodillo facial de cuarzo rosa genuino diseñado para mejorar la absorción de productos.',
      'Vitamin C Glow Serum': 'Serum potente de vitamina C 20% estabilizado con ácido ferúlico y vitamina E.',
      'Hyaluronic Acid Mist': 'Mist refrescante que proporciona hidratación instantánea y efecto voluminizador.',
      'Retinol Night Cream': 'Crema nocturna suave con retinol encapsulado que se libera gradualmente.',
      'Green Tea Cleanser': 'Limpiador en gel refrescante infundido con extracto de té verde y antioxidantes.',
      'Collagen Eye Cream': 'Tratamiento ocular dirigido con colágeno marino y péptidos.',
      'Daily Defense SPF 50': 'Protector solar ligero y no graso con protección de amplio espectro SPF 50.',
      'Radiance Exfoliating Scrub': 'Exfoliante físico suave con perlas de jojoba y enzimas de frutas.'
    };
    return quotes[productName] || 'Tratamiento exclusivo formulado con ingredientes premium.';
  };

  const getProductBadge = (productName: string): string => {
    const badges: Record<string, string> = {
      'Lumière Dorée': 'Elixir Destacado',
      'Aura Essentials': 'Pureza Sensorial',
      'Hydro-Plump Nectar': 'Bote de Humedad',
      'Aurum Velvet': 'Lifting Esculpido',
      'Nectar de Soleil': 'Regeneración Nocturna',
      'Sublime Elixir Iris': 'Plumping Intenso',
      'Caviar Luxe Infusion': 'Reconstrucción Celular',
      'Botanique Mist Bioactive': 'Refrescante Bioactivo',
      'Crystal Dew Serum': 'Iluminación Diamante',
      'Midnight Repair': 'Renovación Nocturna',
      'Arctic Algae Mask': 'Desintoxicación Profunda',
      'Peptide Lift Cream': 'Anti-Edad Avanzado',
      'Rose Quartz Roller': 'Masaje Cristalino',
      'Vitamin C Glow Serum': 'Antioxidante Potente',
      'Hyaluronic Acid Mist': 'Hidratación Instantánea',
      'Retinol Night Cream': 'Tratamiento Suave',
      'Green Tea Cleanser': 'Limpieza Antioxidante',
      'Collagen Eye Cream': 'Tratamiento Ocular',
      'Daily Defense SPF 50': 'Protección Solar',
      'Radiance Exfoliating Scrub': 'Exfoliación Suave'
    };
    return badges[productName] || 'Exclusivo';
  };

  type HomeCarouselItem = {
    id: string;
    image: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonUrl?: string;
    product?: Product;
    badge?: string;
    quote?: string;
  };

  const defaultCarouselItems: HomeCarouselItem[] = products.slice(0, 4).map((product, index) => ({
    id: `default-${index}`,
    image: product.image,
    title: product.name,
    description: getProductQuote(product.name),
    buttonText: 'Ver Detalles',
    buttonUrl: '#catalog',
    product,
    badge: getProductBadge(product.name),
    quote: getProductQuote(product.name)
  }));

  // Nota: el carrusel principal (hero) se alimenta SOLO del inventario (products),
  // no de la tabla de banners en Supabase.
  const homeCarouselItems: HomeCarouselItem[] = defaultCarouselItems;

  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % homeCarouselItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [homeCarouselItems.length]);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + homeCarouselItems.length) % homeCarouselItems.length);
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % homeCarouselItems.length);
  };

  const activeCarousel = homeCarouselItems[carouselIndex];

  // === Carrusel secundario: Fórmulas Destacadas (independiente del inicio) ===
  const formulasCarouselItems = formulasCarouselBanners || [];
  const [formulasIndex, setFormulasIndex] = useState(0);

  useEffect(() => {
    if (!formulasCarouselItems || formulasCarouselItems.length <= 1) return;
    const timer = setInterval(() => {
      setFormulasIndex((prev) => (prev + 1) % formulasCarouselItems.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [formulasCarouselItems.length]);

  const handleFormulasPrev = () => {
    if (!formulasCarouselItems.length) return;
    setFormulasIndex((prev) => (prev - 1 + formulasCarouselItems.length) % formulasCarouselItems.length);
  };

  const handleFormulasNext = () => {
    if (!formulasCarouselItems.length) return;
    setFormulasIndex((prev) => (prev + 1) % formulasCarouselItems.length);
  };

  const activeFormulaBanner = formulasCarouselItems[formulasIndex];

  return (
    <div className="bg-[#FAF8F5] text-[#2A2621]">
      
      {/* 1. Hero Section - Quiet Luxury Overlapping Layout */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden py-16 md:py-20 lg:py-24 border-b border-[#EADCC9]/20">
        <div className="absolute inset-0 bg-radial-[circle_at_70%_50%] from-[#F2ECE4] via-[#FAF8F5] to-[#FAF8F5] opacity-65 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
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
            {homeCarouselItems.length > 0 && (
              <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-t-full overflow-hidden border border-[#EADCC9]/40 shadow-xl">
                  
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={carouselIndex}
                      src={activeCarousel.image}
                      alt={activeCarousel.product?.name ?? activeCarousel.title}
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
                    {homeCarouselItems.map((_, dotIdx) => (
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
                    <h3 className="font-serif tracking-widest text-[#2A2621] uppercase text-base mt-1">{activeCarousel.product?.name ?? activeCarousel.title}</h3>
                    <p className="text-xs text-[#7D7569] mt-2 leading-relaxed h-[60px] overflow-hidden">
                      {activeCarousel.quote ?? activeCarousel.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#1C1917]">
                        {convertAndFormatPrice(activeCarousel.product?.price ?? 0, selectedCountryCode)}
                      </span>
                      <button
                        onClick={() => activeCarousel.product && onViewProductDetails(activeCarousel.product)}
                        className="text-[10px] uppercase tracking-widest text-[#2A2621] font-bold border-b border-[#C5A880] hover:text-[#C5A880] transition-colors cursor-pointer"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 2. Editorial Our Philosophy / Concept */}
      <section className="py-16 md:py-20 lg:py-28 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {EDITORIALS.map((edit, idx) => (
            <div
              key={edit.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                idx > 0 ? 'mt-16 md:mt-20 lg:mt-24' : ''
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

      {/* 3. Galería — Full-bleed Banner Carousel */}
      <section className="relative bg-[#0F0D0B] overflow-hidden">

        {/* Banners carousel — full width, tall images */}
        {formulasCarouselItems.length > 0 && activeFormulaBanner ? (
          <div className="relative w-full min-h-[420px] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[680px] group">

            {/* Images */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeFormulaBanner.id}
                src={activeFormulaBanner.image}
                alt={activeFormulaBanner.title || 'Galería'}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B] via-[#0F0D0B]/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F0D0B]/50 via-transparent to-transparent pointer-events-none" />

            {/* Section heading overlay — bottom-left */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14 pointer-events-none">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-end justify-between gap-6">

                {/* Text */}
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#C5A880] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                    Galería Sensorial
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-wide leading-[1.1]">
                    Nuestros Elixires
                  </h2>
                  {activeFormulaBanner.title && (
                    <p className="text-sm sm:text-base text-white/50 max-w-md font-light leading-relaxed">
                      {activeFormulaBanner.title}
                    </p>
                  )}
                </div>

                {/* Counter badge */}
                <div className="pointer-events-auto text-right">
                  <span className="text-xs font-mono text-white/40">
                    <span className="text-[#C5A880] font-bold text-lg">{String(formulasIndex + 1).padStart(2, '0')}</span>
                    <span className="mx-1">/</span>
                    {String(formulasCarouselItems.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Nav arrows */}
            <button
              onClick={handleFormulasPrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer z-20 opacity-0 group-hover:opacity-100 duration-500"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleFormulasNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer z-20 opacity-0 group-hover:opacity-100 duration-500"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
              {formulasCarouselItems.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setFormulasIndex(dotIdx)}
                  className={`h-[3px] rounded-full transition-all duration-500 cursor-pointer ${
                    dotIdx === formulasIndex ? 'bg-[#C5A880] w-8' : 'bg-white/30 w-2'
                  }`}
                  aria-label={`Ir a la imagen ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state — keeps the section visible even without banners */
          <div className="py-20 px-6 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#C5A880]/60 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]/40" />
                Galería Sensorial
              </span>
              <h2 className="text-2xl font-serif text-white/30 tracking-wide">
                Nuestros Elixires
              </h2>
              <p className="text-xs text-white/20 leading-relaxed">
                No hay imágenes cargadas todavía. Agrégalas desde <strong className="text-white/30">Admin → Banners / Carrusel</strong>.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 3.5. Promotions Section */}
      {promotionBundles && promotionBundles.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 bg-[#FAF8F5] border-y border-[#EADCC9]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 md:space-y-12">
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
              {promotionBundles.slice(0, 3).map((bundle, index) => {
                const savingsPercent = bundle.valuePrice
                  ? Math.round(((bundle.valuePrice - bundle.price) / bundle.valuePrice) * 100)
                  : null;
                return (
                  <motion.div
                    key={bundle.id}
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 50 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="group flex flex-col justify-between bg-[#FAF8F5] border border-[#EADCC9]/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                  >
                  <div className="relative aspect-4/5 overflow-hidden bg-stone-100 border-b border-[#EADCC9]/40 min-h-[300px]">
                    {bundle.tag && (
                      <span className="absolute top-4 left-4 z-10 bg-[#FAF8F5]/90 backdrop-blur-xs text-[9px] uppercase tracking-[0.25em] text-[#C5A880] px-3 py-1 font-semibold">
                        {bundle.tag}
                      </span>
                    )}
                    {savingsPercent && (
                      <span className="absolute top-4 right-4 z-10 bg-[#C5A880] text-[#1C1917] text-[9px] uppercase tracking-[0.25em] px-3 py-1 font-bold rounded-full shadow-lg">
                        -{savingsPercent}%
                      </span>
                    )}
                    <img
                      src={bundle.image}
                      alt={bundle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=1000';
                      }}
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
                          Comprar
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>

            <button
              onClick={onExploreOffers}
              className="inline-flex py-4 px-8 sm:px-10 border border-[#2A2621] text-xs uppercase tracking-[0.2em] hover:bg-[#2A2621] hover:text-white transition-colors duration-500 font-medium"
            >
              Ver Promociones
            </button>
          </div>
        </section>
      )}

      {/* 4. Interactive Skin Type Canvas Finder Quiz */}
      <section className="py-16 md:py-20 lg:py-24 bg-[#FAF8F5]">
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
      <section className="py-16 md:py-20 lg:py-28 bg-[#F2ECE4]/30 border-t border-[#EADCC9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Testimonios Editoriales
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2A2621]">
              Vigilantes de la Belleza Auténtica
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
