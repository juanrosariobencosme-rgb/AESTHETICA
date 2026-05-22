import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Compass, Calendar, Menu, X, Info, Layers, ChevronDown, User, Gift } from 'lucide-react';
import { useState } from 'react';
import { COUNTRIES } from '../utils/currency';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  selectedCountryCode: string;
  setSelectedCountryCode: (code: string) => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  openCart,
  selectedCountryCode,
  setSelectedCountryCode
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Compass },
    { id: 'catalog', label: 'Catálogo', icon: Layers },
    { id: 'products', label: 'Productos', icon: ShoppingBag },
    { id: 'promotions', label: 'Promociones', icon: Gift },
    { id: 'about', label: 'Sobre Nosotros', icon: Info },
    { id: 'contact', label: 'Contacto', icon: Calendar },
  ];

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EADCC9]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Quiet Luxury Serif */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#2A2621] select-none hover:opacity-80 transition-opacity">
              AESTHETICA
            </h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#C5A880] -mt-0.5 pl-0.5">
              Atelier Skin Lab
            </p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 py-2 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                    isActive
                      ? 'text-[#2A2621] font-semibold'
                      : 'text-[#7D7569] hover:text-[#2A2621]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A880]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls - Country Selector Dropdown & Shopping Cart */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Country Flag Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                onBlur={() => setTimeout(() => setCountryDropdownOpen(false), 200)}
                className="flex items-center space-x-1 px-2 py-1.5 border border-[#EADCC9]/50 hover:border-[#C5A880] bg-[#FAF8F5]/80 rounded transition-all text-xs font-sans text-[#7D7569] hover:text-[#2A2621]"
              >
                <span>{currentCountry.flag}</span>
                <span className="font-mono text-[10px] font-bold tracking-wider hidden xs:inline">{currentCountry.currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              </button>

              <AnimatePresence>
                {countryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-[#FAF8F5] border border-[#EADCC9] shadow-lg py-1 z-50 text-left"
                  >
                    <p className="text-[9px] uppercase tracking-wider text-[#A59F95] px-3 py-1 border-b border-[#EADCC9]/30 font-bold font-sans">
                      Seleccionar País
                    </p>
                    {COUNTRIES.map((country) => (
                      <button
                        key={country.code}
                        onMouseDown={() => {
                          setSelectedCountryCode(country.code);
                          setCountryDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#F2ECE4] text-[#2A2621] transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{country.flag}</span>
                          <span className="font-sans font-light">{country.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#C5A880] font-bold">
                          {country.currency}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Login / Admin Panel Icon */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 transition-colors focus:outline-none ${
                activeTab === 'admin' ? 'text-[#C5A880]' : 'text-[#2A2621] hover:text-[#C5A880]'
              }`}
              title="Iniciar Sesión / Administración"
              aria-label="Account Login"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Bag Icon with Floating Counter */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#2A2621] hover:text-[#C5A880] transition-colors focus:outline-none"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    key={cartCount}
                    className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C5A880] px-1 text-[9px] font-sans font-medium text-white shadow-sm ring-1 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#2A2621] hover:text-[#C5A880] transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF8F5] border-b border-[#EADCC9]/40 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-md text-xs uppercase tracking-[0.16em] transition-all ${
                      isActive
                        ? 'bg-[#F2ECE4] text-[#2A2621] font-semibold'
                        : 'text-[#7D7569] hover:bg-[#FAF8F5] hover:text-[#2A2621]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-[#7D7569]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Admin Link */}
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-md text-xs uppercase tracking-[0.16em] transition-all ${
                  activeTab === 'admin'
                    ? 'bg-[#F2ECE4] text-[#2A2621] font-semibold'
                    : 'text-[#7D7569] hover:bg-[#FAF8F5] hover:text-[#2A2621]'
                }`}
              >
                <User className={`w-4 h-4 ${activeTab === 'admin' ? 'text-[#C5A880]' : 'text-[#7D7569]'}`} />
                <span>Iniciar Sesión (Admin)</span>
              </button>
              <div className="pt-4 px-4 border-t border-[#EADCC9]/50 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#7D7569]">
                  Atelier Digital 2026
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880]">
                  Luxury Skin Regimen
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
