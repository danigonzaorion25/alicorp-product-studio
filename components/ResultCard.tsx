import React from 'react';

// Define las propiedades del componente.
interface ResultCardProps {
    title: string; // El título que se mostrará en la parte superior de la tarjeta.
    children: React.ReactNode; // El contenido que se renderizará dentro de la tarjeta.
}

/**
 * Un componente de tarjeta reutilizable para mostrar los resultados generados por la IA.
 * Proporciona un contenedor estilizado y consistente para los datos de salida.
 */
const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
        <div>{children}</div>
    </div>
);

export default ResultCard;
