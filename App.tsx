// Fix: Replaced placeholder content with a functional App component to orchestrate the application.
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductIdeaGenerator from './components/ProductIdeaGenerator';
import CommercialDescriptionGenerator from './components/CommercialDescriptionGenerator';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator'; // Importa el nuevo componente
import Settings from './components/Settings';
import FeedbackAI from './components/FeedbackAI'; // Importa la nueva página
import type { Page, Product } from './types';

// Logotipo de Alicorp en formato SVG (Data URL) para no depender de archivos externos.
const defaultLogo = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJsb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNzAiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIwMCA3MCI+ICA8ZGVmcz4gICAgPHN0eWxlPiAgICAgIC5jbHMtMSB7ICAgICAgICBmaWxsOiAjZmYzMjMzOyAgICAgIH0gICAgICAuY2xzLTEsIC5jbHMtMiB7ICAgICAgICBzdHJva2Utd2lkdGg6IDBweDsgICAgICB9ICAgICAgLmNscy0yIHsgICAgICAgIGZpbGw6ICM4MWI3MjU7ICAgICAgfSAgICA8L3N0eWxlPiAgPC9kZWZzPiAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTg0LDI0Yy00LjIsMC02LjgsMS41LTguNiw1LjVoMH YtNC45aC0xMi4xdjM3LjZoMTN2LTE0LjNoLjFjMiwyLjgsNC42LDQuMSw4LjEsNC4xLDguMSwwLDExLjQtNi4zLDExLjQtMTMuNnMtMy4xLTE0LjUtMTEuOC0xNC41Wk0xNzkuMSw0NC4xYy0yLjksMC0zLjMtMi44LTMuMy01LjlzLjQtNS41LDMuMi01LjUsMy4zLDMsMy4zLDUuOC0uNSw1LjYtMy4yLDUuNloiLz4gIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEwMC43LDM3LjZjMCw5LjMsNS44LDE0LjUsMTYuNywxNC41czE2LjctNS4yLDE2LjctMTQuNXMtNS45LTEzLjYtMTYuNy0xMy42LTE2LjcsNC41LTE2LjcsMTMuNk0xMTQuNSwzNy42YzAtMy4yLC4zLTUuOCwyLjgtNS44czIuOSwyLjYsMi45LDUuOC0uMyw2LjgtMi45LDYuOC0yLjgtMi45LTIuOC02LjgiLz4gIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTk5LjEsNDIuOGMtMS44LDEuMS0zLjcsMS42LTYsMS42LTMuOSwwLTYuNS0yLjQtNi41LTYuNnMyLjYtNiw2LjUtNiw0LjIuNiw1LjgsMS4zdi03LjljLTIuNy0uOC01LjUtMS4yLTkuNC0xLjItMTAuOSwwLTE2LjYsNC41LTE2LjYsMTMuNXM1LjgsMTQuNSwxNi42LDE0LjUsNi44LS40LDkuNi0xLjR2LThaIi8+ICA8Zz4gICAgPHJlY3QgY2xhc3M9ImNscy0xIiB4PSI1Ni45IiB5PSIyNC43IiB3aWR0aD0iMTMiIGhlaWdodD0iMjYuOCIvPiAgICA8cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjU2LjkiIHk9IjEyLjkiIHdpZHRoPSIxMyIgaGVpZ2h0PSI4LjkiLz4gIDwvZz4gIDxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMzkuMiIgeT0iMTIuOSIgd2lkdGg9IjEzIiBoZWlnaHQ9IjM4LjYiLz4gIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTIzLjgsMjEuOWwxMC45LDIuMnMuOC0xMC42LTExLTE0LjJsLTExLTIuMnMwLDEyLjYsMTEsMTQuMiIvPiAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTguNiwyNGMtNSwwLTcuNCwuNS0xMS4yLDEuNnY3LjVjMi42LTEuMyw1LjktMi4zLDktMi4zczYuOC40LDYuOCwzLjljLTEuMSwwLTMuMi0uNC01LS40LTYuNSwwLTEzLjksMS42LTEzLjksOS45czQuOSw3LjksOS44LDcuOSw3LTEuNCw4LjgtNC41aDB2My44aDEyLjF2LTE2LjNjMC05LjgtOS0xMS4xLTE2LjUtMTEuMVpNMjMuMSw0MC41YzAsLjIsMCwuNCwwLC42LS4yLDIuMS0xLjUsNC4xLTQsNC4xcy0zLjEtLjctMy4xLTIuNWMwLTIuOCwzLjEtMy4xLDUuOC0zLjFoMS4zdi44WiIvPiAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTU3LjcsMjRjLTQuMSwwLTYuNiwyLjktOC4yLDYuN2gtLjF2LTYuMWgtMTIuMnYyNi44aDEzdi05LjdjMC00LDMtNy4xLDYuNi03LjFzMi4zLjIsMi45LjR2LTEwLjhjLS41LS4yLTEuMy0uMy0yLjEtLjNaIi8+PC9zdmc+`;

/**
 * Componente principal de la aplicación.
 * Gestiona el estado global, como la página actual y los datos del producto generado,
 * y orquesta el renderizado de los componentes principales.
 */
const App: React.FC = () => {
    // --- ESTADO ---
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Nuevo estado para la barra lateral
    const [currentPage, setCurrentPage] = useState<Page>('studio');
    const [product, setProduct] = useState<Product | null>(null);
    const [commercialDesc, setCommercialDesc] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]); // Estado para controlar la finalización del paso 3
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // Nuevo estado para el video
    // Carga el logo desde localStorage o usa el valor por defecto.
    const [logo, setLogo] = useState<string>(() => {
        try {
            const savedLogo = localStorage.getItem('appLogo');
            return savedLogo || defaultLogo;
        } catch (error) {
            console.error("No se pudo acceder a localStorage:", error);
            return defaultLogo;
        }
    });

    // --- MANEJADORES DE EVENTOS ---
    /**
     * Callback que se ejecuta cuando se genera una nueva idea de producto.
     * Actualiza el estado del producto y resetea los pasos posteriores.
     */
    const handleProductGenerated = (newProduct: Product) => {
        setProduct(newProduct);
        setCommercialDesc(null);
        setGeneratedImages([]);
        setVideoUrl(null);
    };

    /**
     * Callback que se ejecuta cuando se genera una nueva descripción comercial.
     * Actualiza el estado de la descripción y resetea los pasos posteriores.
     */
    const handleDescriptionGenerated = (newDescription: string) => {
        setCommercialDesc(newDescription);
        setGeneratedImages([]);
        setVideoUrl(null);
    };

    /**
     * Callback que se ejecuta cuando se generan nuevas imágenes.
     * Actualiza el estado para indicar que el paso 3 se completó.
     */
    const handleImagesGenerated = (images: string[]) => {
        setGeneratedImages(images);
    };

    /**
     * Callback que se ejecuta cuando se genera un nuevo video.
     * Actualiza el estado de la URL del video.
     */
    const handleVideoGenerated = (newVideoUrl: string) => {
        setVideoUrl(newVideoUrl);
    };

    /**
     * Actualiza el logo en el estado y lo guarda en localStorage para persistencia.
     */
    const handleLogoChange = (newLogoDataUrl: string) => {
        try {
            localStorage.setItem('appLogo', newLogoDataUrl);
            setLogo(newLogoDataUrl);
        } catch (error) {
            console.error("No se pudo guardar el logo en localStorage:", error);
        }
    };

    // --- RENDERIZACIÓN ---
    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Barra lateral de navegación con estado de expansión */}
            <Sidebar 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
                logo={logo}
                isExpanded={isSidebarExpanded}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Cabecera con el botón para desplegar/ocultar la barra lateral */}
                <Header onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
                
                {/* Contenido principal */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Renderizado condicional basado en la página actual */}
                        {currentPage === 'studio' && (
                            <div className="space-y-12">
                                <div className="text-center">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Product Studio AI</h1>
                                    <p className="text-lg text-gray-600 mt-2">Genera ideas, textos de marketing e imágenes para tu próximo producto estrella.</p>
                                </div>
                                
                                {/* Paso 1: Generador de Ideas */}
                                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 1: Idea de Producto</h2>
                                    <ProductIdeaGenerator onProductGenerated={handleProductGenerated} />
                                </div>

                                {/* Paso 2: Generador de Descripción (visible solo si hay un producto) */}
                                {product && (
                                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 2: Descripción Comercial</h2>
                                        <CommercialDescriptionGenerator product={product} onDescriptionGenerated={handleDescriptionGenerated} />
                                    </div>
                                )}

                                {/* Paso 3: Generador de Imágenes (visible solo si hay producto y descripción) */}
                                {product && commercialDesc && (
                                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 3: Imágenes Publicitarias</h2>
                                        <ImageGenerator 
                                            product={product} 
                                            commercialDesc={commercialDesc} 
                                            onImagesGenerated={handleImagesGenerated}
                                        />
                                    </div>
                                )}

                                {/* Paso 4: Generador de Video (visible solo si se completaron los pasos anteriores) */}
                                {product && commercialDesc && generatedImages.length > 0 && (
                                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Paso 4: Video Publicitario</h2>
                                        <VideoGenerator 
                                            product={product} 
                                            commercialDesc={commercialDesc} 
                                            generatedImages={generatedImages}
                                            onVideoGenerated={handleVideoGenerated} 
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Página de Configuración */}
                        {currentPage === 'settings' && (
                           <Settings currentLogo={logo} onLogoChange={handleLogoChange} />
                        )}

                        {/* Página de Feedback AI */}
                        {currentPage === 'feedback' && (
                           <FeedbackAI />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;