import React, { useState } from 'react';
import type { SentimentWord } from '../types';
import { generateFeedbackRecommendations } from '../services/geminiService';
import ScatterPlot from './ScatterPlot';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

/**
 * Componente auxiliar para renderizar una cadena de texto como una lista con viñetas.
 * Procesa el texto que viene de la IA, lo divide por saltos de línea y lo formatea en una lista HTML.
 */
const BulletedList: React.FC<{ text?: string }> = ({ text }) => {
    if (!text) return null;

    const listItems = text
        .split('\n')
        .filter(line => line.trim() !== '')
        .map((item, index) => (
            <li key={index}>{item.replace(/^[-*]\s*/, '').trim()}</li>
        ));

    if (listItems.length === 0) {
        return <p className="text-gray-700 whitespace-pre-wrap">{text}</p>;
    }

    return (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
            {listItems}
        </ul>
    );
};

/**
 * Componente para la página de Análisis de Feedback con IA.
 * Simula datos de sentimiento, los visualiza y genera recomendaciones estratégicas.
 */
const FeedbackAI: React.FC = () => {
    // --- ESTADO ---
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [positiveWords, setPositiveWords] = useState<SentimentWord[]>([]);
    const [negativeWords, setNegativeWords] = useState<SentimentWord[]>([]);
    const [recommendations, setRecommendations] = useState<any | null>(null);
    const [analysisDone, setAnalysisDone] = useState(false);

    /**
     * Simula la obtención de datos de sentimiento y llama a la IA para obtener recomendaciones.
     */
    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisDone(true);
        
        // 1. Simulación de datos de feedback
        const simulatedPositive: SentimentWord[] = [
            { word: 'delicioso', frequency: 95, score: 0.92 },
            { word: 'refrescante', frequency: 80, score: 0.85 },
            { word: 'natural', frequency: 72, score: 0.78 },
            { word: 'perfecto', frequency: 65, score: 0.95 },
            { word: 'me encanta', frequency: 58, score: 0.89 },
        ];
        const simulatedNegative: SentimentWord[] = [
            { word: 'muy caro', frequency: 45, score: -0.85 },
            { word: 'demasiado dulce', frequency: 38, score: -0.65 },
            { word: 'empaque difícil', frequency: 30, score: -0.50 },
            { word: 'no lo encuentro', frequency: 25, score: -0.45 },
            { word: 'pequeño', frequency: 22, score: -0.70 },
        ];
        setPositiveWords(simulatedPositive);
        setNegativeWords(simulatedNegative);

        // 2. Llamada a la IA para generar recomendaciones
        try {
            const result = await generateFeedbackRecommendations(simulatedPositive, simulatedNegative);
            setRecommendations(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Cabecera de la página */}
            <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-700">Feedback AI</h1>
                <p className="text-lg text-gray-500 mt-2">Analiza el sentimiento de tus clientes y obtén un plan de acción.</p>
            </div>

            {/* Botón de acción principal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Análisis de Sentimiento</h2>
                <p className="text-gray-600 mb-4">Haz clic para simular un análisis de feedback de clientes en redes sociales y generar un informe estratégico.</p>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full bg-[#EF3340] text-white font-bold py-3 px-4 rounded-full hover:bg-[#D72C3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF3340] disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                    {isLoading ? <LoadingSpinner /> : 'Analizar Feedback'}
                </button>
            </div>

            {/* Muestra el spinner mientras se cargan las recomendaciones */}
            {isLoading && (
                <div className="text-center p-6">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Analizando miles de comentarios y preparando tu estrategia...</p>
                </div>
            )}
            
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            {/* Renderiza los resultados solo después de que el análisis se haya realizado */}
            {analysisDone && !isLoading && !error && (
                <div className="space-y-8">
                    {/* Sección de Visualización de Datos (Tablas y Gráfico) */}
                    <ResultCard title="Visualización del Feedback">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Tablas de palabras */}
                            <div className="space-y-6">
                                <WordTable title="Top 5 Palabras Positivas" words={positiveWords} color="text-green-600" />
                                <WordTable title="Top 5 Palabras Negativas" words={negativeWords} color="text-red-600" />
                            </div>
                            {/* Gráfico de dispersión */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Gráfico de Dispersión</h3>
                                <ScatterPlot positiveWords={positiveWords} negativeWords={negativeWords} />
                            </div>
                        </div>
                    </ResultCard>

                    {/* Sección de Recomendaciones de la IA */}
                    {recommendations && (
                        <ResultCard title="Recomendaciones Estratégicas de IA">
                            <div className="space-y-6 text-left">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Plan de Acción Sugerido</h3>
                                    <BulletedList text={recommendations.planDeAccion} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Análisis de Competencia</h3>
                                    <BulletedList text={recommendations.analisisCompetencia} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Tiempo de Implementación Estimado</h3>
                                    <BulletedList text={recommendations.tiempoImplementacion} />
                                </div>
                            </div>
                        </ResultCard>
                    )}
                </div>
            )}
        </div>
    );
};

// Componente interno para renderizar las tablas de palabras.
const WordTable: React.FC<{ title: string; words: SentimentWord[]; color: string }> = ({ title, words, color }) => (
    <div>
        <h3 className={`text-lg font-bold mb-2 ${color}`}>{title}</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 font-medium text-left text-gray-900">Palabra</th>
                        <th className="px-4 py-2 font-medium text-left text-gray-900">Frecuencia</th>
                        <th className="px-4 py-2 font-medium text-left text-gray-900">Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {words.map(item => (
                        <tr key={item.word}>
                            <td className="px-4 py-2 font-medium text-gray-900">{item.word}</td>
                            <td className="px-4 py-2 text-gray-700">{item.frequency}</td>
                            <td className={`px-4 py-2 font-semibold ${item.score > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.score.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default FeedbackAI;