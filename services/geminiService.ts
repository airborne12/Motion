import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, SentimentType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeXSentiment = async (companyName: string): Promise<AnalysisResult> => {
  const model = 'gemini-2.5-flash';
  
  // We need to trick the model into giving us JSON without using responseSchema/MimeType
  // because those are incompatible with the googleSearch tool.
  const prompt = `
    Conduct a search on X (formerly Twitter) and financial news sources for recent investment sentiment regarding "${companyName}". 
    
    Focus on:
    1. Recent stock performance discussions.
    2. Retail investor sentiment on X.
    3. Major announcements or controversies.

    Based on the search results, analyze the sentiment score from 0 (Extremely Negative) to 100 (Extremely Positive).
    
    You MUST return the response in a raw JSON format wrapped in \`\`\`json code blocks. 
    The JSON object must have this structure:
    {
      "score": number,
      "sentiment": "Positive" | "Negative" | "Neutral",
      "summary": "A concise 2-3 sentence summary of the current mood.",
      "keyPoints": ["point 1", "point 2", "point 3"],
      "trendingHashtags": ["#tag1", "#tag2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract JSON from code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let parsedData;
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
        throw new Error("Failed to parse analysis data.");
      }
    } else {
      // Fallback if no code block (rare with 2.5 flash if prompted correctly)
      // Attempt to find just a JSON object
      const simpleMatch = text.match(/\{[\s\S]*\}/);
      if (simpleMatch) {
         parsedData = JSON.parse(simpleMatch[0]);
      } else {
        throw new Error("Invalid response format from AI.");
      }
    }

    // Extract Grounding Metadata (Sources)
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => {
        if (chunk.web) {
          return { uri: chunk.web.uri, title: chunk.web.title };
        }
        return null;
      })
      .filter((source): source is { uri: string, title: string } => source !== null) || [];

    // Sanitize data to ensure it matches types
    const sentimentData = {
      score: typeof parsedData.score === 'number' ? parsedData.score : 50,
      sentiment: parsedData.sentiment as SentimentType || SentimentType.NEUTRAL,
      summary: parsedData.summary || "No summary available.",
      keyPoints: Array.isArray(parsedData.keyPoints) ? parsedData.keyPoints : [],
      trendingHashtags: Array.isArray(parsedData.trendingHashtags) ? parsedData.trendingHashtags : []
    };

    return {
      data: sentimentData,
      sources: sources
    };

  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw error;
  }
};