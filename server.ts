import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client for optimal resilience
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it to Settings > Secrets in AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Aesthetica AI Skincare Advisor Prompt & Products Context
const SYSTEM_PROMPT = `
Eres la principal Curadora de Rituales de Piel en "AESTHETICA Skin Studio", un atelier de belleza y cuidado facial premium de "lujo silencioso".
Tus respuestas deben reflejar un tono sumamente sofisticado, íntimo, empático, culto y profesional. Hablas español de forma poética y refinada.
Tu misión es diagnosticar el tipo de piel del usuario y sugerir un ritual diario meticulosamente detallado utilizando EXCLUSIVAMENTE los productos de la colección de AESTHETICA:

1. **Lumière Dorée (Golden Glow Radiance Elixir)** ($145 USD, 50ml): Sérum iluminador y tensor con péptidos de azafrán y micro-infusiones de oro de 24k. Ideal para piel apagada, falta de firmeza y luminosidad.
2. **Aura Essentials (Jasmine Cleansing Balm-Cream)** ($82 USD, 100ml): Limpiadora en bálsamo suntuosa de jazmín y aceite de rosa mosqueta. Limpia en profundidad sin agredir la barrera cutánea. Ideal para todo tipo de pieles, especialmente secas o sensibles.
3. **Hydro-Plump Nectar (Triple Molecular Alpine Serum)** ($110 USD, 30ml): Sérum ultrahidratante con agua de glaciar suizo y ácido hialurónico triple peso molecular. Ideal para deshidratación extrema y líneas de expresión.
4. **Aurum Velvet (Squalane & Gold Face Cream)** ($160 USD, 50ml): Crema confort con escualano, ceramidas y copos de oro de 24k en envase airless. Repara barrera, esculpe y sella humedad.
5. **Nectar de Soleil (Luminous Restorative Treatment Oil)** ($135 USD, 30ml): Aceite facial seco reparador con semilla de higo chumbo y néctar de marula. Ideal de noche para calmar rojeces, sequedad extrema o fatiga.

Lineamientos de respuesta:
- Al recibir el perfil de piel, haz un breve análisis de su estado físico-emocional (por ejemplo, relacionando su estilo de vida, edad y clima).
- Diseña un Ritual de Mañana (Rutina AM) y un Ritual de Noche (Rutina PM) paso a paso, explicando poéticamente por qué ese producto de AESTHETICA beneficiará sus necesidades y cómo aplicarlo físicamente (gong, presiones, masajes tensores).
- Mantén el formato impecable y elegante usando subtítulos hermosos en Markdown (por ejemplo: *El Análisis de tu Lienzo*, *El Ritual del Amanecer (AM)*, *El Retiro del Crepúsculo (PM)*, *Consejos del Atelier*).
- Anima al usuario a hacer cualquier pregunta sobre la aplicación o las texturas de los productos.
- Si el usuario menciona problemas que no son de piel o productos que no pertenecen al catálogo de AESTHETICA, redirígelos amablemente hacia la experiencia sensorial de nuestra marca.
`;

// AI Advisor API Endpoint
app.post("/api/advisor", async (req, res) => {
  try {
    const { profile, chatHistory } = req.body;
    
    // Check if key exists
    let client;
    try {
      client = getGeminiClient();
    } catch (err: any) {
      // Graceful fallback response when API key is missing
      return res.status(200).json({
        text: `### El Portal de Diagnóstico Aesthetica está listo

Estimado buscador de belleza, nuestro **Asesor de Rituales AI** está preparado para diseñar su régimen personalizado de cuidado cutáneo. 

Para activar esta experiencia enriquecida con inteligencia artificial, asegúrese de guardar su **GEMINI_API_KEY** en el panel de **Secrets** de AI Studio. 

*Mientras tanto, disfrute de nuestra refinada selección:*
Para una piel normal a seca, le aconsejamos iniciar su mañana con **Aura Essentials** para purificar, seguido de la caricia de **Lumière Dorée** y sellar con la crema **Aurum Velvet**. En la noche, incorpore 3 gotas de **Nectar de Soleil** para un descanso celular sublime.`
      });
    }

    // Format chat prompt
    let prompt = `Perfil del Creador de Ritual:\n`;
    if (profile) {
      prompt += `- Nombre: ${profile.name || "Invitado"}\n`;
      prompt += `- Edad: ${profile.age || "No especificada"}\n`;
      prompt += `- Tipo de Piel: ${profile.skinType}\n`;
      prompt += `- Preocupación Principal: ${profile.primaryConcern}\n`;
      prompt += `- Clima de Residencia: ${profile.climate || "Templado"}\n`;
      prompt += `- Estilo de Vida: ${profile.lifestyle || "Activo"}\n\n`;
    }
    
    prompt += `Historial de Conversación Reciente:\n`;
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((msg: any) => {
        prompt += `${msg.sender === 'user' ? 'Usuario' : 'Atelier AI'}: ${msg.text}\n`;
      });
    } else {
      prompt += `(Inicio de la consulta sensorial)\n`;
    }

    prompt += `\nCuradora del Atelier, por favor responde al usuario basándote en su perfil actual o su última inquietud. Mantén el tono lujoso, poético, profesional y orienta la recomendación a nuestros elixires.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Lo lamento, no hemos podido conectar con el Atelier sensorial en este momento. Inténtelo en breve.";
    res.json({ text: responseText });

  } catch (error: any) {
    console.error("Error in AI Skincare Advisor endpoint:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor del atelier.", message: error.message });
  }
});

// Setup Vite Development / Static Production Middleware
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aesthetica luxury server running on port ${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start Aesthetica server:", err);
});
