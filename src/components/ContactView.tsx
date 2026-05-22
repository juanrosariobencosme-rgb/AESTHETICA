import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Check } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [socials, setSocials] = useState({
    whatsAppPhone: '18294855693',
    whatsAppText: 'Hola Aesthetica, quisiera hacer una consulta sobre sus elixires.',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com'
  });

  useEffect(() => {
    const saved = localStorage.getItem('aesthetica_socials');
    if (saved) {
      try {
        setSocials(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSending(true);

    // Format the text message for WhatsApp
    const waText = `Atelier AESTHETICA ⚜️\n\nNueva consulta de contacto:\n• *Nombre:* ${name}\n• *Email:* ${email}\n• *Teléfono:* ${phone || 'No especificado'}\n\n*Mensaje:*\n"${message}"`;
    const waUrl = `https://wa.me/${socials.whatsAppPhone}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Mimic real high fidelity delivery locally
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="bg-background py-16 min-h-screen text-on-background relative overflow-hidden">
      
      {/* Intro Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 px-4">
        <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">
          Atelier Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-light text-on-surface tracking-wide">
          Contacto
        </h1>
        <div className="h-[1.5px] w-20 bg-primary-container mx-auto mt-4" />
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
          Estamos aquí para ayudarte. Descubre el arte del cuidado, contáctanos.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Contact info */}
        <section className="flex flex-col gap-12 text-left lg:pr-12">
          
          <div>
            <h2 className="font-serif text-2xl text-primary font-light mb-2">¿Tienes alguna pregunta?</h2>
            <div className="h-[1px] w-12 bg-outline-variant/50 mt-4" />
          </div>

          <div className="flex flex-col gap-8">
            
            {/* WhatsApp */}
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary/10">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-semibold tracking-widest text-primary uppercase mb-1">WhatsApp</h3>
                <p className="text-sm font-sans font-medium text-on-surface-variant transition-colors group-hover:text-primary">
                  8294855693
                </p>
                <p className="text-xs text-outline font-light mt-0.5">Respuesta inmediata</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary/10">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-semibold tracking-widest text-primary uppercase mb-1">Email</h3>
                <p className="text-sm font-sans font-medium text-on-surface-variant transition-colors group-hover:text-primary">
                  ventas@bbrfragrance.es
                </p>
                <p className="text-xs text-outline font-light mt-0.5">Respuesta en menos de 12h</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary/10">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-semibold tracking-widest text-primary uppercase mb-1">Teléfono</h3>
                <p className="text-sm font-sans font-medium text-on-surface-variant transition-colors group-hover:text-primary">
                  +1 809 526 1115
                </p>
                <p className="text-xs text-outline font-light mt-1 max-w-sm leading-relaxed">
                  Lun-Vie: 10AM-6:30PM | Sab: 10AM-6PM | Dom: Cerrado
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary/10 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-semibold tracking-widest text-primary uppercase mb-1">Ubicación</h3>
                <p className="text-sm font-sans font-medium text-on-surface-variant leading-relaxed max-w-sm">
                  Av. Winston Churchill, esq. Roberto P., Plaza las Americas 1 local 10AA, Santo Domingo, R.D.
                </p>
                <p className="text-xs text-outline font-light mt-1">Santo Domingo, R.D.</p>
              </div>
            </div>

          </div>

          {/* Socials Link handles */}
          <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#2A2621]">SÍGUENOS</h3>
            <div className="flex gap-4">
              <a 
                href={socials.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 hover:border-[#C5A880] transition-all flex items-center justify-center bg-white border border-[#EADCC9]/50 shadow-xs"
                title="Síguenos en Instagram"
              >
                <svg className="w-5 h-5 text-[#8a3ab9]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a 
                href={socials.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 hover:border-[#C5A880] transition-all flex items-center justify-center bg-white border border-[#EADCC9]/50 shadow-xs"
                title="Síguenos en Facebook"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href={`https://wa.me/${socials.whatsAppPhone}?text=${encodeURIComponent(socials.whatsAppText)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 hover:border-[#C5A880] transition-all flex items-center justify-center bg-white border border-[#EADCC9]/50 shadow-xs"
                title="WhatsApp Directo"
              >
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965-1.862-1.864-4.335-2.889-6.972-2.89-5.442 0-9.866 4.372-9.87 9.802 0 2.011.528 3.978 1.533 5.74l-.946 3.458 3.548-.921zM17.13 15.3c-.278-.14-.1.65-.63.95-.53.3-1.06-.11-2.45-.66-1.57-.62-2.61-2.2-2.69-2.3-.08-.1-1.39-1.85-1.39-3.53 0-1.68.87-2.51 1.18-2.85.3-.34.68-.43.9-.43H12.9c.2 0 .46.07.7.63.24.56.83 2.01.9 2.15.07.14.12.3.02.5-.1.2-.22.42-.37.59-.15.17-.31.35-.45.5-.15.17-.31.35-.45.5-.15.15-.3.31-.13.6.17.29.77 1.27 1.65 2.06.9.8 1.66 1.05 1.96 1.19.3.14.47.12.65-.08.18-.2.77-.9 1.15-1.2.38-.3.76-.25 1.02-.15s1.65.78 1.93.92c.28.14.46.21.53.33.07.12.07.7-.21 1.53-.28.83-1.6 1.62-2.22 1.66-.62.04-.61.03-.9-.05z" />
                </svg>
              </a>
            </div>
          </div>

        </section>

        {/* Right Column: Contact form with glowing glass elements */}
        <section className="lg:pl-8">
          <div className="bg-surface-container-low/80 backdrop-blur-xl p-8 md:p-12 border border-outline-variant/30 rounded-xl relative overflow-hidden text-left shadow-xs">
            
            {/* Ambient decorative glowing element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <h2 className="font-serif text-2xl text-primary font-light mb-10">Envíanos un mensaje</h2>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSendMessage}
                  className="flex flex-col gap-8 relative z-10"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="name">
                      Nombre
                    </label>
                    <input
                      required
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-sm focus:outline-none focus:border-primary focus:ring-0 transition-all text-on-surface"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="email">
                      Email
                    </label>
                    <input
                      required
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-sm focus:outline-none focus:border-primary focus:ring-0 transition-all text-on-surface"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="phone">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-sm focus:outline-none focus:border-primary focus:ring-0 transition-all text-on-surface"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="message">
                      Mensaje
                    </label>
                    <textarea
                      required
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="¿En qué podemos ayudarte?"
                      className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 text-sm resize-none focus:outline-none focus:border-primary focus:ring-0 transition-all text-on-surface"
                    />
                  </div>

                  {/* Primary submit CTA button */}
                  <button
                    disabled={sending}
                    type="submit"
                    className="mt-6 bg-primary-container text-on-primary-container font-semibold text-xs tracking-widest uppercase py-4 px-8 rounded flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all duration-300 w-full group cursor-pointer"
                  >
                    <span>{sending ? 'Enviando...' : 'Enviar mensaje'}</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[1.5]" />
                  </button>

                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/5 p-8 text-center border border-primary/20 space-y-4"
                >
                  <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl text-primary font-medium">Card Entregada</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Hemos capturado sus indicaciones con éxito. Un Concierge de AESTHETICA estudiará su consulta para responderle en el menor lapso posible.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary pb-0.5"
                  >
                    Enviar nueva carta
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

      </div>

    </div>
  );
}
