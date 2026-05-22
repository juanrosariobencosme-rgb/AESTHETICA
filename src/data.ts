import { Product, Editorial, Testimonial } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'lumiere-doree',
    name: 'Lumière Dorée',
    subtitle: 'Golden Glow Radiance Elixir',
    description: 'An architectural serum powered by rare saffron peptides and 24k gold micro-infusions. Restores multi-dimensional radiance and smooths skin structure with a velvety, light-reflective glow.',
    price: 145.00,
    size: '50 ml',
    ingredients: ['24k Gold Peptides', 'Rare Saffron Extract', 'Camellia Seed Oil', 'Squalane', 'Niacinamide 5%'],
    benefits: ['Illuminates dull complexions instantly', 'Firms and re-architects skin contour', 'Deeply hydrates with no greasy residue'],
    usage: 'Warm 3-4 drops between palms. Gently press into cleansed face and neck morning and night prior to your cream.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=1000',
    concern: 'radiance',
    rating: 4.9,
    texture: 'Silk-liquid elixir with gold micro-shimmer'
  },
  {
    id: 'aura-essentials',
    name: 'Aura Essentials',
    subtitle: 'Jasmine Cleansing Balm-Cream',
    description: 'A decadent skin-purifying balm that emulsifies into a cushiony milk. Infused with absolute jasmine and cold-pressed rosehip seed oil to dissolve pollution and sebum while keeping the skin barrier intact.',
    price: 82.00,
    size: '100 ml',
    ingredients: ['Jasmine Butter', 'Rosehip Seed Oil', 'Sweet Almond Extract', 'Vitamin E', 'Centella Asiatica'],
    benefits: ['Melts heavy makeup and impurities', 'Nourishes and replenishes dry skin cells', 'Leaves skin incredibly soft and calmed'],
    usage: 'Massage a hazelnut-sized amount onto dry skin. Add warm water to emulsify into a milky cream, then rinse thoroughly.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000',
    concern: 'calm',
    rating: 4.8,
    texture: 'Whipped butter melting into rich floral oil-milk'
  },
  {
    id: 'hydro-plump',
    name: 'Hydro-Plump Nectar',
    subtitle: 'Triple Molecular Alpine Serum',
    description: 'Our proprietary hydration vector containing triple-weight hyaluronic acids and mineralised Swiss glacier water. Captures moisture to instantly cushion fine lines and restore density.',
    price: 110.00,
    size: '30 ml',
    ingredients: ['Triple Hyaluronic Acid', 'Swiss Glacier Water', 'Red Algae Mineral complex', 'Panthenol B5'],
    benefits: ['Intense 72-hour deep cell hydration', 'Fills dehydration lines with visible bounce', 'Supports native ceramide production'],
    usage: 'Apply morning and night to damp skin. Follow immediately with your face cream to seal in moisture.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000',
    concern: 'hydration',
    rating: 4.7,
    texture: 'Dewy hydro-gel nectar'
  },
  {
    id: 'aurum-velvet',
    name: 'Aurum Velvet',
    subtitle: 'Squalane & Gold Face Cream',
    description: 'A luxurious airless-pump cream that cocoons skin in absolute comfort. Formulated with saturated squalane, skin-identical ceramides, and pure gold flakes to lift, sculpt, and seal the protective cutaneous matrix.',
    price: 160.00,
    size: '50 ml',
    ingredients: ['Sugarcane Squalane 15%', 'Ceramide NP, AP, EOP', '24k Gold Flakes', 'Oat Beta Glucan', 'Bakuchiol'],
    benefits: ['Accelerates barrier recovery and elasticity', 'Lifts and smooths deep sagging contours', 'Soft focus real-gold skin finish'],
    usage: 'Dispense 1-2 pumps onto fingertips. Smooth over entire face in light upward long strokes.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000',
    concern: 'sculpt',
    rating: 4.9,
    texture: 'Cushiony and rich velvet soufflé'
  },
  {
    id: 'nectar-soleil',
    name: 'Nectar de Soleil',
    subtitle: 'Luminous Restorative Treatment Oil',
    description: 'A sensory infusion of 8 organic botanical oils designed for ultimate regeneration. Delivers deep nutrient synthesis with a dry satin finish, leaving the face with a radiant halo of golden light.',
    price: 135.00,
    size: '30 ml',
    ingredients: ['Prickly Pear Seed Oil', 'Marula Kernel Nectar', 'Squalane', 'Jojoba Extract', 'Frankincense Resin'],
    benefits: ['Reduces natural redness and signs of stress', 'Promotes overnight cellular renewal', 'Leaves a non-comedogenic satin dry sheen'],
    usage: 'Incorporate 2-3 drops into your nighttime moisturizer or press directly onto the skin as the closing ritual of your routine.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000',
    concern: 'radiance',
    rating: 4.8,
    texture: 'Ultra-lightweight dry oil'
  },
  {
    id: 'sublime-elixir-iris',
    name: 'Sublime Elixir Iris',
    subtitle: 'Absolute Purple Orchid & Iris Serum',
    description: 'A precious botanical nectar rich in active flavonoids from the purple Iris Pallida root cell culture. Instantly plumps sagging skin structure, fortifying the dermo-epidermal junction while surrounding you in the absolute fragrance of delicate blooming iris.',
    price: 125.00,
    size: '40 ml',
    ingredients: ['Active Iris Pallida Cell Extract', 'Purple Orchid Flavonoids', 'Vegan Collagen Liposomes', 'Coenzyme Q10'],
    benefits: ['Accelerates surface cell recovery', 'Re-densifies skin mattress architecture', 'Silky, satin finish veil of intense care'],
    usage: 'Smooth 3-4 drops morning and night over face and massage gently in sweeping upward movements.',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000',
    concern: 'sculpt',
    rating: 4.9,
    texture: 'Delicate milky-smooth amethyst emulsion'
  },
  {
    id: 'caviar-luxe-infusion',
    name: 'Caviar Luxe Infusion',
    subtitle: 'Reconstructive Cellular Marine Complex',
    description: 'An extraordinary marine complex fusing black sturgeon caviar DNA with botanical resurrection plant extracts. It helps deeply re-firm the face contour, smooth crepey skin textures, and neutralize modern environment fatigue.',
    price: 190.00,
    size: '50 ml',
    ingredients: ['Resynthesis Sturgeon Caviar Extract', 'Myrothamnus Flabellifolia (Resurrection Plant)', 'Amber Nectar Bio-ferment', 'Tetrapeptide-21'],
    benefits: ['Restores youth-density to sagging skin tissue', 'Promotes dynamic cellular oxygenation', 'Creates an immediately smoother cutaneous canvas'],
    usage: 'Apply a very small amount after your serum. Smooth from the center of the face outwards, finishing on the neck and décolleté.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=1000',
    concern: 'sculpt',
    rating: 5.0,
    texture: 'Rich, high-density nourishing crèm gel'
  },
  {
    id: 'botanique-mist-bioactive',
    name: 'Botanique Mist Bioactive',
    subtitle: 'Refreshing Micro-Emulsion Toner Mist',
    description: 'A lightweight bio-active cellular mist containing organic neroli flower hydrosol, witch hazel minerals, and white tea leaf extracts. Refreshes, purifies, and optimizes formula absorption of subsequent treatments.',
    price: 68.00,
    size: '120 ml',
    ingredients: ['Organic Neroli Hydrosol', 'White Tea Polyphenols', 'Cucumber Fruit Ferment', 'Aloe Vera Leaf juice'],
    benefits: ['Instantly calms environmental tight-dry feelings', 'Balancing pH levels for healthy biome', 'Prepares corneal cells for maximum serum integration'],
    usage: 'Mist generously over face and neck after cleansing, or at any time of day to revive tired, flight-bound skins.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000',
    concern: 'calm',
    rating: 4.6,
    texture: 'Ultra-fine vapor mist'
  }
];

