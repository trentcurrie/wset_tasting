import React, { useState, useRef } from 'react';
import { 
  TastingNote, INITIAL_TASTING_NOTE, 
  TastingType
} from '../types';
import { analyzeWineLabel } from '../services/geminiService';
import { Loader2, Sparkles, ChevronRight, ChevronLeft, Check, Camera, Upload, X, Zap, BookOpen } from 'lucide-react';

interface Props {
  onSave: (note: TastingNote) => void;
  onCancel: () => void;
}

// Helper to compress image before storing (simple canvas resize)
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Helpers for Select inputs
const SelectField = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-stone-200 rounded-md bg-white focus:ring-2 focus:ring-wine-500 focus:border-wine-500 transition-colors"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TagInput = ({ label, tags, onChange }: { label: string, tags: string[], onChange: (tags: string[]) => void }) => {
  const [input, setInput] = useState('');
  
  const handleAdd = () => {
    if(input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (t: string) => {
    onChange(tags.filter(tag => tag !== t));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add descriptor (e.g. Green Apple)"
          className="flex-1 p-2 border border-stone-200 rounded-md text-sm"
        />
        <button onClick={handleAdd} type="button" className="bg-stone-100 px-3 py-1 rounded-md text-sm hover:bg-stone-200">+</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="bg-wine-50 text-wine-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {tag}
            <button onClick={() => handleRemove(tag)} className="hover:text-wine-900">&times;</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export const TastingForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<TastingNote>({ ...INITIAL_TASTING_NOTE, id: crypto.randomUUID() });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setIsAnalyzing(true);
        const compressedBase64 = await compressImage(file);
        
        // Optimistically set the image immediately
        setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));

        // Send to Gemini
        const extractedData = await analyzeWineLabel(compressedBase64);
        
        setFormData(prev => ({
          ...prev,
          ...extractedData,
          imageUrl: compressedBase64, // ensure it stays set
          // Merge deep objects carefully
          appearance: { ...prev.appearance, ...(extractedData.appearance || {}) }
        }));
      } catch (error) {
        console.error(error);
        alert("Could not analyze the label. You can still enter details manually.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const updateField = (section: keyof TastingNote, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...(prev[section] as object), [field]: value } 
        : value
    }));
  };

  const switchMode = (mode: TastingType) => {
    setFormData(prev => ({ ...prev, type: mode }));
  };

  const isQuickMode = formData.type === 'Quick';

  // Steps definition based on mode
  const steps = isQuickMode 
    ? [ { title: "Identity", icon: Zap } ]
    : [
        { title: "Identity", icon: BookOpen },
        { title: "Appearance", icon: Check },
        { title: "Nose", icon: Check },
        { title: "Palate", icon: Check },
        { title: "Conclusion", icon: Check },
      ];

  const renderIdentityStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Mode Toggle */}
      <div className="flex bg-stone-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => switchMode('Quick')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            isQuickMode ? 'bg-white text-wine-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Zap size={16} /> Quick Log
        </button>
        <button
          onClick={() => switchMode('Full')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            !isQuickMode ? 'bg-white text-wine-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <BookOpen size={16} /> Full Tasting
        </button>
      </div>

      {/* Image Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
          formData.imageUrl ? 'border-wine-200 bg-stone-50' : 'border-stone-300 hover:border-wine-500 hover:bg-stone-50'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          capture="environment"
          className="hidden" 
          onChange={handleImageUpload}
        />
        
        {formData.imageUrl ? (
          <>
            <img src={formData.imageUrl} alt="Wine Label" className="h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <span className="bg-white/90 text-stone-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                 <Camera size={16} /> Retake Photo
               </span>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
             <div className="bg-wine-50 text-wine-600 p-3 rounded-full inline-block mb-2">
               <Camera size={24} />
             </div>
             <p className="text-stone-600 font-medium">Take a photo of the label</p>
             <p className="text-stone-400 text-xs mt-1">AI will extract name, vintage & producer</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <Loader2 className="animate-spin text-wine-600 h-8 w-8 mb-2" />
            <p className="text-wine-800 font-medium animate-pulse">Analyzing Label...</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-600">Wine Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border border-stone-200 rounded-md mt-1"
            placeholder="e.g. Chateau Margaux"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600">Vintage</label>
          <input 
            type="text" 
            value={formData.vintage} 
            onChange={e => setFormData({...formData, vintage: e.target.value})}
            className="w-full p-2 border border-stone-200 rounded-md mt-1"
            placeholder="e.g. 2015"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600">Producer</label>
          <input 
            type="text" 
            value={formData.producer} 
            onChange={e => setFormData({...formData, producer: e.target.value})}
            className="w-full p-2 border border-stone-200 rounded-md mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600">Country</label>
          <input 
            type="text" 
            value={formData.country} 
            onChange={e => setFormData({...formData, country: e.target.value})}
            className="w-full p-2 border border-stone-200 rounded-md mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600">Region</label>
          <input 
            type="text" 
            value={formData.region} 
            onChange={e => setFormData({...formData, region: e.target.value})}
            className="w-full p-2 border border-stone-200 rounded-md mt-1"
          />
        </div>
        
        {/* Quick Mode Additional Fields directly here */}
        {isQuickMode && (
          <div className="col-span-2 space-y-4 pt-4 border-t border-stone-100 mt-2">
            <div>
               <label className="block text-sm font-medium text-stone-600 mb-1">Your Rating (0-100)</label>
               <div className="flex items-center gap-4">
                 <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={formData.conclusion.personalRating}
                    onChange={(e) => updateField('conclusion', 'personalRating', parseInt(e.target.value))}
                    className="flex-1 accent-wine-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                 />
                 <span className="font-serif font-bold text-2xl text-wine-800 w-12 text-center">
                   {formData.conclusion.personalRating}
                 </span>
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Notes</label>
              <textarea 
                value={formData.conclusion.notes}
                onChange={e => updateField('conclusion', 'notes', e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-md h-24"
                placeholder="What did you think?"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    // If Quick mode, everything is in Step 0
    if (isQuickMode && step === 0) return renderIdentityStep();
    
    // Full Mode Steps
    switch(step) {
      case 0: return renderIdentityStep();
      case 1: 
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 mb-4 flex gap-2">
                <BookOpen size={16} className="shrink-0 mt-0.5" />
                <span>Tip: Tilt the glass 45° against a white background to judge color and rim variation accurately.</span>
             </div>
             <SelectField 
                label="Clarity" 
                value={formData.appearance.clarity} 
                options={["Clear", "Hazy"]} 
                onChange={(v) => updateField('appearance', 'clarity', v)} 
              />
              <SelectField 
                label="Intensity" 
                value={formData.appearance.intensity} 
                options={["Pale", "Medium", "Deep"]} 
                onChange={(v) => updateField('appearance', 'intensity', v)} 
              />
              <SelectField 
                label="Color Category" 
                value={formData.appearance.colorCategory} 
                options={["White", "Rose", "Red"]} 
                onChange={(v) => updateField('appearance', 'colorCategory', v)} 
              />
              <SelectField 
                label="Color Hue" 
                value={formData.appearance.color} 
                options={
                  formData.appearance.colorCategory === 'White' ? ["Lemon-Green", "Lemon", "Gold", "Amber", "Brown"] :
                  formData.appearance.colorCategory === 'Rose' ? ["Pink", "Salmon", "Orange"] :
                  ["Purple", "Ruby", "Garnet", "Tawny", "Brown"]
                } 
                onChange={(v) => updateField('appearance', 'color', v)} 
              />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <SelectField 
                label="Condition" 
                value={formData.nose.condition} 
                options={["Clean", "Unclean"]} 
                onChange={(v) => updateField('nose', 'condition', v)} 
              />
              <SelectField 
                label="Intensity" 
                value={formData.nose.intensity} 
                options={["Light", "Medium(-)", "Medium", "Medium(+)", "Pronounced"]} 
                onChange={(v) => updateField('nose', 'intensity', v)} 
              />
              <SelectField 
                label="Development" 
                value={formData.nose.development} 
                options={["Youthful", "Developing", "Fully Developed", "Tired/Past Best"]} 
                onChange={(v) => updateField('nose', 'development', v)} 
              />
              <TagInput 
                label="Aroma Characteristics (Fruit, Floral, Spice, Oak...)" 
                tags={formData.nose.characteristics} 
                onChange={(tags) => updateField('nose', 'characteristics', tags)}
              />
          </div>
        );
      case 3:
        return (
           <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full bg-blue-50 p-3 rounded-md text-sm text-blue-800 mb-2">
                 <span>Tip: 'Acidity' makes your mouth water. 'Tannin' dries your gums out.</span>
              </div>
              <SelectField label="Sweetness" value={formData.palate.sweetness} options={["Dry", "Off-Dry", "Medium-Dry", "Medium-Sweet", "Sweet", "Luscious"]} onChange={(v) => updateField('palate', 'sweetness', v)} />
              <SelectField label="Acidity" value={formData.palate.acidity} options={["Low", "Medium(-)", "Medium", "Medium(+)", "High"]} onChange={(v) => updateField('palate', 'acidity', v)} />
              <SelectField label="Tannin" value={formData.palate.tannin} options={["Low", "Medium(-)", "Medium", "Medium(+)", "High"]} onChange={(v) => updateField('palate', 'tannin', v)} />
              <SelectField label="Alcohol" value={formData.palate.alcohol} options={["Low", "Medium", "High"]} onChange={(v) => updateField('palate', 'alcohol', v)} />
              <SelectField label="Body" value={formData.palate.body} options={["Light", "Medium(-)", "Medium", "Medium(+)", "Full"]} onChange={(v) => updateField('palate', 'body', v)} />
              <SelectField label="Flavor Intensity" value={formData.palate.flavorIntensity} options={["Light", "Medium(-)", "Medium", "Medium(+)", "Pronounced"]} onChange={(v) => updateField('palate', 'flavorIntensity', v)} />
              <SelectField label="Finish" value={formData.palate.finish} options={["Short", "Medium(-)", "Medium", "Medium(+)", "Long"]} onChange={(v) => updateField('palate', 'finish', v)} />
              <div className="col-span-full">
                <TagInput label="Flavor Characteristics" tags={formData.palate.flavorCharacteristics} onChange={(tags) => updateField('palate', 'flavorCharacteristics', tags)} />
              </div>
           </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <SelectField 
              label="Quality Level" 
              value={formData.conclusion.quality} 
              options={["Poor", "Acceptable", "Good", "Very Good", "Outstanding"]} 
              onChange={(v) => updateField('conclusion', 'quality', v)} 
            />
            <SelectField 
              label="Readiness for Drinking" 
              value={formData.conclusion.readiness} 
              options={["Too Young", "Can Drink, Potential for Aging", "Drink Now: Not Suitable for Aging", "Too Old"]} 
              onChange={(v) => updateField('conclusion', 'readiness', v)} 
            />
            
            <div className="mb-4">
               <label className="block text-sm font-medium text-stone-600 mb-1">Personal Rating (0-100)</label>
               <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={formData.conclusion.personalRating}
                  onChange={(e) => updateField('conclusion', 'personalRating', parseInt(e.target.value))}
                  className="w-full accent-wine-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
               />
               <div className="text-center font-serif font-bold text-2xl text-wine-800 mt-2">
                 {formData.conclusion.personalRating}
               </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-600 mb-1">Final Notes</label>
              <textarea 
                value={formData.conclusion.notes}
                onChange={e => updateField('conclusion', 'notes', e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-md h-24"
                placeholder="Overall impression..."
              />
            </div>
          </div>
        );
      default: return null;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[85vh] w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-wine-900 p-4 flex justify-between items-center text-white">
        <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
          {formData.name || "New Tasting"}
        </h2>
        <button onClick={onCancel} className="text-wine-200 hover:text-white text-sm">Cancel</button>
      </div>

      {/* Progress Bar (Only for Full Mode) */}
      {!isQuickMode && (
        <div className="flex bg-stone-100 border-b border-stone-200">
          {steps.map((s, idx) => (
            <div 
              key={idx} 
              className={`flex-1 py-3 flex justify-center items-center border-b-2 transition-colors ${
                step === idx ? 'border-wine-600 text-wine-800 font-medium' : 
                step > idx ? 'border-green-500 text-green-600' : 'border-transparent text-stone-400'
              }`}
            >
               <span className="hidden sm:inline text-xs uppercase tracking-wide">{s.title}</span>
               <span className="sm:hidden text-xs">{idx + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-between">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={`px-4 py-2 rounded-md border border-stone-300 text-stone-600 disabled:opacity-50 hover:bg-stone-100 flex items-center gap-1 ${isQuickMode ? 'invisible' : ''}`}
        >
          <ChevronLeft size={16} /> Back
        </button>

        {!isQuickMode && step < steps.length - 1 ? (
           <button 
             onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
             className="px-4 py-2 rounded-md bg-wine-800 text-white hover:bg-wine-900 flex items-center gap-1"
           >
             Next <ChevronRight size={16} />
           </button>
        ) : (
          <button 
            onClick={() => onSave(formData)}
            className="px-6 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 font-medium shadow-sm flex items-center gap-2"
          >
            <Check size={16} /> Save Entry
          </button>
        )}
      </div>
    </div>
  );
};