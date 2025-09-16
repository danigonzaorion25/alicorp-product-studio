/**
 * Define la estructura de datos para un producto generado.
 * Esta interfaz asegura la consistencia de los datos del producto en toda la aplicación.
 */
export interface Product {
  // El nombre comercial y atractivo del producto.
  nombreProducto: string;
  // Una explicación detallada de qué es el producto, su sabor, textura, etc.
  descripcion: string;
  // Una lista de los ingredientes principales, preferiblemente de origen local.
  ingredientesClave: string[];
  // El perfil del consumidor principal al que se dirige el producto.
  publicoObjetivo: string;
}

/**
 * Define la estructura de datos para una palabra clave de sentimiento.
 * Se utiliza para visualizar el feedback de los clientes.
 */
export interface SentimentWord {
  // La palabra o frase mencionada.
  word: string;
  // El número de veces que se repitió.
  frequency: number;
  // El puntaje de sentimiento promedio, de -1 (muy negativo) a 1 (muy positivo).
  score: number;
}

/**
 * Define los identificadores para las páginas disponibles en la aplicación.
 * Se utiliza para la navegación y el renderizado condicional.
 */
export type Page = 'studio' | 'settings' | 'feedback';