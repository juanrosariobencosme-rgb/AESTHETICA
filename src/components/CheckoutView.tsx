import { useState, FormEvent } from 'react';
import { ShoppingBag, ArrowRight, Truck, Landmark, Circle, CheckCircle } from 'lucide-react';
import { CartItem, ShippingSettings, BankAccount } from '../types';
import { convertAndFormatPrice, COUNTRIES } from '../utils/currency';

interface CheckoutViewProps {
  cart: CartItem[];
  total: number;
  shippingSettings?: ShippingSettings;
  bankAccount?: BankAccount;
  onOrderComplete: (orderData: {
    email: string;
    name: string;
    paymentMethod: string;
    finalTotal: number;
    items: CartItem[];
    shippingCost: number;
    tax: number;
    shippingZone: string;
    voucherFileName?: string;
  }) => void;
  onBackToCatalog: () => void;
  selectedCountryCode?: string;
}

export default function CheckoutView({ 
  cart, 
  total, 
  shippingSettings,
  bankAccount,
  onOrderComplete, 
  onBackToCatalog,
  selectedCountryCode = 'DO'
}: CheckoutViewProps) {
  const finite = (n: any, fallback: number) => {
    const v = typeof n === 'number' ? n : Number(n);
    return Number.isFinite(v) ? v : fallback;
  };

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [voucherFile, setVoucherFile] = useState<File | null>(null);

  const districtKeywordList = shippingSettings?.districtKeywords?.length
    ? shippingSettings.districtKeywords
    : ['Distrito', 'Santo Domingo', 'Distrito Nacional', 'DN'];
  const districtPattern = new RegExp(districtKeywordList.join('|'), 'i');
  const shippingZone = districtPattern.test(`${address} ${city}`) ? 'Distrito' : 'Fuera del Distrito';
  // NOTA: Los precios del catálogo están en USD (base). La config de envío se maneja en DOP (200/300).
  // Convertimos DOP → USD para cálculos internos y luego formateamos según el país.
  const dopRate = finite(COUNTRIES.find(c => c.code === 'DO')?.rate, 59.2);
  const districtRateDop = finite(shippingSettings?.districtRate, 200);
  const outsideRateDop = finite(shippingSettings?.outsideRate, 300);
  const shippingCostDop = shippingZone === 'Distrito' ? districtRateDop : outsideRateDop;
  const shippingCost = Math.round((shippingCostDop / dopRate) * 100) / 100; // USD base

  // ITBIS 18% con precisión a centavos
  const taxRate = 0.18;
  const subtotal = finite(total, 0);
  // El cliente pidió: subtotal + envío + ITBIS(18%) SOBRE ESA BASE
  const tax = Math.round((subtotal + shippingCost) * taxRate * 100) / 100;
  const finalTotal = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city || !zip) return;

    onOrderComplete({
      email: `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      name: fullName,
      paymentMethod,
      finalTotal,
      items: cart,
      shippingCost,
      tax,
      shippingZone,
      voucherFileName: voucherFile?.name
    });
  };

  return (
    <div className="bg-background min-h-screen text-on-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16 lg:py-24">
        
        {cart.length === 0 ? (
          <div className="text-center py-16 sm:py-24 bg-white border border-outline-variant/30 p-6 sm:p-8 max-w-md mx-auto space-y-4">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto animate-pulse" />
            <h2 className="font-serif text-lg sm:text-xl text-on-surface">Tu bolso está vacío</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Agregue elixires faciales de nuestra colección selecta para iniciar el ritual de compra.
            </p>
            <button
              onClick={onBackToCatalog}
              className="py-3 px-6 sm:px-8 bg-on-surface text-white text-[10px] uppercase tracking-widest font-bold hover:bg-primary transition-colors cursor-pointer"
            >
              Ver Colecciones
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 flex flex-col gap-8 text-left">
              
              {/* Personal Information */}
              <section>
                <header className="mb-6">
                  <h2 className="font-serif text-xl text-on-surface mb-2 font-light">Información Personal</h2>
                  <p className="text-xs text-on-surface-variant">Detalles para contactarte sobre tu orden.</p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-outline mb-2" htmlFor="fullName">
                      Nombre Completo
                    </label>
                    <input
                      required
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Maria Silva"
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 text-sm font-sans text-on-surface focus:ring-0 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-outline mb-2" htmlFor="phone">
                      Teléfono Móvil
                    </label>
                    <input
                      required
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+52 123 456 7890"
                      type="tel"
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 text-sm font-sans text-on-surface focus:ring-0 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <header className="mb-6">
                  <h2 className="font-serif text-2xl text-on-surface mb-2 font-light">Dirección de Envío</h2>
                  <p className="text-xs text-on-surface-variant">Asegure la precisión del domicilio para resguardo exprés.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-outline mb-2" htmlFor="address">
                      Dirección Completa
                    </label>
                    <input
                      required
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, Número, Colonia"
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 text-sm font-sans text-on-surface focus:ring-0 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-outline mb-2" htmlFor="city">
                      Ciudad
                    </label>
                    <input
                      required
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Santo Domingo"
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 text-sm font-sans text-on-surface focus:ring-0 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-outline mb-2" htmlFor="zip">
                      Código Postal
                    </label>
                    <input
                      required
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="00000"
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 text-sm font-sans text-on-surface focus:ring-0 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <header className="mb-6">
                  <h2 className="font-serif text-2xl text-on-surface mb-2 font-light">Método de Pago</h2>
                  <p className="text-xs text-on-surface-variant">Selecciona cómo prefieres liquidar tu ritual.</p>
                </header>
                <div className="flex flex-col gap-4">
                  
                  {/* Option 1: COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`cursor-pointer w-full p-6 border rounded-xl flex items-center transition-all duration-300 ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant bg-transparent hover:border-outline'
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary mr-6">
                      <Truck className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-[11px] font-semibold tracking-wider text-on-surface uppercase mb-1">Pago Contra Entrega</h3>
                      <p className="text-xs text-on-surface-variant max-w-lg leading-relaxed font-light">
                        Abona en efectivo o tarjeta al momento de recibir tu paquete en casa.
                      </p>
                    </div>
                    <div className="relative w-6 h-6 ml-4 flex items-center justify-center">
                      {paymentMethod === 'cod' ? (
                        <CheckCircle className="w-6 h-6 text-primary fill-primary/10" />
                      ) : (
                        <Circle className="w-6 h-6 text-outline-variant" />
                      )}
                    </div>
                  </div>

                  {/* Option 2: Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod('transfer')}
                    className={`cursor-pointer w-full p-6 border rounded-xl flex items-center transition-all duration-300 ${
                      paymentMethod === 'transfer'
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant bg-transparent hover:border-outline'
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary mr-6">
                      <Landmark className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-[11px] font-semibold tracking-wider text-on-surface uppercase mb-1">Transferencia Bancaria</h3>
                      <p className="text-xs text-on-surface-variant max-w-lg leading-relaxed font-light">
                        Realiza tu pago vía transferencia bancaria.
                      </p>
                    </div>
                    <div className="relative w-6 h-6 ml-4 flex items-center justify-center">
                      {paymentMethod === 'transfer' ? (
                        <CheckCircle className="w-6 h-6 text-primary fill-primary/10" />
                      ) : (
                        <Circle className="w-6 h-6 text-outline-variant" />
                      )}
                    </div>
                  </div>

                </div>

              </section>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-low/60 backdrop-blur-2xl rounded-xl p-6 border border-white/40 shadow-sm text-left sticky top-8">
                <h2 className="font-serif text-lg text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
                  Resumen del Pedido
                </h2>

                {/* Items list */}
                <div className="flex flex-col gap-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-16 h-20 bg-surface-variant rounded flex-shrink-0 overflow-hidden border border-outline-variant/20">
                        <img
                          alt={item.product.name}
                          className="w-full h-full object-cover mix-blend-multiply opacity-90"
                          src={item.product.image}
                        />
                      </div>
                      <div className="flex-grow pt-1 text-left">
                        <h4 className="font-serif text-sm text-on-surface leading-tight mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-outline uppercase tracking-wider mb-1">
                          {item.product.size}
                        </p>
                        <div className="text-xs text-on-surface font-sans">
                          {item.quantity} x {convertAndFormatPrice(item.product.price, selectedCountryCode)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-2 mb-6 text-sm">
                  <div className="flex justify-between text-on-surface-variant font-sans text-xs">
                    <span>Subtotal</span>
                    <span className="text-on-surface">{convertAndFormatPrice(subtotal, selectedCountryCode)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-sans text-xs">
                    <span>Impuestos (18%)</span>
                    <span className="text-on-surface">{convertAndFormatPrice(tax, selectedCountryCode)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-sans text-xs">
                    <span>Envío - {shippingZone}</span>
                    <span className="text-on-surface">{convertAndFormatPrice(shippingCost, selectedCountryCode)}</span>
                  </div>
                  <div className="flex justify-between text-lg text-on-surface font-serif mt-3 pt-3 border-t border-outline-variant/30 font-medium">
                    <span>Total</span>
                    <span className="text-on-surface font-semibold">{convertAndFormatPrice(finalTotal, selectedCountryCode)}</span>
                  </div>
                </div>

                {/* CTA Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container py-3 px-4 rounded-lg font-semibold text-xs tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm cursor-pointer"
                >
                  <span>Confirmar y Generar Orden</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[11px] text-center text-outline mt-4 leading-relaxed font-sans font-light">
                  Tus datos personales se utilizarán para procesar tu pedido y mejorar tu experiencia.
                </p>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
