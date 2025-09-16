// Importaciones necesarias de React y ReactDOM.
import React from 'react';
import ReactDOM from 'react-dom/client';
// Importa el componente principal de la aplicación.
import App from './App';

// Obtiene el elemento raíz del DOM donde se montará la aplicación.
const rootElement = document.getElementById('root');
// Si no se encuentra el elemento, lanza un error para evitar fallos inesperados.
if (!rootElement) {
  throw new Error("No se pudo encontrar el elemento raíz para montar la aplicación.");
}

// Crea el punto de entrada de la aplicación React en el elemento raíz.
const root = ReactDOM.createRoot(rootElement);
// Renderiza el componente App dentro de React.StrictMode para detectar problemas potenciales.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
