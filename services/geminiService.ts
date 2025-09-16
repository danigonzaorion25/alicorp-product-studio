// Importaciones necesarias desde el SDK de @google/genai y los tipos de la aplicación.
import { GoogleGenAI, Type } from "@google/genai";
import type { Product, SentimentWord } from '../types';

// Verificación de seguridad para asegurar que la clave de API esté configurada.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

// Inicializa el cliente de la API de Google GenAI con la clave de API.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Llama a la API de Gemini para generar una idea de producto basada en una entrada de texto.
 * @param idea - La idea inicial proporcionada por el usuario.
 * @returns Una promesa que se resuelve con un objeto de tipo Product.
 */
export const generateProductIdea = async (idea: string): Promise<Product> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Modelo de lenguaje utilizado.
            contents: `Actúa como un experto en marketing e innovación de la industria alimentaria en Perú. Basado en la siguiente idea: '${idea}', genera un concepto de producto innovador y detallado para el mercado peruano. Responde en español.`,
            config: {
                responseMimeType: "application/json", // Solicita la respuesta en formato JSON.
                // Define el esquema que la respuesta JSON debe seguir.
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nombreProducto: { type: Type.STRING, description: "Nombre comercial del producto." },
                        descripcion: { type: Type.STRING, description: "Descripción detallada del producto, su sabor, textura y propuesta de valor." },
                        ingredientesClave: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 3-5 ingredientes clave, preferiblemente peruanos." },
                        publicoObjetivo: { type: Type.STRING, description: "Descripción del público objetivo principal." }
                    },
                    required: ["nombreProducto", "descripcion", "ingredientesClave", "publicoObjetivo"]
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Product; // Parsea la respuesta de texto a un objeto Product.
    } catch (error) {
        console.error("Error al generar idea de producto:", error);
        throw new Error("No se pudo generar la idea del producto. Inténtalo de nuevo.");
    }
};

/**
 * Llama a la API de Gemini para generar una descripción comercial para un producto dado.
 * @param product - El objeto del producto para el cual se generará la descripción.
 * @returns Una promesa que se resuelve con el texto de la descripción comercial.
 */
export const generateCommercialDescription = async (product: Product): Promise<string> => {
    try {
        // Prompt detallado que guía al modelo para crear el texto publicitario.
        const prompt = `Actúa como un redactor publicitario experto para el mercado peruano. Para el siguiente producto:
        - Nombre: '${product.nombreProducto}'
        - Descripción: '${product.descripcion}'
        Crea una descripción comercial potente y atractiva dirigida a jóvenes (18-25 años). El tono debe ser fresco, moderno y enérgico, usando jerga peruana sutil y apropiada. La descripción debe ser versátil para un spot de TV de 30 segundos, una descripción de e-commerce y posts para redes sociales. Resalta sus fortalezas y por qué es ideal para el verano. Responde únicamente con el texto de la descripción en español.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        // Fix: Added missing opening brace for the catch block.
        console.error("Error al generar descripción comercial:", error);
        throw new Error("No se pudo generar la descripción comercial. Inténtalo de nuevo.");
    }
};

/**
 * Llama a la API de Imagen para generar imágenes publicitarias de un producto.
 * @param product - El producto a visualizar.
 * @param commercialDesc - La descripción comercial que sirve de inspiración.
 * @returns Una promesa que se resuelve con un array de strings de imágenes en base64.
 */
export const generateProductImages = async (product: Product, commercialDesc: string): Promise<string[]> => {
    try {
        // Prompt que describe la escena, estilo y elementos visuales deseados para las imágenes.
        const prompt = `Crea una imagen publicitaria fotorrealista para un nuevo producto alimenticio peruano llamado '${product.nombreProducto}'. La descripción es: '${commercialDesc}'. La escena es una vibrante playa peruana durante el verano. Un grupo de jóvenes atractivos y diversos se ríe y disfruta del producto. La imagen debe ser de alta calidad, con colores vivos y una iluminación cálida de atardecer. El producto debe ser el punto focal, luciendo delicioso y refrescante. Estilo perfecto para un panel publicitario en un centro comercial y redes sociales como Instagram. La composición debe ser dinámica y llena de energía positiva. Opcionalmente, puedes integrar sutilmente textos publicitarios cortos y atractivos en español, como el nombre del producto o un eslogan corto como 'El sabor del verano'.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001', // Modelo específico para generación de imágenes.
            prompt: prompt,
            config: {
                numberOfImages: 2, // Genera 2 imágenes por llamada.
                outputMimeType: 'image/jpeg', // Formato de la imagen de salida.
                aspectRatio: '16:9', // Relación de aspecto panorámica.
            },
        });
        
        // Mapea la respuesta para extraer los datos de imagen en base64.
        return response.generatedImages.map(img => img.image.imageBytes);

    } catch (error) {
        console.error("Error al generar imágenes:", error);
        throw new Error("No se pudieron generar las imágenes. Inténtalo de nuevo.");
    }
};

/**
 * Llama a la API de Veo para generar un video publicitario de un producto.
 * @param product - El producto a promocionar.
 * @param commercialDesc - La descripción comercial que inspira el video.
 * @param productImageB64 - La imagen en base64 del producto para usar como referencia.
 * @returns Una promesa que se resuelve con un Blob que contiene los datos del video.
 */
