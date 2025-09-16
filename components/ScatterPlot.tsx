import React from 'react';
import type { SentimentWord } from '../types';

// Propiedades que el componente espera recibir.
interface ScatterPlotProps {
    positiveWords: SentimentWord[];
    negativeWords: SentimentWord[];
}

/**
 * Componente que renderiza un gráfico de dispersión para visualizar el sentimiento.
 * Utiliza SVG para dibujar los ejes y los puntos de datos.
 */
const ScatterPlot: React.FC<ScatterPlotProps> = ({ positiveWords, negativeWords }) => {
    // --- CONFIGURACIÓN DEL GRÁFICO ---
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const allWords = [...positiveWords, ...negativeWords];
    const maxFrequency = Math.max(...allWords.map(d => d.frequency), 0);

    // --- ESCALAS ---
    // Escala X para el score de sentimiento (-1 a 1)
    const xScale = (score: number) => {
        return ((score + 1) / 2) * innerWidth;
    };
    // Escala Y para la frecuencia (0 a maxFrequency)
    const yScale = (frequency: number) => {
        return innerHeight - (frequency / maxFrequency) * innerHeight;
    };

    // --- RENDERIZACIÓN ---
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Ejes y etiquetas */}
                    <g className="axes">
                        {/* Eje Y (Frecuencia) */}
                        <line x1="0" y1="0" x2="0" y2={innerHeight} stroke="#9CA3AF" strokeWidth="1" />
                        <text x="-10" y={-8} textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">
                            {Math.ceil(maxFrequency / 10) * 10}
                        </text>
                        <text x="-10" y={innerHeight} textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">0</text>
                        <text transform={`rotate(-90)`} x={-innerHeight / 2} y={-35} textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">
                            Frecuencia
                        </text>
                        {/* Eje X (Score de Sentimiento) */}
                        <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#9CA3AF" strokeWidth="1" />
                        <text x="0" y={innerHeight + 20} textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">-1.0</text>
                        <text x={innerWidth / 2} y={innerHeight + 20} textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">0.0</text>
                        <text x={innerWidth} y={innerHeight + 20} textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">1.0</text>
                        <text x={innerWidth / 2} y={innerHeight + 40} textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">
                            Score de Sentimiento
                        </text>
                    </g>
                    
                    {/* Puntos de datos (Burbujas) */}
                    <g className="datapoints">
                        {/* Palabras Positivas */}
                        {positiveWords.map(word => (
                            <g key={word.word} transform={`translate(${xScale(word.score)}, ${yScale(word.frequency)})`}>
                                <circle r="6" fill="#16A34A" opacity="0.7" />
                                <text x="10" y="4" fontSize="11" fill="#15803D">{word.word}</text>
                            </g>
                        ))}
                        {/* Palabras Negativas */}
                        {negativeWords.map(word => (
                             <g key={word.word} transform={`translate(${xScale(word.score)}, ${yScale(word.frequency)})`}>
                                <circle r="6" fill="#DC2626" opacity="0.7" />
                                <text x="10" y="4" fontSize="11" fill="#B91C1C">{word.word}</text>
                            </g>
                        ))}
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default ScatterPlot;