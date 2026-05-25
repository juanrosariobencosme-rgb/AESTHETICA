import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ClipboardCopy, Send, CloudUpload, FileCheck, Download } from 'lucide-react';
import { CartItem } from '../types';
import { convertAndFormatPrice } from '../utils/currency';
import jsPDF from 'jspdf';

interface OrderSuccessViewProps {
  orderInfo: { name: string; email: string; paymentMethod: string; finalTotal: number; items?: CartItem[] } | null;
  onReturnHome: () => void;
  selectedCountryCode?: string;
  whatsAppPhone?: string;
  enableAnimations?: boolean;
}

export default function OrderSuccessView({ 
  orderInfo, 
  onReturnHome,
  selectedCountryCode = 'DO',
  whatsAppPhone = '18294855693',
  enableAnimations = false
}: OrderSuccessViewProps) {
  const [copied, setCopied] = useState(false);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const orderNumber = "AES-84920";
  const clabeNumber = "012 345 6789 0123 4567";

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(clabeNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(42, 38, 33);
    doc.text('AESTHETICA ATELIER', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(125, 117, 105);
    doc.text('Atelier Skin Lab SA de CV', 20, 28);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Orden: #${orderNumber}`, 150, 20);
    doc.text(new Date().toLocaleDateString(), 150, 28);
    
    // Line separator
    doc.setDrawColor(234, 220, 201);
    doc.line(20, 35, 190, 35);
    
    // Customer info
    doc.setFontSize(12);
    doc.setTextColor(42, 38, 33);
    doc.text('Cliente', 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(orderInfo?.name || 'Cliente Distinguido', 20, 58);
    doc.text(orderInfo?.email || 'N/A', 20, 65);
    
    // Payment method
    doc.setFontSize(12);
    doc.setTextColor(42, 38, 33);
    doc.text('Método de Pago', 120, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const paymentStr = orderInfo?.paymentMethod === 'cod' ? 'Pago Contra Entrega' : 'Transferencia Bancaria';
    doc.text(paymentStr, 120, 58);
    
    // Products
    doc.setFontSize(12);
    doc.setTextColor(42, 38, 33);
    doc.text('Productos', 20, 80);
    
    let yPosition = 90;
    items.forEach((item, index) => {
      const isRealItem = 'product' in item;
      const name = isRealItem ? item.product.name : item.name;
      const price = isRealItem ? item.product.price : item.price;
      
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`${index + 1}. ${name}`, 20, yPosition);
      doc.text(convertAndFormatPrice(price, selectedCountryCode), 150, yPosition);
      
      yPosition += 8;
    });
    
    // Totals
    doc.setDrawColor(234, 220, 201);
    doc.line(20, yPosition + 5, 190, yPosition + 5);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(125, 117, 105);
    doc.text('Subtotal:', 120, yPosition);
    doc.text(convertAndFormatPrice(subtotal, selectedCountryCode), 150, yPosition);
    
    yPosition += 8;
    doc.text('Envío:', 120, yPosition);
    doc.text(convertAndFormatPrice(shippingCost, selectedCountryCode), 150, yPosition);
    
    yPosition += 8;
    doc.setFontSize(12);
    doc.setTextColor(42, 38, 33);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 120, yPosition);
    doc.text(convertAndFormatPrice(total, selectedCountryCode), 150, yPosition);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(125, 117, 105);
    doc.setFont(undefined, 'normal');
    doc.text('Este ticket representa un comprobante formal de adquisición molecular dermatológica.', 20, 270);
    doc.text('Gracias por preferir el Atelier Aesthetica.', 20, 275);
    
    // Save PDF
    doc.save(`Factura_${orderNumber}.pdf`);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setVoucherFile(file);
    setUploading(true);
    setUploadSuccess(false);

    // High quality mock upload state
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
    }, 1200);
  };

  // Determine items to render: dynamic checkout items or the fallback listed in HTML
  const hasDynamicItems = orderInfo?.items && orderInfo.items.length > 0;
  
  const items = hasDynamicItems && orderInfo?.items ? orderInfo.items : [
    { name: 'The Luminous Serum', price: 2450, isFallback: true },
    { name: 'Purifying Cleansing Ritual', price: 1100, isFallback: true }
  ];

  const subtotal = hasDynamicItems && orderInfo?.items
    ? orderInfo.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : 3550;

  const shippingCost = hasDynamicItems ? 150 : 0;
  const total = subtotal + shippingCost;

  // Real-time detailed WhatsApp message assembling
  const itemsText = items.map((item) => {
    const isRealItem = 'product' in item;
    const name = isRealItem ? item.product.name : item.name;
    const qty = isRealItem ? item.quantity : 1;
    const price = isRealItem ? item.product.price : item.price;
    return `• ${name} (x${qty}) - ${convertAndFormatPrice(price * qty, selectedCountryCode)}`;
  }).join('\n');

  const paymentStr = orderInfo?.paymentMethod || 'Transferencia Bancaria';
  
  const orderMsg = `⚜️ *NUEVA ORDEN AESTHETICA - COMPRA* ⚜️\n\n` +
    `• *Orden:* #${orderNumber}\n` +
    `• *Cliente:* ${orderInfo?.name || 'Cliente Distinguido'}\n` +
    `• *Email:* ${orderInfo?.email || 'N/A'}\n` +
    `• *Método:* ${paymentStr}\n\n` +
    `*PRODUCTOS ADQUIRIDOS:*\n${itemsText}\n\n` +
    `• *Envío:* ${convertAndFormatPrice(shippingCost, selectedCountryCode)}\n` +
    `• *Total:* ${convertAndFormatPrice(total, selectedCountryCode)}\n\n` +
    `Por favor, procedan con la entrega de mis elixires.`;

  const whatsappUrl = `https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(orderMsg)}`;

  return (
    <div className="bg-background min-h-screen text-on-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16 lg:py-24 flex flex-col items-center">
        
        {/* Success Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#d2e9cd]/30 text-[#4f644e] mb-4 sm:mb-6">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-3 sm:mb-4 font-normal tracking-wide leading-tight">
            Orden Generada con Éxito
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed">
            Gracias por tu preferencia. Tu número de orden es <strong className="text-primary tracking-wider font-semibold">#{orderNumber}</strong>.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Supermarket Receipt Invoice Format */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            
            {/* Aesthetic Supermarket Thermal Ticket */}
            <div className="bg-[#FAF9F5] border border-stone-300 shadow-md p-6 relative font-mono text-xs text-[#2A2621] rounded-xs overflow-hidden select-none">
              
              {/* Thermal receipt header pattern */}
              <div className="border-t-[3px] border-double border-stone-400 mb-4" />

              {/* Store Identity */}
              <div className="text-center space-y-1 mb-6">
                <h3 className="font-serif text-lg font-bold tracking-widest text-[#2A2621]">AESTHETICA ⚜️</h3>
                <p className="text-[9px] text-stone-500">RITUALS & MOLECULAR LAB</p>
                <p className="text-[9px] text-stone-500">AV. CHURCHILL PLAZA LAS AMERICAS I</p>
                <p className="text-[9px] text-stone-500">SANTO DOMINGO, REPUBLICA DOMINICANA</p>
                <p className="text-[9px] text-stone-500">TEL: +1 (809) 526-1115</p>
                <p className="text-[9px] text-stone-500">RNC: 1-31-89753-2</p>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-stone-400 my-4" />

              {/* Transaction Metadata */}
              <div className="space-y-1 text-[10px] text-stone-600">
                <div className="flex justify-between">
                  <span>FECHA: {new Date().toLocaleDateString('es-DO')}</span>
                  <span>HORA: {new Date().toLocaleTimeString('es-DO', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div className="flex justify-between">
                  <span>TRANS: #0084920</span>
                  <span>CAJA: REG-01</span>
                </div>
                <div className="flex justify-between font-bold text-stone-800">
                  <span>CLIENTE: {orderInfo?.name.toUpperCase() || 'CLIENTE DISTINGUIDO'}</span>
                </div>
                <div className="flex justify-between text-[8px] mt-1 text-[#725a37] font-semibold">
                  <span>TICKET NO: COMPROBANTE DE CONSUMO</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-stone-400 my-4" />

              {/* Items Table Header */}
              <div className="grid grid-cols-12 gap-1 text-[10px] font-bold text-stone-700 tracking-wider pb-1">
                <span className="col-span-6 text-left">DETALLE</span>
                <span className="col-span-2 text-center">CANT</span>
                <span className="col-span-4 text-right">TOTAL</span>
              </div>
              <div className="border-t border-dashed border-stone-400 mb-2" />

              {/* Transaction Items */}
              <div className="space-y-3.5 text-[10px]">
                {items.map((item, idx) => {
                  const isRealItem = 'product' in item;
                  const name = isRealItem ? item.product.name : item.name;
                  const price = isRealItem ? item.product.price : item.price;
                  const qty = isRealItem ? item.quantity : 1;
                  const itemTotal = price * qty;
                  return (
                    <div key={idx} className="grid grid-cols-12 gap-1 items-start text-stone-800">
                      <div className="col-span-6 flex flex-col text-left">
                        <span className="font-semibold leading-tight">{name.toUpperCase()}</span>
                        <span className="text-[9px] text-stone-400">{convertAndFormatPrice(price, selectedCountryCode)} c/u</span>
                      </div>
                      <span className="col-span-2 text-center self-center">{qty}</span>
                      <span className="col-span-4 text-right self-center font-semibold">
                        {convertAndFormatPrice(itemTotal, selectedCountryCode)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-stone-400 my-4" />

              {/* Financial calculations */}
              <div className="space-y-1.5 text-[10px] text-stone-700">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>{convertAndFormatPrice(subtotal, selectedCountryCode)}</span>
                </div>
                <div className="flex justify-between">
                  <span>COSTO DE ENVIO:</span>
                  <span>{convertAndFormatPrice(shippingCost, selectedCountryCode)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 border-t border-double border-stone-500 pt-2 text-xs">
                  <span>TOTAL FACTURADO:</span>
                  <span>{convertAndFormatPrice(total, selectedCountryCode)}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-stone-400 my-4" />

              {/* Payment Info */}
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-stone-800">
                  METODO DE PAGO: {(orderInfo?.paymentMethod || 'TRANSFERENCIA BANCARIA').toUpperCase()}
                </p>
                <p className="text-[8px] text-stone-400 leading-tight">
                  SOPORTE DE COMPROMISO: TRANSFERENCIA DIRECTA. ADJUNTE EL TICKET DE TRANSFERENCIA ABAJO.
                </p>
              </div>

              {/* Barcode aesthetic decoration */}
              <div className="flex flex-col items-center justify-center mt-6 space-y-1">
                <div className="w-full h-10 bg-white border border-stone-200 flex items-center justify-around px-2 py-1 opacity-80">
                  <span className="block w-[1.5px] h-full bg-stone-950"></span>
                  <span className="block w-[3px] h-full bg-stone-950"></span>
                  <span className="block w-[1px] h-full bg-stone-950"></span>
                  <span className="block w-[2px] h-full bg-stone-950"></span>
                  <span className="block w-[1px] h-full bg-stone-950"></span>
                  <span className="block w-[4px] h-full bg-stone-950"></span>
                  <span className="block w-[1.5px] h-full bg-stone-950"></span>
                  <span className="block w-[1px] h-full bg-stone-950"></span>
                  <span className="block w-[3px] h-full bg-stone-950"></span>
                  <span className="block w-[1.5px] h-full bg-stone-950"></span>
                  <span className="block w-[1px] h-full bg-stone-950"></span>
                  <span className="block w-[2px] h-full bg-stone-950"></span>
                  <span className="block w-[1.5px] h-full bg-stone-950"></span>
                </div>
                <span className="text-[8px] tracking-widest text-stone-500 font-mono">*AES-84920-DO*</span>
              </div>

              {/* Thank you note */}
              <div className="text-center mt-6 text-[9px] text-stone-400 leading-normal">
                <p>*** BIENVENIDO AL CANAL DE SEDA ***</p>
                <p>CONSERVE ESTE RECIBO DE COMPRA</p>
                <p>GRACIAS POR SU PREFERENCIA</p>
              </div>

            </div>

          </div>

          {/* Right Column: Payment Instructions & Upload */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            <div className="bg-[#f0ede9] sm:bg-surface-container rounded-xl p-8 md:p-12 text-left flex flex-col h-full">
              
              <div className="mb-10">
                <h2 className="font-serif text-2xl md:text-3xl text-primary mb-2 font-light">
                  Transferencia Bancaria
                </h2>
                <p className="text-sm text-[#7D7569] font-light leading-relaxed">
                  Para procesar tu envío, por favor realiza la transferencia a la siguiente cuenta y adjunta tu comprobante.
                </p>
              </div>

              {/* Bank Details List */}
              <div className="bg-[#fcf9f4] rounded-lg p-6 mb-10 border border-[#d1c5b7]/20 shadow-xs relative">
                
                {/* Visual Clipboard Copy trigger */}
                <button
                  type="button"
                  onClick={handleCopyClabe}
                  className="absolute top-4 right-4 text-[10px] text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer font-semibold tracking-wider font-sans uppercase"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-left">
                  <div>
                    <dt className="text-[10px] uppercase font-bold text-outline tracking-wider mb-1">Banco</dt>
                    <dd className="text-on-surface font-sans font-medium">Banco Premium S.A.</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase font-bold text-outline tracking-wider mb-1">Beneficiario</dt>
                    <dd className="text-on-surface font-sans font-medium">Aesthetica Rituals S.A. de C.V.</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] uppercase font-bold text-outline tracking-wider mb-1">CLABE Interbancaria</dt>
                    <dd className="font-serif text-xl sm:text-2xl text-primary tracking-wider mt-1 select-all font-light">
                      {clabeNumber}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Upload Zone */}
              <div className="flex-grow flex flex-col justify-end">
                <h3 className="text-[11px] uppercase font-semibold text-outline tracking-widest mb-4">
                  Comprobante de Pago (Opcional)
                </h3>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] relative overflow-hidden transition-all duration-300 group ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : uploadSuccess
                      ? 'border-emerald-600/60 bg-secondary/5'
                      : 'border-outline hover:border-primary bg-[#fcf9f4] hover:bg-primary/5'
                  }`}
                  id="drop-zone"
                >
                  <input
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                    className="hidden"
                    type="file"
                  />

                  <AnimatePresence mode="wait">
                    {!voucherFile && !uploading && (
                      <motion.div
                        key="idle"
                        initial={enableAnimations ? { opacity: 0 } : undefined}
                        animate={enableAnimations ? { opacity: 1 } : undefined}
                        exit={enableAnimations ? { opacity: 0 } : undefined}
                        className="flex flex-col items-center"
                      >
                        <CloudUpload className="text-4xl text-outline mb-3 group-hover:text-primary transition-colors stroke-[1.3]" />
                        <p className="text-xs sm:text-sm text-on-surface-variant font-light font-sans">
                          Arrastra y suelta tu archivo aquí, o <span className="text-primary underline decoration-1 underline-offset-4 cursor-pointer font-medium">explora</span>
                        </p>
                        <p className="text-[10px] text-outline mt-2 font-sans font-light">JPG, PNG o PDF (Max. 5MB)</p>
                      </motion.div>
                    )}

                    {uploading && (
                      <motion.div
                        key="loading"
                        initial={enableAnimations ? { opacity: 0 } : undefined}
                        animate={enableAnimations ? { opacity: 1 } : undefined}
                        className="flex flex-col items-center space-y-2"
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-t-primary border-outline-variant animate-spin" />
                        <p className="text-xs text-on-surface-variant font-sans font-medium">Procesando comprobante...</p>
                      </motion.div>
                    )}

                    {uploadSuccess && (
                      <motion.div
                        key="success"
                        initial={enableAnimations ? { opacity: 0 } : undefined}
                        animate={enableAnimations ? { opacity: 1 } : undefined}
                        className="flex flex-col items-center"
                      >
                        <FileCheck className="text-3xl text-secondary mb-2 stroke-[1.5]" />
                        <p className="text-xs text-on-surface font-sans font-medium max-w-[80%] truncate">
                          {voucherFile?.name}
                        </p>
                        <p className="text-[10px] text-secondary font-mono tracking-wide mt-1 uppercase font-bold">Carga Completa</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA Action button - ALWAYS ENABLES DIRECT SENDING OF ORDERS */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={generatePDF}
                    className="flex-1 py-4 px-6 rounded-full font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 font-semibold bg-stone-800 text-white hover:bg-stone-700 cursor-pointer hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Descargar Factura PDF</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="flex-1 py-4 px-6 rounded-full font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 font-semibold bg-[#25D366] text-white hover:bg-[#20ba5a] cursor-pointer hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    id="wa-button"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>Enviar vía WhatsApp</span>
                  </button>
                </div>

                {/* Return home back trigger */}
                <div className="mt-8 text-center">
                  <button
                    onClick={onReturnHome}
                    className="text-xs uppercase tracking-widest text-[#7D7569] font-bold border-b border-outline/30 pb-1 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                  >
                    Regresar al Inicio
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