export const EDITORIALS: Editorial[] = [
  {
    id: 'conscious-craft',
    title: 'Definidos por la Pureza',
    subtitle: 'CONSCIOUS CRAFT & SKIN SCIENCE',
    paragraph: 'Creemos en la arquitectura de la Piel. Formulados sin rellenos, parabenos ni perfumes sintéticos, cada fórmula de Aesthetica reconcilia la medicina ancestral con los compuestos bioactivos de última generación. Cosechamos de forma ética y destilamos con fría precisión para capturar la esencia vital de la naturaleza.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800'
  },
  {
    id: 'the-ritual',
    title: 'El Arte del Ritual Diario',
    subtitle: 'RITUAL OVER ROUTINE',
    paragraph: 'Nuestra filosofía aborda el cuidado como un momento de retiro meditativo. Al tomarnos cinco minutos cada mañana y noche para masajear y activar el flujo capilar, no sólo transformamos los niveles celulares de nuestra dermis, sino que establecemos un ancla de serenidad en el acelerado compás cotidiano.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'Lumière Dorée ha redibujado por completo la firmeza de mi piel. El tono apagado que solía tener por las mañanas ha sido reemplazado por un halo de luz natural que parece emanar desde el interior.',
    author: 'Isabella V.',
    role: 'Coleccionista de Arte, CDMX',
    glowResult: 'Luminosidad y Definición Restaurada'
  },
  {
    id: 'testimonial-2',
    quote: 'El consuelo que Aurum Velvet le da a mi piel sensible es indescriptible. Cruza la línea de un simple cosmético; se siente como una terapia de seda reconstructora que calma y esculpe mi rostro.',
    author: 'Montserrat H.',
    role: 'Diseñadora de Interiores, Guadalajara',
    glowResult: 'Barrera Cutánea Fortalecida'
  },
  {
    id: 'testimonial-3',
    quote: 'Gracias al Ritual Personalizado AI con el Nectar de Soleil, mis rojeces crónicas y deshidratación al fin se equilibraron. El diagnóstico de la app dio en el blanco de mis hábitos y clima.',
    author: 'Camila G.',
    role: 'Directora Editorial, Madrid',
    glowResult: 'Balance Integral e Hidratación Plena'
  }
];
