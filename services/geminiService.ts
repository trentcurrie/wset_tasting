import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TastingNote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const labelAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the wine (e.g. Chateau Margaux)" },
    producer: { type: Type.STRING, description: "Producer or winery name" },
    vintage: { type: Type.STRING, description: "Year of harvest or 'NV'" },
    country: { type: Type.STRING, description: "Country of origin" },
    region: { type: Type.STRING, description: "Specific region or appellation" },
    grape: { type: Type.STRING, description: "Dominant grape varieties inferred from region/label" },
    colorCategory: { type: Type.STRING, enum: ["White", "Rose", "Red"], description: "Inferred color category based on grape/region" },
  },
  required: ["name", "producer", "country", "colorCategory"]
};

export const analyzeWineLabel = async (base64Image: string): Promise<Partial<TastingNote>> => {
  const model = 'gemini-2.5-flash';
  
  // Clean base64 string if it contains metadata header
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analyze this wine label image. Extract the identity details (Name, Producer, Vintage, Region, Country, Grape). 
            Infer the likely Color Category (Red, White, Rose) based on the grape and region.
            Do NOT provide tasting notes (aromas/flavors). I want to taste it myself. Only provide facts from the label.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: labelAnalysisSchema,
      }
    });

    const data = JSON.parse(response.text || "{}");

    const partialNote: any = {
      name: data.name,
      producer: data.producer,
      vintage: data.vintage || "NV",
      country: data.country,
      region: data.region,
      grape: data.grape,
      appearance: {
        colorCategory: data.colorCategory || 'Red',
        // Set reasonable defaults for the rest to ensure valid state
        color: data.colorCategory === 'White' ? 'Lemon' : data.colorCategory === 'Rose' ? 'Salmon' : 'Ruby',
        intensity: 'Medium',
        clarity: 'Clear'
      }
    };

    return partialNote;

  } catch (error) {
    console.error("Error analyzing label:", error);
    throw new Error("Could not read label. Please enter details manually.");
  }
};