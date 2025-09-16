// Importaciones de React.
import React, { useRef } from 'react';

// Define las propiedades que el componente espera.
interface SettingsProps {
    currentLogo: string; // La URL del logotipo actual para la previsualización.
    onLogoChange: (newLogoDataUrl: string) => void; // Callback para notificar el cambio de logo.
}

/**
 * Componente para la página de Configuración.
 * Permite al usuario personalizar aspectos de la aplicación, como el logotipo.
 */
const Settings: React.FC<SettingsProps> = ({ currentLogo, onLogoChange }) => {
    // Referencia al input de tipo 'file' para poder activarlo mediante un botón.
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Maneja el cambio de archivo cuando el usuario selecciona una imagen.
     * Lee el archivo como Data URL y llama al callback `onLogoChange`.
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Valida que el archivo sea una imagen.
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen (PNG, JPG, SVG).');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                // Llama a la función del padre con el resultado en base64.
                onLogoChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Simula un clic en el input de archivo oculto cuando el usuario presiona el botón.
     */
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // --- RENDERIZACIÓN ---
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-700">Configuración</h1>
                <p className="text-lg text-gray-500 mt-2">Personaliza la apariencia de tu Product Studio.</p>
            </div>

            {/* Sección para la personalización del logotipo */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Logotipo de la Aplicación</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Previsualización del logotipo actual */}
                    <div className="md:col-span-1">
                        <p className="font-medium text-gray-600 mb-2">Vista Previa:</p>
                        <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center border border-gray-200 h-28">
                            <img src={currentLogo} alt="Logo actual" className="max-h-20 object-contain" />
                        </div>
                    </div>
                    {/* Controles para cambiar el logotipo */}
                    <div className="md:col-span-2">
                        <p className="text-gray-600 mb-3">Sube un nuevo logo para reemplazar el actual. Se recomienda un archivo PNG, JPG o SVG con fondo transparente.</p>
                        {/* Input de archivo oculto, controlado por la referencia. */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/svg+xml"
                            className="hidden"
                        />
                        {/* Botón que activa el input de archivo. */}
                        <button
                            onClick={handleUploadClick}
                            className="bg-[#EF3340] text-white font-bold py-2 px-5 rounded-full hover:bg-[#D72C3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF3340] transition-colors"
                        >
                            Cambiar Logo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Settings;
