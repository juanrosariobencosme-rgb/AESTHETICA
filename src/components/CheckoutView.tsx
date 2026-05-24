import { useState, FormEvent } from 'react';
import { ShoppingBag, ArrowRight, Truck, Landmark, Circle, CheckCircle } from 'lucide-react';
import { CartItem, ShippingSettings, BankAccount } from '../types';
import { convertAndFormatPrice } from '../utils/currency';

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
  selectedCountryCode = 'MX'
}: CheckoutViewProps) {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [voucherFile, setVoucherFile] = useState<File | null>(null);

  const districtKeywords = /(distrito|santo domingo|distrito nacional|dn)/i;
  const shippingZone = districtKeywords.test(`${address} ${city}`) ? 'Distrito' : 'Fuera del Distrito';
  const shippingCost = shippingZone === 'Distrito'
    ? shippingSettings?.districtRate ?? 200
    : shippingSettings?.outsideRate ?? 350;
  const taxRate = 0.18;
  const subtotal = total;
  const tax = Math.round(subtotal * taxRate);
  const finalTotal = subtotal + tax + shippingCost;

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
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8 sm:gap-12 lg:gap-16 text-left">
              
              {/* Personal Information */}
              <section>
                <header className="mb-6 sm:mb-10">
                  <h2 className="font-serif text-xl sm:text-2xl text-on-surface mb-2 font-light">Información Personal</h2>
                  <p className="text-xs text-on-surface-variant">Detalles para contactarte sobre tu orden.</p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10">
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
                <header className="mb-10">
                  <h2 className="font-serif text-2xl text-on-surface mb-2 font-light">Dirección de Envío</h2>
                  <p className="text-xs text-on-surface-variant">Asegure la precisión del domicilio para resguardo exprés.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
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
                      placeholder="Ciudad de México"
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
                <header className="mb-10">
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
                        Realiza tu pago vía SPEI. Te proporcionaremos las instrucciones al finalizar.
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

                {paymentMethod === 'transfer' && (
                  <section>
                    <header className="mb-6">
                      <h2 className="font-serif text-xl text-on-surface mb-2 font-light">Comprobante de Transferencia</h2>
                      <p className="text-xs text-on-surface-variant">Adjunta tu comprobante para completar el pedido con mayor rapidez.</p>
                    </header>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setVoucherFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-sm text-on-surface"
                      />
                      {voucherFile && (
                        <p className="text-[11px] text-on-surface-variant">
                          Archivo seleccionado: <span className="font-medium text-on-surface">{voucherFile.name}</span>
                        </p>
                      )}
                    </div>
                  </section>
                )}
              </section>

            </div>

            {/* Right Column: Order Summary (Glassmorphism) */}
            <div className="lg:col-span-5 mt-12 lg:mt-0 lg:sticky lg:top-32">
              <div className="bg-surface-container-low/60 backdrop-blur-2xl rounded-2xl p-8 md:p-10 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] text-left">
                <h2 className="font-serif text-xl text-on-surface mb-8 border-b border-outline-variant/30 pb-4">
                  Resumen del Pedido
                </h2>

                {/* Items list */}
                <div className="flex flex-col gap-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-20 h-24 bg-surface-variant rounded flex-shrink-0 overflow-hidden border border-outline-variant/20">
                        <img
                          alt={item.product.name}
                          className="w-full h-full object-cover mix-blend-multiply opacity-90"
                          src={item.product.image}
                        />
                      </div>
                      <div className="flex-grow pt-1 text-left">
                        <h4 className="font-serif text-[18px] text-on-surface leading-tight mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-outline uppercase tracking-wider mb-2">
                          {item.product.size}
                        </p>
                        <div className="text-sm text-on-surface font-sans">
                          {item.quantity} x {convertAndFormatPrice(item.product.price, selectedCountryCode)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="border-t border-outline-variant/30 pt-6 flex flex-col gap-3 mb-8 text-sm">
                  <div className="flex justify-between text-on-surface-variant font-sans">
                    <span>Subtotal</span>
                    <span className="text-on-surface">{convertAndFormatPrice(subtotal, selectedCountryCode)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-sans">
                    <span>Impuestos (18%)</span>
                    <span className="text-on-surface">{convertAndFormatPrice(tax, selectedCountryCode)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-sans">
                    <span>Envío - {shippingZone}</span>
                    <span className="text-on-surface">{convertAndFormatPrice(shippingCost, selectedCountryCode)}</span>
                  </div>
                  <div className="flex justify-between text-[20px] text-on-surface font-serif mt-4 pt-4 border-t border-outline-variant/30 font-medium">
                    <span>Total</span>
                    <span className="text-on-surface font-semibold">{convertAndFormatPrice(finalTotal, selectedCountryCode)}</span>
                  </div>
                </div>

                {/* CTA Submit Button */}
                {paymentMethod === 'transfer' && bankAccount && (
                  <div className="mb-6 rounded-2xl border border-outline-variant/40 bg-surface-container px-5 py-4 text-sm text-on-surface-variant">
                    <p className="font-semibold text-on-surface mb-2">Detalles de Pago</p>
                    <p className="text-xs leading-relaxed">
                      Banco: <span className="font-medium text-on-surface">{bankAccount.bankType}</span>
                    </p>
                    <p className="text-xs leading-relaxed">
                      Cuenta: <span className="font-medium text-on-surface">{bankAccount.accountNumber}</span>
                    </p>
                    <p className="text-xs leading-relaxed">
                      Titular: <span className="font-medium text-on-surface">{bankAccount.beneficiary}</span>
                    </p>
                    {bankAccount.clabe && (
                      <p className="text-xs leading-relaxed">
                        CLABE: <span className="font-medium text-on-surface">{bankAccount.clabe}</span>
                      </p>
                    )}
                    <p className="text-xs leading-relaxed mt-2">
                      Envía tu comprobante y finalizaremos la verificación en breve.
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container py-4 px-6 rounded font-semibold text-xs tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm cursor-pointer"
                >
                  <span>Confirmar y Generar Orden</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[12px] text-center text-outline mt-6 leading-relaxed font-sans font-light">
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
