# Alicorp Product Studio

Una aplicación web de IA para generar ideas de productos alimenticios para el mercado peruano, crear descripciones comerciales, visualizar imágenes y videos de productos, y analizar el feedback de los clientes utilizando la API de Google Gemini.

## 🚀 Características Principales

-   **Product Studio (Flujo de 4 Pasos):**
    1.  **Generación de Ideas:** Proporciona una idea base y la IA desarrolla un concepto de producto completo (nombre, descripción, ingredientes, público objetivo).
    2.  **Descripción Comercial:** Crea textos de marketing persuasivos y adaptados al público objetivo.
    3.  **Imágenes Publicitarias:** Genera imágenes fotorrealistas del producto en un entorno de campaña.
    4.  **Video Publicitario:** Produce un spot de video corto y dinámico para el producto.
-   **Feedback AI:**
    *   Simula un análisis de sentimiento a partir de datos de feedback de clientes.
    *   Visualiza los datos clave en tablas y un gráfico de dispersión.
    *   Genera un informe estratégico con un plan de acción, análisis de competencia y tiempos de implementación.
-   **Personalización:**
    *   Permite cambiar el logotipo de la aplicación para adaptarlo a la marca.
-   **Diseño Moderno:**
    *   Interfaz de usuario limpia, responsiva y con una barra lateral colapsable.

## 🛠️ Tecnologías Utilizadas

-   **Frontend:**
    -   **Lenguaje:** TypeScript
    -   **Librería:** React
    -   **Estilos:** Tailwind CSS
-   **Backend (Serverless):**
    -   **Google Gemini API:**
        -   `gemini-2.5-flash` para generación de texto y análisis.
        -   `imagen-4.0-generate-001` para generación de imágenes.
        -   `veo-3.0-generate-001` para generación de videos.
-   **Gestión de Dependencias:**
    -   Se utiliza un [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) en `index.html` para cargar las dependencias (`React`, `@google/genai`) directamente desde una CDN, eliminando la necesidad de un paso de compilación (bundling).

## 📋 Requisitos Previos

-   Un navegador web moderno (Chrome, Firefox, Safari, Edge).
-   Una clave de API de Google Gemini.

## ⚙️ Configuración y Ejecución

La aplicación está diseñada para ejecutarse directamente en el navegador sin un paso de compilación.

### 1. Clave de API

Esta aplicación requiere que una clave de API de Google Gemini esté disponible como una variable de entorno llamada `process.env.API_KEY`.

Para el desarrollo local, una forma sencilla de proporcionar esta clave es crear un archivo `index.html` modificado temporalmente o usar un servidor de desarrollo que pueda inyectar variables de entorno. Sin embargo, para mantener el código original, se asume que el entorno de despliegue (como un hosting de aplicaciones web) configurará esta variable.

### 2. Ejecución Local

Dado que la aplicación utiliza módulos ES6 (`import`/`export`), no se puede abrir el archivo `index.html` directamente desde el sistema de archivos (`file://...`). Debes servirlo a través de un servidor web local.

1.  **Instala un servidor local (si no tienes uno):**
    Si tienes Node.js instalado, puedes usar el paquete `serve`.

    ```bash
    npm install -g serve
    ```

2.  **Inicia el servidor:**
    Navega hasta el directorio raíz del proyecto en tu terminal y ejecuta:

    ```bash
    serve .
    ```

3.  **Accede a la aplicación:**
    Abre tu navegador y ve a la dirección que se muestra en la terminal (normalmente `http://localhost:3000`).

**Nota Importante:** Para que la clave de API funcione en este entorno de servidor local estático, necesitarás encontrar una manera de inyectarla. Una solución común es reemplazar `process.env.API_KEY` en el código con tu clave real **solo para pruebas locales**, pero recuerda **no subir tu clave al repositorio de Git**.

## 📁 Estructura de Archivos

```
.
├── assets/
│   └── alicorp-logo.svg      # Logo por defecto
├── components/
│   ├── BackButton.tsx
│   ├── CommercialDescriptionGenerator.tsx
│   ├── FeedbackAI.tsx
│   ├── Header.tsx
│   ├── Icons.tsx
│   ├── ImageGenerator.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProductIdeaGenerator.tsx
│   ├── ResultCard.tsx
│   ├── ScatterPlot.tsx
│   ├── Settings.tsx
│   ├── Sidebar.tsx
│   └── VideoGenerator.tsx
├── services/
│   └── geminiService.ts      # Lógica para interactuar con la API de Gemini
├── App.tsx                   # Componente principal de la aplicación
├── index.html                # Punto de entrada HTML
├── index.tsx                 # Script de entrada de React
├── metadata.json             # Metadatos de la aplicación
├── README.md                 # Este archivo
├── requirements.txt          # Explicación sobre las dependencias
└── types.ts                  # Definiciones de tipos de TypeScript
```