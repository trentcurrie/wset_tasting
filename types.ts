export enum TasterLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

// Appearance
export type Clarity = "Clear" | "Hazy";
export type Intensity = "Pale" | "Medium" | "Deep";
export type ColorWhite = "Lemon-Green" | "Lemon" | "Gold" | "Amber" | "Brown";
export type ColorRose = "Pink" | "Salmon" | "Orange";
export type ColorRed = "Purple" | "Ruby" | "Garnet" | "Tawny" | "Brown";
export type WineColor = ColorWhite | ColorRose | ColorRed;

// Nose
export type NoseCondition = "Clean" | "Unclean";
export type AromaIntensity = "Light" | "Medium(-)" | "Medium" | "Medium(+)" | "Pronounced";
export type AromaDevelopment = "Youthful" | "Developing" | "Fully Developed" | "Tired/Past Best";

// Palate
export type Sweetness = "Dry" | "Off-Dry" | "Medium-Dry" | "Medium-Sweet" | "Sweet" | "Luscious";
export type AcidTanninLevel = "Low" | "Medium(-)" | "Medium" | "Medium(+)" | "High";
export type AlcoholLevel = "Low" | "Medium" | "High";
export type BodyLevel = "Light" | "Medium(-)" | "Medium" | "Medium(+)" | "Full";
export type FinishLength = "Short" | "Medium(-)" | "Medium" | "Medium(+)" | "Long";

// Conclusion
export type QualityLevel = "Poor" | "Acceptable" | "Good" | "Very Good" | "Outstanding";
export type Drinkability = "Too Young" | "Can Drink, Potential for Aging" | "Drink Now: Not Suitable for Aging" | "Too Old";

export type TastingType = "Quick" | "Full";

export interface TastingNote {
  id: string;
  createdAt: number;
  type: TastingType;
  imageUrl?: string; // Base64 string of the label
  
  // General Info
  name: string;
  producer: string;
  vintage: string; // string to allow NV
  region: string;
  country: string;
  grape: string;
  price?: number;
  alcoholPercentage?: number;

  // Appearance
  appearance: {
    clarity: Clarity;
    intensity: Intensity;
    color: WineColor;
    colorCategory: "White" | "Rose" | "Red"; // For UI grouping
  };

  // Nose
  nose: {
    condition: NoseCondition;
    intensity: AromaIntensity;
    characteristics: string[]; // Array of descriptive tags (e.g., "Green Apple", "Butter")
    development: AromaDevelopment;
  };

  // Palate
  palate: {
    sweetness: Sweetness;
    acidity: AcidTanninLevel;
    tannin: AcidTanninLevel;
    alcohol: AlcoholLevel;
    body: BodyLevel;
    flavorIntensity: AromaIntensity;
    flavorCharacteristics: string[];
    finish: FinishLength;
  };

  // Conclusion
  conclusion: {
    quality: QualityLevel;
    readiness: Drinkability;
    personalRating: number; // 0-100
    notes: string; // Free text
  };
}

export const INITIAL_TASTING_NOTE: TastingNote = {
  id: '',
  createdAt: Date.now(),
  type: 'Full',
  name: '',
  producer: '',
  vintage: '',
  region: '',
  country: '',
  grape: '',
  appearance: {
    clarity: "Clear",
    intensity: "Medium",
    color: "Ruby",
    colorCategory: "Red"
  },
  nose: {
    condition: "Clean",
    intensity: "Medium",
    characteristics: [],
    development: "Youthful"
  },
  palate: {
    sweetness: "Dry",
    acidity: "Medium",
    tannin: "Medium",
    alcohol: "Medium",
    body: "Medium",
    flavorIntensity: "Medium",
    flavorCharacteristics: [],
    finish: "Medium"
  },
  conclusion: {
    quality: "Good",
    readiness: "Drink Now: Not Suitable for Aging",
    personalRating: 85,
    notes: ""
  }
};