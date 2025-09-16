import React, { useState, useEffect } from 'react';
import { generateProductImages } from '../services/geminiService';
import type { Product } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

// Define las propiedades que el componente espera recibir.
interface Props {
    product: Product;
    commercialDesc: string;
    onImagesGenerated: (images: string[]) => void;
}

// Array de mensajes para mostrar durante el proceso de carga, mejorando la experiencia del usuario.
const loadingMessages = [
    "Preparando las cámaras para la sesión de fotos...",
    "Buscando la mejor luz en la playa...",
    "Renderizando los pixeles más refrescantes...",
    "Añadiendo el toque final de verano...",
    "¡Casi listo! Las imágenes están quedando geniales."
];

/**
 * Componente para el Paso 3: Generar imágenes publicitarias.
 * Utiliza el producto y la descripción para crear visuales con IA.
 */
const ImageGenerator: React.FC<Props> = ({ product, commercialDesc, onImagesGenerated }) => {
    // --- ESTADO ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]); // Almacena las imágenes generadas en base64.
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]); // Mensaje de carga actual.

    // --- EFECTOS (Hooks) ---
    // Este efecto se encarga de ciclar los mensajes de carga mientras loading es true.
    useEffect(() => {
        let intervalId: number;
        if (loading) {
            intervalId = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 4000); // Cambia el mensaje cada 4 segundos.
        }
        // Limpia el intervalo cuando el componente se desmonta o loading cambia a false.
        return () => clearInterval(intervalId);
    }, [loading]);

    /**
     * Maneja el clic en el botón de generar imágenes.
     * Llama al servicio de API y gestiona el estado de carga y resultados.
     */
    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const generatedImages = await generateProductImages(product, commercialDesc);
            setImages(generatedImages);
            onImagesGenerated(generatedImages); // Notifica al padre que las imágenes están listas.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZACIÓN ---
    return (
        <div className="w-full">
            <p className="text-gray-500 mb-4">Finalmente, crea imágenes impactantes con temática de verano para tus campañas.</p>

            {/* Muestra un resumen del brief creativo que se usará para generar las imágenes. */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                 <h3 className="text-md font-bold text-gray-700 mb-1">Brief Creativo para: {product.nombreProducto}</h3>
                 <p className="text-gray-600 text-sm italic">"{commercialDesc.substring(0, 150)}..."</p>
            </div>

            {/* Botón de generación, no visible durante la carga. */}
            {!loading && (
                 <button
                    onClick={handleGenerate}
                    className="w-full bg-[#EF3340] text-white font-bold py-3 px-4 rounded-full hover:bg-[#D72C3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF3340] disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                    {images.length > 0 ? 'Volver a Generar Imágenes' : 'Generar Imágenes'}
                </button>
            )}
            
            {/* Estado de carga con el mensaje dinámico. */}
            {loading && (
                <div className="text-center p-6">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600 animate-pulse">{loadingMessage}</p>
                </div>
            )}
            
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {/* Muestra las imágenes generadas en una cuadrícula cuando están listas. */}
            {images.length > 0 && !loading && (
                <div className="mt-6">
                    <ResultCard title="Imágenes Publicitarias Generadas">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {images.map((imgB64, index) => (
                                <img
                                    key={index}
                                    src={`data:image/jpeg;base64,${imgB64}`} // Muestra la imagen desde el string base64.
                                    alt={`Imagen publicitaria generada para ${product.nombreProducto} ${index + 1}`}
                                    className="rounded-lg shadow-md w-full h-auto object-cover"
                                />
                            ))}
                        </div>
                    </ResultCard>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;