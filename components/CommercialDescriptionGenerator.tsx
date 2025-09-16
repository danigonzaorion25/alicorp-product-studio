import React, { useState } from 'react';
import { generateCommercialDescription } from '../services/geminiService';
import type { Product } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

// Define las propiedades que el componente espera recibir.
interface Props {
    product: Product; // El producto generado en el paso anterior.
    onDescriptionGenerated: (description: string) => void; // Callback para notificar al padre.
}

/**
 * Componente para el Paso 2: Generar la descripción comercial.
 * Utiliza el producto del paso 1 para generar un texto de marketing.
 */
const CommercialDescriptionGenerator: React.FC<Props> = ({ product, onDescriptionGenerated }) => {
    // --- ESTADO ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null); // Almacena la descripción generada.

    /**
     * Maneja el clic en el botón de generar.
     * Llama al servicio de la API con los datos del producto y actualiza el estado.
     */
    const handleGenerate = async () => {
        setLoading(true);
        setError(null);

        try {
            const description = await generateCommercialDescription(product);
            setResult(description);
            onDescriptionGenerated(description); // Notifica al componente padre.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZACIÓN ---
    return (
        <div className="w-full">
            <p className="text-gray-500 mb-4">Ahora, genera un texto de marketing atractivo para tu producto.</p>
            
            {/* Muestra el nombre del producto base que se está utilizando. */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                 <h3 className="text-md font-bold text-gray-700">Producto Base:</h3>
                 <p className="text-gray-800 font-semibold">{product.nombreProducto}</p>
            </div>

            {/* El botón de generar solo se muestra si no está cargando. */}
            {!loading && (
                <button
                    onClick={handleGenerate}
                    className="w-full bg-[#EF3340] text-white font-bold py-3 px-4 rounded-full hover:bg-[#D72C3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF3340] disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                    {/* El texto del botón cambia si ya existe un resultado. */}
                    {result ? 'Volver a Generar Descripción' : 'Generar Descripción'}
                </button>
            )}

            {/* Muestra el spinner de carga y un mensaje contextual. */}
            {loading && (
                <div className="text-center p-6">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Creando un spot publicitario irresistible...</p>
                </div>
            )}
            
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {/* Muestra el resultado en una tarjeta si la generación fue exitosa y no está cargando. */}
            {result && !loading && (
                <div className="mt-6">
                    <ResultCard title="Descripción Comercial Generada">
                        <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
                    </ResultCard>
                </div>
            )}
        </div>
    );
};

export default CommercialDescriptionGenerator;
