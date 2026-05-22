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
                className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 hover:border-[#C5A880] transition-all flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 border border-[#EADCC9]/50 shadow-xs"
                title="Síguenos en Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href={socials.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 hover:border-[#C5A880] transition-all flex items-center justify-center bg-[#1877F2] border border-[#EADCC9]/50 shadow-xs"
                title="Síguenos en Facebook"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href={`https://wa.me/${socials.whatsAppPhone}?text=${encodeURIComponent(socials.whatsAppText)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 hover:border-[#C5A880] transition-all flex items-center justify-center bg-[#25D366] border border-[#EADCC9]/50 shadow-xs"
                title="WhatsApp Directo"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 48 48">
                  <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
                  <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
                  <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
                  <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
                  <path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
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