export const generateProductVideo = async (product: Product, commercialDesc: string, productImageB64: string): Promise<Blob> => {
    try {
        const prompt = `Actúa como un director de comerciales experto para el mercado peruano. Tu misión es crear un video publicitario de 15 segundos para el producto '${product.nombreProducto}'.

**Instrucciones Clave:**
1.  **Producto Principal:** El video DEBE centrarse en mostrar el producto. Utiliza la imagen del empaque proporcionada como referencia visual EXACTA para el producto que aparece en el video. El producto debe verse delicioso y ser el héroe de cada toma.
2.  **Contexto:** La escena debe ser vibrante y moderna, mostrando el producto tal como se describe: '${commercialDesc}'. Evita escenas con muchas personas; el foco es el producto en sí.
3.  **Texto en Pantalla:** La ÚNICA frase que debe aparecer en el video es el nombre del producto: '${product.nombreProducto}'. Este texto debe estar escrito correctamente en español y aparecer de forma clara y atractiva al final del video. No incluyas ninguna otra palabra o frase.
4.  **Estilo:** El video debe tener un estilo cinematográfico, con colores vivos y una iluminación atractiva que resalte las características del producto. La música de fondo debe ser moderna y enérgica. No incluyas diálogos hablados.`;

        let operation = await ai.models.generateVideos({
            model: 'veo-3.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: productImageB64,
                mimeType: 'image/jpeg',
            },
            config: {
                numberOfVideos: 1,
            },
        });

        // El proceso de generación de video es asíncrono. Debemos sondear el estado.
        while (!operation.done) {
            // Espera 10 segundos antes de volver a verificar.
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("La operación finalizó, pero no se encontró el enlace de descarga del video.");
        }

        // Obtiene los bytes del video desde el enlace de descarga.
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Error al descargar el video: ${videoResponse.statusText}`);
        }
        
        return await videoResponse.blob(); // Devuelve los datos del video como un Blob.

    } catch (error) {
        console.error("Error al generar el video:", error);
        throw new Error("No se pudo generar el video. Por favor, inténtalo de nuevo.");
    }
};

/**
 * Genera recomendaciones estratégicas basadas en el feedback de sentimiento.
 * @param positiveWords - Array de palabras positivas más frecuentes.
 * @param negativeWords - Array de palabras negativas más frecuentes.
 * @returns Una promesa que se resuelve con un objeto de recomendaciones.
 */
export const generateFeedbackRecommendations = async (
    positiveWords: SentimentWord[],
    negativeWords: SentimentWord[]
): Promise<any> => {
    try {
        // Prompt mejorado para solicitar un análisis más profundo y accionable.
        const prompt = `Actúa como un director de producto y estratega de marketing de alto nivel para Alicorp en Perú. Se ha realizado un análisis de sentimiento del feedback de clientes en redes sociales.

        **Datos Clave del Feedback:**
        - **Principales Fortalezas (Palabras Positivas):** ${positiveWords.map(p => `'${p.word}' (frecuencia: ${p.frequency})`).join(', ')}.
        - **Principales Debilidades (Palabras Negativas):** ${negativeWords.map(n => `'${n.word}' (frecuencia: ${n.frequency})`).join(', ')}.

        Basado en estos datos, genera un informe estratégico extremadamente detallado y accionable para los equipos de Marketing y Producto. El objetivo es crear una ventaja competitiva tangible. Responde exclusivamente en español.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // Esquema de respuesta refinado para exigir más detalle y estructura.
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planDeAccion: {
                            type: Type.STRING,
                            description: "Un plan de acción detallado y accionable. Formatea la respuesta OBLIGATORIAMENTE como una lista de viñetas (cada punto iniciando con '*' o '-'). Cada punto debe ser un paso claro y concreto. Ejemplo: '* Lanzar campaña en TikTok con influencers de comida enfocada en lo 'refrescante'. * Iniciar proyecto de rediseño de empaque para mejorar la 'apertura fácil', con 3 prototipos en 60 días.'"
                        },
                        analisisCompetencia: {
                            type: Type.STRING,
                            description: "Un análisis específico de 1-2 productos competidores clave en Perú. Formatea la respuesta OBLIGATORIAMENTE como una lista de viñetas (cada punto iniciando con '*' o '-'). Menciona el producto, la empresa y su estrategia. Ejemplo: '* Producto 'Y frugos del Valle' de Coca-Cola: aborda el feedback de 'demasiado dulce' con su línea sin azúcar.'"
                        },
                        tiempoImplementacion: {
                            type: Type.STRING,
                            description: "Una estimación del tiempo de implementación desglosada por fases. Formatea la respuesta OBLIGATORIAMENTE como una lista de viñetas (cada punto iniciando con '*' o '-'). Ejemplo: '* Fase 1 (Investigación y Marketing): 1-3 meses. * Fase 2 (Rediseño de Empaque y Prototipos): 4-6 meses. * Fase 3 (Lanzamiento y Monitoreo): 6-9 meses.'"
                        }
                    },
                    required: ["planDeAccion", "analisisCompetencia", "tiempoImplementacion"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error al generar recomendaciones de feedback:", error);
        throw new Error("No se pudieron generar las recomendaciones. Inténtalo de nuevo.");
    }
};
