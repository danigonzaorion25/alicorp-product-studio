// Fix: Replaced placeholder content with a functional Sidebar component for navigation.
import React from 'react';
import { StudioIcon, SettingsIcon, FeedbackIcon } from './Icons'; // Importa el nuevo ícono
import type { Page } from '../types';

// Propiedades que el componente Sidebar espera recibir.
interface SidebarProps {
    currentPage: Page;
    onPageChange: (page: Page) => void;
    logo: string;
    isExpanded: boolean; // Nuevo prop para controlar el estado.
}

/**
 * Componente de la barra lateral de navegación.
 * Muestra el logotipo de la aplicación y los enlaces para cambiar de página.
 * Ahora es colapsable para ahorrar espacio en la pantalla.
 */
const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, logo, isExpanded }) => {
    // Define los elementos de navegación para que sea fácil de extender en el futuro.
    const navItems = [
        { id: 'studio', label: 'Product Studio', icon: <StudioIcon /> },
        { id: 'feedback', label: 'Feedback AI', icon: <FeedbackIcon /> }, // Añade la nueva página
        { id: 'settings', label: 'Configuración', icon: <SettingsIcon /> },
    ];

    return (
        <aside 
            className={`flex-col flex-shrink-0 hidden md:flex bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
                isExpanded ? 'w-64' : 'w-20' // La anchura cambia dinámicamente.
            }`}
        >
            {/* Sección del logotipo */}
            <div className="h-20 flex items-center justify-center border-b border-gray-200 px-4 overflow-hidden">
                <img 
                    src={logo} 
                    alt="Logo de la aplicación" 
                    className={`object-contain transition-all duration-300 ${isExpanded ? 'h-10 opacity-100' : 'h-8'}`}
                />
            </div>
            
            {/* Menú de navegación principal */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onPageChange(item.id as Page)}
                        // Las clases se ajustan para la vista colapsada (solo ícono y centrado).
                        className={`w-full flex items-center py-3 rounded-lg text-left text-gray-600 font-medium transition-colors ${
                            isExpanded ? 'space-x-3 px-4' : 'justify-center'
                        } ${
                            currentPage === item.id
                                ? 'bg-[#FEECEE] text-[#EF3340]'
                                : 'hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-current={currentPage === item.id ? 'page' : undefined}
                        title={isExpanded ? '' : item.label} // Tooltip para la vista colapsada.
                    >
                        {item.icon}
                        {/* El texto solo es visible si la barra está expandida. */}
                        {isExpanded && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
