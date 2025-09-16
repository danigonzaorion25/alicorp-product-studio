import React, { useState } from 'react';
import { generateProductIdea } from '../services/geminiService';
import type { Product } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

// Define las propiedades que el componente espera recibir.
interface Props {
    onProductGenerated: (product: Product) => void; // Callback para notificar al componente padre.
}

/**
 * Componente para el Paso 1: Generar una idea de producto.
 * Contiene un formulario para que el usuario ingrese una idea inicial y muestra el resultado.
 */
const ProductIdeaGenerator: React.FC<Props> = ({ onProductGenerated }) => {
    // --- ESTADO ---
    const [idea, setIdea] = useState(''); // Almacena la idea de texto del usuario.
    const [loading, setLoading] = useState(false); // Indica si una llamada a la API está en curso.
    const [error, setError] = useState<string | null>(null); // Almacena mensajes de error.
    const [result, setResult] = useState<Product | null>(null); // Almacena el producto generado.

    /**
     * Maneja el envío del formulario.
     * Realiza validaciones, llama al servicio de la API y actualiza el estado.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario.
        // Validación simple para evitar envíos vacíos.
        if (!idea.trim()) {
            setError('Por favor, ingresa una idea para el producto.');
            return;
        }
        setLoading(true);
        setError(null);
        
        try {
            const product = await generateProductIdea(idea);
            setResult(product);
            onProductGenerated(product); // Notifica al componente padre con el nuevo producto.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZACIÓN ---
    return (
        <div className="w-full">
            <p className="text-gray-500 mb-4">Introduce una idea base y la IA creará un concepto de producto completo.</p>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                    Tu idea inicial (ej: "una bebida refrescante con frutas de la selva")
                </label>
                <textarea
                    id="idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Escribe tu idea aquí..."
                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#F35C68] focus:border-[#EF3340] transition duration-150 ease-in-out placeholder-gray-400"
                    rows={3}
                    disabled={loading}
                    aria-required="true"
                />
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-[#EF3340] text-white font-bold py-3 px-4 rounded-full hover:bg-[#D72C3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF3340] disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                    {/* El texto del botón cambia según el estado. */}
                    {loading ? <LoadingSpinner /> : (result ? 'Generar de Nuevo' : 'Generar Producto')}
                </button>
            </form>

            {/* Muestra un spinner y un mensaje mientras se genera el producto. */}
            {loading && !result && (
                 <div className="text-center p-6 mt-6">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Generando tu próximo producto estrella...</p>
                 </div>
            )}

            {/* Muestra la tarjeta de resultado cuando el producto ha sido generado. */}
            {result && (
                <div className="mt-6">
                    <ResultCard title="¡Producto Generado!">
                        <div className="space-y-4 text-left">
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">Nombre del Producto</h4>
                                <p className="text-gray-600">{result.nombreProducto}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">Descripción</h4>
                                <p className="text-gray-600">{result.descripcion}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">Ingredientes Clave</h4>
                                <ul className="list-disc list-inside text-gray-600">
                                    {result.ingredientesClave.map((ing, i) => <li key={i}>{ing}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">Público Objetivo</h4>
                                <p className="text-gray-600">{result.publicoObjetivo}</p>
                            </div>
                        </div>
                    </ResultCard>
                </div>
            )}
        </div>
    );
};

export default ProductIdeaGenerator;
