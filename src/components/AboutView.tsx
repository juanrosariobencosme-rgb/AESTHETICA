import { motion } from 'motion/react';
import { Shield, Sparkles, Droplet, Leaf, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onExploreCollection: () => void;
}

export default function AboutView({ onExploreCollection }: AboutViewProps) {
  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Serene minimalist background"
            className="w-full h-full object-cover opacity-50 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn5Q79f0EKR2I6-bOcQxTbhk7jXfJ_CN_xFaDyxgEevijgTrS00XqUkJWISxQbcWJEB89ShKMEUWFlWbIv6gMp-6qUmTaLYuwvXdVBPpOh0jMV5ofd__OwIvew35JyZ2xqVcvZD7X7qCnFLeyHzFxhoiCyO58CSeTtWkevGNME3LHFYI1wrvikvQ1OLo46KWTL45kyibWNPME66O4XPZH1XAxMYrlhg1aCVJU3edt85m-lSFfZILi5vrwRk2uqxItKx0xyT-STUDlb"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-12 space-y-6">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-bold">
            Nuestra Filosofía
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-primary tracking-wide leading-tight">
            El Arte del Ritual
          </h1>
          <p className="text-xs sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-light">
            AESTHETICA nació del deseo de destilar el cuidado de la piel hasta su esencia más pura. Creemos en el poder silencioso de los rituales diarios, fusionando la eficacia clínica con una visión estética intransigente.
          </p>
        </div>
      </section>

      {/* Purity & Science Section (Bento Grid Style) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 lg:col-start-2 space-y-8 text-left pr-0 lg:pr-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold">
              Pureza & Ciencia
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary leading-tight font-light">
              Definido por la pureza.<br />Refinado por la ciencia.
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed font-light">
              Nuestras formulaciones son un testimonio de moderación. Al eliminar lo superfluo, elevamos lo esencial. Cada ingrediente es seleccionado por su probada biocompatibilidad celular, obtenido de manera ética y equilibrado en perfecta armonía con la arquitectura natural de la dermis.
            </p>
            
            <ul className="space-y-6 pt-4">
              <li className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Shield className="w-5 h-5 stroke-[1.5]" />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-on-surface">Bioactivos Clínicos</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Complejos patentados diseñados para una entrega celular profunda y rejuvenecedora.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="w-5 h-5 stroke-[1.5]" />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-on-surface">Precisión Molecular</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Solo utilizamos extractos botánicos puros que ofrecen beneficios dermatológicos medibles.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 h-[500px] bg-surface-variant rounded-xl overflow-hidden relative group">
            <img
              alt="Minimalist laboratory beaker with clear serum"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo6q_MvoqccUbyFF834zgHfCJWDXItDZroJd67V6b3mHZ2YyX6tMVgiWFR1YRGG6AqKnSfH3AY-aStLdi5izUO0Ij0pxMaSV6U0t1LO8XTTIh5IhFFvZZEEHaeZ1w5huq4rh6CuJyz1WmvhSALDkKlvyi0mU_ZRLagnFnQhpG1qW4T0eGbMUM9k_-IUeEIL-etIylexro1aOBazaggS8HlwKLQik_9OBS3y6ou89WxHaYm56crTE9nxbqyA4C6EZQOVnVtnp0ZXAIQ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
          </div>

        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-surface-container-low px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 h-[420px] bg-surface-container rounded-xl overflow-hidden order-2 lg:order-1 relative border border-outline-variant/30">
            <img
              alt="Eco-friendly packaging"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaCGA29Rx4a4C9BFEDd5Rk81U7lzG8TMTBPII8m5RmcUAXGR8uqdPBSEhwrL9EB_QXJZIRou4nwMhrnChx37ffFtv009ys802qvoE7cF1PdRvbvnlhbtpQlQ4u0Nzt4rQvBA5s_JkIE3sILtAd4RzeApfpa4d4bsVMAfC-vVQ2t7WN3IXuexZLuW3PtG-reqqVu7pzBIa0npgqlYCbKpMeSb0zV2NYzTBKP8dlly_xLxPXx6SsD7gvVsJKcD_STDl-aDBnv9Cpj7gN"
            />
            {/* Glassmorphism Card Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-surface/90 backdrop-blur-md p-6 rounded-lg border border-white/40 text-left shadow-lg">
              <span className="inline-block px-3 py-1 bg-[#4f644e]/10 text-[#4f644e] text-[9px] uppercase tracking-wider rounded-full mb-3 font-semibold">
                Compromiso Bio
              </span>
              <h3 className="font-serif text-lg text-primary mb-1.5 font-medium">Impacto Cero</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                Nuestros envases de vidrio infinitamente reciclable y cartón libre de árboles aseguran que nuestra huella ecológica sea tan liviana como nuestras formulaciones.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-center order-1 lg:order-2 text-left space-y-6">
            <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Leaf className="w-6 h-6 stroke-[1.2]" />
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary font-light">
              Artesanía Consciente
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed font-light font-sans">
              El verdadero lujo no debe costar la salud de nuestro planeta. Nos aproximamos a la sostenibilidad no como una idea tardía, sino como un principio fundacional de nuestro diseño holístico. Desde el cultivo ético de botánicos hasta el embalaje térmico, cada decisión ambiental cuenta.
            </p>
            
            <button
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2 font-semibold text-[10px] text-primary uppercase tracking-widest border-b border-primary pb-1 w-max hover:opacity-75 transition-opacity cursor-pointer"
            >
              <span>Explorar Iniciativas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
