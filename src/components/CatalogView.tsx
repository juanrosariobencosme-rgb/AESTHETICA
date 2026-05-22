import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Sparkles, Filter, Check, Eye, Gift } from 'lucide-react';
import { PRODUCTS } from '../data';
import { Product, PromotionBundle } from '../types';
import { convertAndFormatPrice } from '../utils/currency';

interface CatalogViewProps {
  onAddToCart: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
  showPricesAndCart?: boolean;
  selectedCountryCode?: string;
  products?: Product[];
  promotionBundles?: PromotionBundle[];
  onAddBundleToCart?: (products: Product[], customName: string, customPrice: number) => void;
}

const productCategories: Record<string, string> = {
  'lumiere-doree': 'Serums',
  'aura-essentials': 'Cleansers',
  'hydro-plump': 'Serums',
  'aurum-velvet': 'Moisturizers',
  'nectar-soleil': 'Moisturizers',
  'sublime-elixir-iris': 'Serums',
  'caviar-luxe-infusion': 'Moisturizers',
  'botanique-mist-bioactive': 'Cleansers'
};

const productSkinTypes: Record<string, string[]> = {
  'lumiere-doree': ['dry', 'oily-combination', 'sensitive', 'all'],
  'aura-essentials': ['dry', 'sensitive', 'all'],
  'hydro-plump': ['dry', 'oily-combination', 'sensitive', 'all'],
  'aurum-velvet': ['dry', 'sensitive', 'all'],
  'nectar-soleil': ['dry', 'oily-combination', 'sensitive', 'all'],
  'sublime-elixir-iris': ['dry', 'sensitive', 'all'],
  'caviar-luxe-infusion': ['dry', 'all'],
  'botanique-mist-bioactive': ['dry', 'oily-combination', 'sensitive', 'all']
};

const getProductBadge = (id: string) => {
  switch (id) {
    case 'lumiere-doree':
      return { text: 'Best Seller', className: 'bg-[#4f644e]/10 text-[#4f644e] border border-[#4f644e]/20' };
    case 'aura-essentials':
      return { text: 'Award Winner', className: 'bg-[#725a37]/10 text-[#725a37] border border-[#725a37]/20' };
    case 'hydro-plump':
      return { text: 'New', className: 'bg-stone-200/50 text-[#4d463c] border border-stone-300' };
    case 'aurum-velvet':
      return { text: 'Best Seller', className: 'bg-[#4f644e]/10 text-[#4f644e] border border-[#4f644e]/20' };
    case 'nectar-soleil':
      return { text: 'New', className: 'bg-stone-200/50 text-[#4d463c] border border-stone-300' };
    default:
      return null;
  }
};

