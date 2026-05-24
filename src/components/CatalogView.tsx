import { useState } from 'react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../data';
import { Product, PromotionBundle, Combo, CarouselBanner, ShippingSettings, BankAccount, SkinType } from '../types';
import { convertAndFormatPrice } from '../utils/currency';

interface CatalogViewProps {
  onAddToCart: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
  showPricesAndCart?: boolean;
  selectedCountryCode?: string;
  products?: Product[];
  promotionBundles?: PromotionBundle[];
  combos?: Combo[];
  carouselBanners?: CarouselBanner[];
  shippingSettings?: ShippingSettings;
  bankAccount?: BankAccount;
  skinTypes?: SkinType[];
  onAddBundleToCart?: (products: Product[], customName: string, customPrice: number) => void;
}

const defaultSkinTypeLabels: Record<string, string> = {
  NORMAL: 'Normal',
  SECA: 'Seca',
  GRASA: 'Grasa',
  MIXTA: 'Mixta',
  SENSIBLE: 'Sensible',
  ACNEICA: 'Acneica',
  MADURA: 'Madura',
  DESHIDRATADA: 'Deshidratada',
  REACTIVA: 'Reactiva'
};

const getProductBadge = (id: string) => {
  switch (id) {
    case 'lumiere-doree':
      return { text: 'Top Seller', className: 'bg-[#4f644e]/10 text-[#4f644e] border border-[#4f644e]/20' };
    case 'aura-essentials':
      return { text: 'Premiado', className: 'bg-[#725a37]/10 text-[#725a37] border border-[#725a37]/20' };
    case 'hydro-plump':
      return { text: 'Nuevo', className: 'bg-stone-200/50 text-[#4d463c] border border-stone-300' };
    default:
      return null;
  }
};

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  key
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  key?: string;
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
        <span className={`block w-3 h-3 rounded-sm bg-[#725a37] transition-all ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
      </div>
      <span className={`text-xs uppercase tracking-wide font-medium transition-colors ${checked ? 'text-[#2A2621] font-semibold' : 'text-[#7D7569] group-hover:text-[#725a37]'}`}>
        {label}
      </span>
    </label>
  );
};

export default function CatalogView({
  onAddToCart,
  onViewProductDetails,
  showPricesAndCart = true,
  selectedCountryCode = 'DO',
  products = PRODUCTS,
  promotionBundles = [],
  combos = [],
  carouselBanners = [],
  shippingSettings,
  bankAccount,
  skinTypes,
  onAddBundleToCart
}: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Serums', 'Cleansers', 'Moisturizers', 'Oils', 'Masks', 'Treatments', 'Promociones', 'Combos']);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(['all']);
  const [showProducts, setShowProducts] = useState(true);
  const [showPromotions, setShowPromotions] = useState(true);
  const [showCombos, setShowCombos] = useState(true);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyActive, setOnlyActive] = useState(true);
  const [priceRange, setPriceRange] = useState<number>(260);
  const [visibleLimit, setVisibleLimit] = useState<number>(12);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const categorySet = Array.from(
    new Set([
      'Serums',
      'Cleansers',
      'Moisturizers',
      'Oils',
      'Masks',
      'Treatments',
      'Promociones',
      'Combos',
      ...products.map((item) => item.category || 'Serums'),
      ...promotionBundles.map((promo) => promo.category || 'Promociones'),
      ...combos.map((combo) => combo.category || 'Combos')
    ])
  );

  const skinOptions = [
    { id: 'all', label: 'Todos' },
    { id: 'NORMAL', label: 'Normal' },
    { id: 'SECA', label: 'Seca' },
    { id: 'GRASA', label: 'Grasa' },
    { id: 'MIXTA', label: 'Mixta' },
    { id: 'SENSIBLE', label: 'Sensible' },
    { id: 'ACNEICA', label: 'Acneica' },
    { id: 'MADURA', label: 'Madura' },
    { id: 'DESHIDRATADA', label: 'Deshidratada' },
    { id: 'REACTIVA', label: 'Reactiva' }
  ];

  const matchesSearch = (values: string[]) => {
    if (!normalizedSearch) return true;
    return values.some((value) => value.toLowerCase().includes(normalizedSearch));
  };

  const productMatches = (product: Product) => {
    const category = product.category || 'Serums';
    const skinTypes = product.skinTypes?.map((value) => value.toString()) || [];
    const hasOffer = product.isOffer || Boolean(product.salePrice) || Boolean(product.promotionTag);
    const isActive = product.active !== false;
    const passesActive = !onlyActive || isActive;
    const passesCategory = selectedCategories.includes(category);
    const passesSkin = selectedSkinTypes.includes('all') || skinTypes.some((type) => selectedSkinTypes.includes(type));
    const passesPrice = (product.salePrice ?? product.price) <= priceRange;
    const passesOffer = !onlyOffers || hasOffer;
    const passesSearch = matchesSearch([product.name, product.subtitle, product.description, category, product.promotionTag || '']);
    return passesActive && passesCategory && passesSkin && passesPrice && passesOffer && passesSearch;
  };

  const promotionMatches = (promo: PromotionBundle) => {
    const category = promo.category || 'Promociones';
    const hasOffer = promo.valuePrice !== undefined && promo.valuePrice > promo.price;
    const isActive = promo.active !== false;
    const passesActive = !onlyActive || isActive;
    const passesCategory = selectedCategories.includes(category) || selectedCategories.includes('Promociones');
    const passesOffer = !onlyOffers || hasOffer;
    const passesSearch = matchesSearch([promo.title, promo.subtitle, promo.description, promo.tag || '', category]);
    return passesActive && passesCategory && passesOffer && passesSearch;
  };

  const comboMatches = (combo: Combo) => {
    const category = combo.category || 'Combos';
    const hasOffer = combo.valuePrice !== undefined && combo.valuePrice > combo.price;
    const isActive = combo.active !== false;
    const passesActive = !onlyActive || isActive;
    const passesCategory = selectedCategories.includes(category) || selectedCategories.includes('Combos');
    const passesOffer = !onlyOffers || hasOffer;
    const passesSearch = matchesSearch([combo.title, combo.subtitle || '', combo.description, combo.tag || '', category]);
    return passesActive && passesCategory && passesOffer && passesSearch;
  };

  const filteredProducts = products.filter(productMatches);
  const filteredPromotions = promotionBundles.filter(promotionMatches);
  const filteredCombos = combos.filter(comboMatches);

  const visibleProducts = filteredProducts.slice(0, visibleLimit);
  const visiblePromotions = filteredPromotions.slice(0, 3);
  const visibleCombos = filteredCombos.slice(0, 3);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories(categorySet);
    setSelectedSkinTypes(['all']);
    setShowProducts(true);
    setShowPromotions(true);
    setShowCombos(true);
    setOnlyOffers(false);
    setOnlyActive(true);
    setPriceRange(260);
  };

  const formatSkinTypes = (skinTypes?: string[]) => {
    if (!skinTypes || skinTypes.length === 0) return 'Todos';
    return skinTypes.map((type) => defaultSkinTypeLabels[type.toUpperCase()] || type).join(', ');
  };

  const renderCount = () => {
    return [showProducts ? filteredProducts.length : 0, showPromotions ? filteredPromotions.length : 0, showCombos ? filteredCombos.length : 0].reduce((acc, value) => acc + value, 0);
  };

  return (
    <div className="bg-[#FAF8F5] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2A2621]">Catálogo</h1>
          <p className="text-sm text-[#7D7569]">Explora nuestra colección de productos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-5 bg-white border border-[#EADCC9]/30 p-5 rounded-lg shadow-sm sticky top-24 self-start">
            <div className="space-y-5">
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full rounded-lg border border-[#EADCC9] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2A2621] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#7D7569] mb-3">Tipo de piel</p>
                <div className="space-y-2">
                  {skinOptions.map((option) => (
                    <CustomCheckbox
                      key={option.id}
                      checked={selectedSkinTypes.includes(option.id)}
                      onChange={() => {
                        if (option.id === 'all') {
                          setSelectedSkinTypes(['all']);
                          return;
                        }
                        setSelectedSkinTypes((prev) => {
                          const next = prev.filter((value) => value !== 'all');
                          if (next.includes(option.id)) {
                            const filtered = next.filter((value) => value !== option.id);
                            return filtered.length ? filtered : ['all'];
                          }
                          return [...next, option.id];
                        });
                      }}
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#7D7569] mb-3">Categorías</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {categorySet.map((category) => (
                    <CustomCheckbox
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => {
                        setSelectedCategories((prev) => {
                          if (prev.includes(category)) {
                            const filtered = prev.filter((item) => item !== category);
                            return filtered.length ? filtered : prev;
                          }
                          return [...prev, category];
                        });
                      }}
                      label={category}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOffers}
                    onChange={() => setOnlyOffers(!onlyOffers)}
                    className="w-4 h-4 accent-[#C5A880]"
                  />
                  <span className="text-xs text-[#7D7569]">Solo ofertas</span>
                </label>
              </div>

              <button
                onClick={resetFilters}
                className="w-full rounded-lg bg-[#2A2621] py-2.5 text-xs uppercase tracking-wider text-white font-semibold hover:bg-[#C5A880] transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>

          <section className="space-y-12">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#7D7569]">{renderCount()} productos encontrados</p>
            </div>

            {showProducts && filteredProducts.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-serif text-[#2A2621]">Productos</h2>
                  <div className="flex-1 h-px bg-[#EADCC9]/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProducts.map((product, index) => {
                    const active = product.active !== false;
                    return (
                      <motion.article
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className={`group overflow-hidden rounded-2xl border border-[#EADCC9]/30 bg-white shadow-sm transition-all duration-300 ${active ? '' : 'opacity-60 grayscale'}`}
                      >
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-[#F2ECE4]">
                          <motion.img 
                            src={product.image} 
                            alt={product.name} 
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                            referrerPolicy="no-referrer"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                          />
                          {product.promotionTag && (
                            <motion.span 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute top-3 left-3 rounded-full bg-[#C5A880]/90 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-wide text-white font-semibold shadow-sm"
                            >
                              {product.promotionTag}
                            </motion.span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-5 space-y-3">
                          <motion.h3 
                            className="text-lg font-serif text-[#1C1917] group-hover:text-[#725a37] transition-colors"
                            whileHover={{ x: 2 }}
                          >
                            {product.name}
                          </motion.h3>
                          <p className="text-xs text-[#7D7569] line-clamp-2 leading-relaxed">{product.subtitle}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              {product.salePrice ? (
                                <div className="flex items-center gap-2">
                                  <motion.span 
                                    className="text-lg font-semibold text-[#2A2621]"
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {convertAndFormatPrice(product.salePrice, selectedCountryCode)}
                                  </motion.span>
                                  <span className="text-xs line-through text-[#A59F95]">{convertAndFormatPrice(product.price, selectedCountryCode)}</span>
                                </div>
                              ) : (
                                <motion.span 
                                  className="text-lg font-semibold text-[#2A2621]"
                                  initial={{ scale: 1 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {convertAndFormatPrice(product.price, selectedCountryCode)}
                                </motion.span>
                              )}
                            </div>
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => onAddToCart(product)}
                            className="w-full rounded-xl bg-[#2A2621] py-2.5 text-xs uppercase tracking-wider text-white transition-all hover:bg-[#C5A880] shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Añadir al carrito
                          </motion.button>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            )}

            {showPromotions && filteredPromotions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-serif text-[#2A2621]">Promociones</h2>
                  <div className="flex-1 h-px bg-[#EADCC9]/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visiblePromotions.map((bundle) => (
                    <motion.article
                      key={bundle.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group overflow-hidden rounded-lg border border-[#EADCC9]/40 bg-white shadow-sm"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#FAF8F5]">
                        <img src={bundle.image} alt={bundle.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                        {bundle.tag && <span className="absolute top-3 left-3 rounded bg-[#C5A880]/90 px-2 py-1 text-[10px] uppercase tracking-wide text-white font-semibold">{bundle.tag}</span>}
                      </div>
                      <div className="p-4 space-y-3">
                        <h3 className="text-lg font-serif text-[#1C1917]">{bundle.title}</h3>
                        <p className="text-xs text-[#7D7569] line-clamp-2">{bundle.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-base font-semibold text-[#2A2621]">{convertAndFormatPrice(bundle.price, selectedCountryCode)}</span>
                            {bundle.valuePrice && <span className="text-xs line-through text-[#A59F95] ml-2">{convertAndFormatPrice(bundle.valuePrice, selectedCountryCode)}</span>}
                          </div>
                        </div>
                        {onAddBundleToCart && (
                          <button
                            type="button"
                            onClick={() => {
                              const bundleProducts = products.filter((product) => bundle.productIds.includes(product.id));
                              onAddBundleToCart(bundleProducts, bundle.title, bundle.price);
                            }}
                            className="w-full rounded-lg bg-[#2A2621] py-2 text-xs uppercase tracking-wider text-white hover:bg-[#C5A880] transition-all"
                          >
                            Añadir al carrito
                          </button>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            {showCombos && filteredCombos.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-serif text-[#2A2621]">Combos</h2>
                  <div className="flex-1 h-px bg-[#EADCC9]/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleCombos.map((combo) => (
                      <motion.article
                        key={combo.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group overflow-hidden rounded-lg border border-[#EADCC9]/40 bg-white shadow-sm"
                      >
                        <div className="relative h-48 overflow-hidden bg-[#FAF8F5]">
                          <img src={combo.image} alt={combo.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                          {combo.tag && <span className="absolute top-3 left-3 rounded bg-[#C5A880]/90 px-2 py-1 text-[10px] uppercase tracking-wide text-white font-semibold">{combo.tag}</span>}
                        </div>
                        <div className="p-4 space-y-3">
                          <h3 className="text-lg font-serif text-[#1C1917]">{combo.title}</h3>
                          <p className="text-xs text-[#7D7569] line-clamp-2">{combo.subtitle}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-base font-semibold text-[#2A2621]">{convertAndFormatPrice(combo.price, selectedCountryCode)}</span>
                              {combo.valuePrice && <span className="text-xs line-through text-[#A59F95] ml-2">{convertAndFormatPrice(combo.valuePrice, selectedCountryCode)}</span>}
                            </div>
                          </div>
                          {onAddBundleToCart && (
                            <button
                              type="button"
                              onClick={() => {
                                const comboProducts = products.filter((product) => combo.productIds.includes(product.id));
                                onAddBundleToCart(comboProducts, combo.title, combo.price);
                              }}
                              className="w-full rounded-lg bg-[#2A2621] py-2 text-xs uppercase tracking-wider text-white hover:bg-[#C5A880] transition-all"
                            >
                              Añadir al carrito
                            </button>
                          )}
                        </div>
                      </motion.article>
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
