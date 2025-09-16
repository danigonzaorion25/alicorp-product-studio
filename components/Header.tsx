// Fix: Created Header component which was previously empty.
import React from 'react';
import { MenuIcon } from './Icons'; // Importa el nuevo ícono de menú.

// Propiedades que el componente espera.
interface HeaderProps {
    onToggleSidebar: () => void; // Callback para comunicar el clic al componente App.
}

/**
 * Componente de la cabecera de la aplicación.
 * Ahora incluye un botón para controlar la barra lateral y otros elementos de la UI.
 */
const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    return (
        <header className="h-20 bg-white border-b border-gray-200 flex-shrink-0 flex items-center justify-between px-6">
            {/* Contenedor para el botón de menú y otros elementos futuros */}
            <div className="flex items-center">
                 <button 
                    onClick={onToggleSidebar} 
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="Toggle sidebar" // Mejora la accesibilidad
                >
                    <MenuIcon />
                </button>
            </div>
            
            {/* Sección del usuario */}
             <div className="flex items-center space-x-4">
                <p className="text-sm font-medium text-gray-600">Bienvenido</p>
            </div>
        </header>
    );
};

export default Header;