const CustomCheckbox = ({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group text-left">
      <div className="relative w-4.5 h-4.5 rounded border border-[#EADCC9] flex items-center justify-center group-hover:border-[#725a37] transition-all bg-white shadow-3xs">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
        />
        <Check
          className={`w-3.5 h-3.5 text-[#725a37] transition-all duration-250 pointer-events-none ${
            checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        />
      </div>
      <span className={`text-xs uppercase tracking-wide font-medium transition-colors ${
        checked ? 'text-[#2A2621] font-semibold' : 'text-[#7D7569] group-hover:text-[#725a37]'
      }`}>
        {label}
      </span>
    </label>
  );
};

export default function CatalogView({ 
  onAddToCart, 
  onViewProductDetails,
  showPricesAndCart = true,
  selectedCountryCode = 'MX',
  products = PRODUCTS,
  promotionBundles = [],
  onAddBundleToCart
}: CatalogViewProps) {
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(['all']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Cleansers', 'Serums', 'Moisturizers']);
  const [priceRange, setPriceRange] = useState<number>(200);
  const [visibleLimit, setVisibleLimit] = useState<number>(3);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        // Prevent custom styling desolating all selections to guide comfortable filtering
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleSkinTypeChange = (type: string) => {
    if (type === 'all') {
      setSelectedSkinTypes(['all']);
    } else {
      setSelectedSkinTypes(prev => {
        const filtered = prev.filter(t => t !== 'all');
        if (filtered.includes(type)) {
          const next = filtered.filter(t => t !== type);
          return next.length === 0 ? ['all'] : next;
        } else {
          return [...filtered, type];
        }
      });
    }
  };

  const handleResetFilters = () => {
    setSelectedSkinTypes(['all']);
    setSelectedCategories(['Cleansers', 'Serums', 'Moisturizers']);
    setPriceRange(200);
    setVisibleLimit(3);
  };

  // Filtration query logic
  const filtered = products.filter(p => {
    if (!showPricesAndCart) return true; // Keep all products in full Catalog view

    // 1. Category Filter
    const cat = productCategories[p.id] || 'Serums';
    const passesCategory = selectedCategories.includes(cat);

    // 2. Skin Type Filter
    const skinTypes = productSkinTypes[p.id] || ['all'];
    const passesSkinType = selectedSkinTypes.includes('all') || 
                           selectedSkinTypes.some(st => skinTypes.includes(st));

    // 3. Price Filter
    const passesPrice = p.price <= priceRange;

    return passesCategory && passesSkinType && passesPrice;
  });

  const visibleLimitActual = showPricesAndCart ? visibleLimit : 16;
  const visibleProducts = filtered.slice(0, visibleLimitActual);

  return (
    <div className="bg-[#FAF8F5] py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] font-bold">
            {showPricesAndCart ? "La Botica de Lujo Alternativo" : "Catálogo de Especímenes"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#2A2621] tracking-wide">
            {showPricesAndCart ? "Colección Selecta Aesthetica" : "Nuestros Elixires Esenciales"}
          </h1>
          <div className="h-[1.5px] w-20 bg-[#C5A880] mx-auto mt-4" />
          <p className="text-sm text-[#7D7569] leading-relaxed">
            {showPricesAndCart 
              ? "Nuestros elixires están finamente balanceados para alimentar, esculpir y purificar de manera holística. Cada frasco es un tributo a la excelencia dermatológica y sensorial."
              : "Explore las características de nuestra gama completa de tratamientos moleculares, sin prisas ni presiones. Creados para dar a conocer sus beneficios clínicamente comprobados, texturas y rituales sugeridos."}
          </p>
        </div>

        {/* Outer Split Wrapper - Filters Column vs. Catalog List */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mt-12 pb-12">
          
          {/* 1. Sidebar Column on the Left - ONLY when showing pricing and cart */}
          {showPricesAndCart && (
            <aside className="w-full lg:w-64 shrink-0 border border-[#EADCC9]/50 bg-white/40 p-6 sm:p-8 rounded-xs lg:sticky lg:top-28">
              <div className="space-y-10">
                
                {/* Sidebar Header Title */}
                <div className="border-b border-[#EADCC9] pb-4 text-left">
                  <h3 className="font-serif text-xl text-[#725a37] tracking-wider uppercase">
                    Filtrar Colección
                  </h3>
                  <p className="text-[10px] text-[#7D7569] uppercase tracking-wide font-sans mt-1">
                    Ajustes de Pureza
                  </p>
                </div>

                {/* Skin Type Filter Options */}
                <div className="space-y-4 text-left">
                  <h4 className="text-[11px] font-semibold tracking-[0.15em] text-[#7D7569] uppercase border-l-2 border-[#C5A880] pl-2">
                    Tipo de Dermis
                  </h4>
                  <div className="space-y-3">
                    <CustomCheckbox
                      checked={selectedSkinTypes.includes('all')}
                      onChange={() => handleSkinTypeChange('all')}
                      label="Todos los Tipos"
                    />
                    <CustomCheckbox
                      checked={selectedSkinTypes.includes('dry')}
                      onChange={() => handleSkinTypeChange('dry')}
                      label="Piel Seca (Dry)"
                    />
                    <CustomCheckbox
                      checked={selectedSkinTypes.includes('oily-combination')}
                      onChange={() => handleSkinTypeChange('oily-combination')}
                      label="Mixta / Grasa"
                    />
                    <CustomCheckbox
                      checked={selectedSkinTypes.includes('sensitive')}
                      onChange={() => handleSkinTypeChange('sensitive')}
                      label="Piel Sensible"
                    />
                  </div>
                </div>

                {/* Category Filter Options */}
                <div className="space-y-4 text-left">
                  <h4 className="text-[11px] font-semibold tracking-[0.15em] text-[#7D7569] uppercase border-l-2 border-[#C5A880] pl-2">
                    Categoría
                  </h4>
                  <div className="space-y-3">
                    <CustomCheckbox
                      checked={selectedCategories.includes('Cleansers')}
                      onChange={() => handleCategoryChange('Cleansers')}
                      label="Limpiadores"
                    />
                    <CustomCheckbox
                      checked={selectedCategories.includes('Serums')}
                      onChange={() => handleCategoryChange('Serums')}
                      label="Sueros (Serums)"
                    />
                    <CustomCheckbox
                      checked={selectedCategories.includes('Moisturizers')}
                      onChange={() => handleCategoryChange('Moisturizers')}
                      label="Moisturizers"
                    />
                  </div>
                </div>

                {/* Slider for Price Ceiling */}
                <div className="space-y-4 text-left">
                  <h4 className="text-[11px] font-semibold tracking-[0.15em] text-[#7D7569] uppercase border-l-2 border-[#C5A880] pl-2 flex justify-between items-center">
                    <span>Precio Máximo</span>
                    <span className="font-mono text-[#725a37] font-bold text-xs">{convertAndFormatPrice(priceRange, selectedCountryCode)}</span>
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="5"
                      value={priceRange}
                      onChange={(e) => {
                        setPriceRange(Number(e.target.value));
                        setVisibleLimit(3); // Reset limits on slide to feel natural
                      }}
                      className="w-full h-1 bg-[#EADCC9] rounded-lg appearance-none cursor-pointer accent-[#725a37] focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] font-mono tracking-wider text-[#7D7569]">
                      <span>{convertAndFormatPrice(50, selectedCountryCode)}</span>
                      <span>{convertAndFormatPrice(200, selectedCountryCode)}</span>
                    </div>
                  </div>
                </div>

                {/* Reset constraints CTA */}
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2.5 bg-stone-900 hover:bg-[#725a37] text-white text-[9px] uppercase tracking-widest font-bold font-sans transition-colors cursor-pointer"
                >
                  Limpiar Filtros
                </button>

              </div>
            </aside>
          )}

          {/* 2. Catalog Section Grid on the Right */}
          <section className="flex-grow w-full">
            
            {/* Header statistics alignment with design */}
            <div className="flex justify-between items-end mb-8 border-b border-[#EADCC9]/50 pb-4 text-left">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#725a37] tracking-tight font-light">
                {showPricesAndCart ? "Todas las Colecciones" : "Gama de Fórmulas Creadas"}
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7D7569] hidden md:block">
                {showPricesAndCart ? "Mostrando" : "Viendo"} 1-{Math.min(visibleLimitActual, filtered.length)} de {filtered.length} elixires
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24 bg-white border border-[#EADCC9]/40 p-8 max-w-md mx-auto space-y-4"
                >
                  <ShoppingBag className="w-12 h-12 text-[#C5A880] mx-auto animate-pulse" />
                  <h2 className="font-serif text-xl text-[#2A2621]">Ningún elixir coincide</h2>
                  <p className="text-xs text-[#7D7569] leading-relaxed">
                    {showPricesAndCart
                      ? "Ajuste los diales de tipo de dermis o amplíe el rango de precio para revelar nuestras formulaciones celulares."
                      : "Ajuste los diales de tipo de dermis o categorías para revelar nuestras formulaciones celulares."}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="py-2.5 px-6 bg-[#2A2621] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A880] transition-colors"
                  >
                    Restaurar Filtros
                  </button>
                </motion.div>
              ) : (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16 ${showPricesAndCart ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {visibleProducts.map((p) => {
                    const badge = getProductBadge(p.id);
                    return (
                      <motion.article
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        key={p.id}
                        onClick={() => onViewProductDetails(p)}
                        className="group flex flex-col relative cursor-pointer text-center bg-transparent transform transition-all duration-500 hover:-translate-y-2"
                      >
                        {/* Tags Badges left top corner aligned */}
                        {badge && (
                          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-sans font-semibold uppercase tracking-wider backdrop-blur-xs ${badge.className}`}>
                              {badge.text}
                            </span>
                          </div>
                        )}

                        {/* Circular add shopping bag quick-cta */}
                        {showPricesAndCart && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(p);
                            }}
                            className="absolute bottom-32 right-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#725a37] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_4px_12px_rgba(114,90,55,0.08)] hover:bg-[#725a37] hover:text-white"
                            title="Añadir al bolso sensorial"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}

                        {/* Product Image Frame */}
                        <div className="aspect-square bg-[#FAF8F5] border border-[#EADCC9]/55 overflow-hidden relative rounded-xs mb-6 flex items-center justify-center p-0">
                          <img
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                            src={p.image}
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Title descriptions block centered */}
                        <div className="flex flex-col flex-grow text-center">
                          <h2 className="font-serif text-[22px] tracking-wide text-on-background group-hover:text-[#725a37] transition-colors mb-1.5 leading-tight">
                            {p.name}
                          </h2>
                          <p className="text-xs text-[#C5A880] tracking-wider uppercase font-medium mb-1 font-sans">
                            {p.subtitle}
                          </p>
                          <p className="text-xs text-[#7D7569] font-light leading-relaxed mb-3 line-clamp-3 px-4">
                            {p.description}
                          </p>
                          {showPricesAndCart ? (
                            <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#725a37] mt-auto">
                              {convertAndFormatPrice(p.price, selectedCountryCode)}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a59f95] mt-auto">
                              Contenido: {p.size}
                            </span>
                          )}
                        </div>

                      </motion.article>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            {/* Load more logic simulation: "DISCOVER MORE" button from the catalog */}
            {filtered.length > visibleLimit && (
              <div className="mt-16 flex justify-center border-t border-[#EADCC9]/30 pt-12">
                <button
                  onClick={() => setVisibleLimit(prev => prev + 3)}
                  className="border border-[#7f766a] text-on-background px-8 py-3.5 text-xs font-semibold tracking-widest uppercase hover:border-[#725a37] hover:text-[#725a37] bg-transparent transition-colors duration-300 cursor-pointer"
                >
                  DISCOVER MORE
                </button>
              </div>
            )}

            {/* Promotions Section in Catalog */}
            {showPricesAndCart && promotionBundles && promotionBundles.length > 0 && (
              <div className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-[#EADCC9]/30">
                <div className="text-center space-y-4 mb-8 sm:mb-12">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold flex items-center justify-center gap-2">
                    <Gift className="w-4 h-4" />
                    Ofertas Especiales
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#1C1917]">
                    Promociones Disponibles
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {promotionBundles.slice(0, 3).map((bundle) => (
                    <motion.div
                      key={bundle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-[#EADCC9]/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative aspect-4/5 overflow-hidden bg-stone-100">
                        {bundle.tag && (
                          <span className="absolute top-4 left-4 z-10 bg-[#FAF8F5]/90 backdrop-blur-xs text-[9px] uppercase tracking-[0.25em] text-[#C5A880] px-3 py-1 font-semibold">
                            {bundle.tag}
                          </span>
                        )}
                        <img
                          src={bundle.image}
                          alt={bundle.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-4 sm:p-5 space-y-3">
                        <div>
                          <h3 className="font-serif text-base sm:text-lg text-[#1C1917]">{bundle.title}</h3>
                          <p className="text-[10px] text-[#C5A880] uppercase tracking-wider italic">{bundle.subtitle}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <span className="font-mono text-sm font-semibold text-[#1C1917]">{convertAndFormatPrice(bundle.price, selectedCountryCode)}</span>
                            {bundle.valuePrice && (
                              <span className="block text-[9px] text-[#A59F95] line-through">{convertAndFormatPrice(bundle.valuePrice, selectedCountryCode)}</span>
                            )}
                          </div>
                          {onAddBundleToCart && (
                            <button
                              onClick={() => {
                                const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));
                                onAddBundleToCart(bundleProducts, bundle.title, bundle.price);
                              }}
                              className="w-full sm:w-auto py-2 px-4 bg-[#2A2621] hover:bg-[#C5A880] text-white text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2"
                            >
                              <Gift className="w-3 h-3" />
                              Agregar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  );
}
