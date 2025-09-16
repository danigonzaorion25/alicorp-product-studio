import React from 'react';
import { ArrowLeftIcon } from './Icons';

// Define las propiedades que el componente espera.
interface BackButtonProps {
    onClick: () => void; // Función que se ejecuta al hacer clic.
}

/**
 * Un botón de "Volver" reutilizable con un ícono de flecha.
 * Aunque no se usa en el flujo actual de una sola página, es útil para futuras navegaciones.
 */
const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors mb-4 text-sm font-medium"
        >
            <ArrowLeftIcon />
            <span>Volver</span>
        </button>
    );
};

export default BackButton;
