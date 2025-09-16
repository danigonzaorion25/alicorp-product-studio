import React, { useState, useEffect } from 'react';
import { generateProductVideo } from '../services/geminiService';
import type { Product } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

// Define las propiedades que el componente espera recibir.
interface Props {
    product: Product;
    commercialDesc: string;
    generatedImages: string[];
    onVideoGenerated: (videoUrl: string) => void;
}

// Mensajes de carga específicos para la generación de video, que es un proceso más largo.
const loadingMessages = [
    "Iniciando la producción del spot...",
    "Buscando locaciones en Perú y contratando al equipo...",
    "Renderizando la primera escena... Este proceso puede tardar unos minutos.",
    "Añadiendo efectos de postproducción y color...",
    "Masterizando el audio con ritmos latinos...",
    "¡Tu video publicitario está casi listo para el gran estreno!"
];

/**
 * Componente para el Paso 4: Generar un video publicitario.
 * Utiliza el producto y la descripción para crear un spot con IA.
 */
const VideoGenerator: React.FC<Props> = ({ product, commercialDesc, generatedImages, onVideoGenerated }) => {
    // --- ESTADO ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

    // --- EFECTOS (Hooks) ---
    // Efecto para ciclar los mensajes de carga mientras se genera el video.
    useEffect(() => {
        let intervalId: number;
        if (loading) {
            intervalId = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 5000); // Cambia el mensaje cada 5 segundos.
        }
        return () => clearInterval(intervalId);
    }, [loading]);

    // Efecto para limpiar la URL del objeto y evitar fugas de memoria.
    useEffect(() => {
        // Se ejecuta cuando el componente se desmonta o cuando videoUrl cambia.
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);

    /**
     * Maneja el clic en el botón de generar video.
     * Llama al servicio de la API y gestiona el estado.
     */
    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
            // Usa la primera imagen generada como referencia visual para el video.
            const referenceImage = generatedImages[0];
            const videoBlob = await generateProductVideo(product, commercialDesc, referenceImage);
            // Crea una URL local para el blob de video que el navegador puede reproducir.
            const objectUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(objectUrl);
            onVideoGenerated(objectUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZACIÓN ---
    return (
        <div className="w-full">
            <p className="text-gray-500 mb-4">Da vida a tu producto con un spot publicitario corto y dinámico.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <h3 className="text-md font-bold text-gray-700 mb-1">Brief para Video: {product.nombreProducto}</h3>
                <p className="text-gray-600 text-sm italic">Generando un video con temática peruana, juvenil y veraniega.</p>
            </div>

            {!loading && (
                <button
                    onClick={handleGenerate}
                    className="w-full bg-[#EF3340] text-white font-bold py-3 px-4 rounded-full hover:bg-[#D72C3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF3340] disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                    {videoUrl ? 'Volver a Generar Video' : 'Generar Video'}
                </button>
            )}
            
            {loading && (
                <div className="text-center p-6">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600 animate-pulse">{loadingMessage}</p>
                    <p className="mt-2 text-sm text-gray-500">(La generación de video puede tomar varios minutos, por favor no cierres esta ventana)</p>
                </div>
            )}
            
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {videoUrl && !loading && (
                <div className="mt-6">
                    <ResultCard title="Video Publicitario Generado">
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            muted
                            loop
                            className="w-full rounded-lg shadow-md"
                            aria-label={`Video publicitario para ${product.nombreProducto}`}
                        >
                            Tu navegador no soporta el tag de video.
                        </video>
                    </ResultCard>
                </div>
            )}
        </div>
    );
};

export default VideoGenerator;