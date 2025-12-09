import React, { useState, useRef } from 'react';
import { 
  TastingNote, INITIAL_TASTING_NOTE, 
  TastingType
} from '../types';
import { compressImage } from '../utils';
import { searchDescriptors, getCategoryForDescriptor, getDescriptorColor } from '../constants/wsatAromas';
import { Loader2, Sparkles, ChevronRight, ChevronLeft, Check, Camera, Upload, X, Zap, BookOpen } from 'lucide-react';

interface Props {
  onSave: (note: TastingNote) => void;
  onCancel: () => void;
  initialNote?: TastingNote;
}

// Helpers for Select inputs
const SelectField = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-stone-200 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 focus:ring-2 focus:ring-teal focus:border-teal transition-colors"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TagInput = ({ label, tags, onChange }: { label: string, tags: string[], onChange: (tags: string[]) => void }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = searchDescriptors(input).filter(s => !tags.includes(s));
  
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const getChipColors = (tag: string) => {
    const colors = getDescriptorColor(tag);
    if (colors) {
      return `${colors.bg} ${colors.text} border ${colors.border}`;
    }
    // Custom descriptor - use teal
    return 'bg-teal/15 text-teal border border-teal/30';
  };

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 min-h-[44px]">
        {tags.map((tag, index) => {
          const category = getCategoryForDescriptor(tag);
          return (
            <span 
              key={index} 
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${getChipColors(tag)}`}
              title={category || 'Custom descriptor'}
            >
              {tag}
              <button type="button" onClick={() => removeTag(index)} className="hover:opacity-70">
                <X size={14} />
              </button>
            </span>
          );
        })}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder={tags.length === 0 ? "Type or select descriptors..." : ""}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-charcoal dark:text-stone-100 placeholder-stone-400"
        />
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg shadow-lg max-h-48 overflow-auto">
          {suggestions.map(suggestion => {
            const colors = getDescriptorColor(suggestion);
            return (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(suggestion)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-between transition-colors"
              >
                <span className="text-charcoal dark:text-stone-100">{suggestion}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${colors ? `${colors.bg} ${colors.text}` : 'text-stone-400'}`}>
                  {getCategoryForDescriptor(suggestion)?.split(' › ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Custom tag hint */}
      {input && !suggestions.some(s => s.toLowerCase() === input.toLowerCase()) && (
        <p className="text-xs text-stone-400 mt-1">
          Press Enter to add "{input}" as a custom descriptor
        </p>
      )}
    </div>
  );
};

export const TastingForm: React.FC<Props> = ({ onSave, onCancel, initialNote }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<TastingNote>(
    initialNote ? { ...initialNote } : { ...INITIAL_TASTING_NOTE, id: crypto.randomUUID() }
  );
  const isEditing = !!initialNote;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setIsAnalyzing(true);
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
      } catch (error) {
        console.error(error);
        alert("Could not upload the image. Please try again.");
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
      <div className="flex bg-stone-100 dark:bg-stone-700 p-1 rounded-lg mb-6">
        <button
          onClick={() => switchMode('Quick')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            isQuickMode ? 'bg-white dark:bg-stone-600 text-charcoal dark:text-stone-100 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
          }`}
        >
          <Zap size={16} className={isQuickMode ? 'text-tangerine' : ''} /> Quick Log
        </button>
        <button
          onClick={() => switchMode('Full')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            !isQuickMode ? 'bg-white dark:bg-stone-600 text-charcoal dark:text-stone-100 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
          }`}
        >
          <BookOpen size={16} className={!isQuickMode ? 'text-teal' : ''} /> Full Tasting
        </button>
      </div>

      {/* Image Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
          formData.imageUrl ? 'border-teal/30 bg-stone-50 dark:bg-stone-700' : 'border-stone-300 dark:border-stone-600 hover:border-teal hover:bg-stone-50 dark:hover:bg-stone-700'
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
               <span className="bg-white/90 dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                 <Camera size={16} /> Retake Photo
               </span>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
             <div className="bg-teal/10 text-teal p-3 rounded-full inline-block mb-2">
               <Camera size={24} />
             </div>
             <p className="text-stone-600 dark:text-stone-300 font-medium">Take a photo of the label</p>
             <p className="text-stone-400 text-xs mt-1">AI will extract name, vintage & producer</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/80 dark:bg-stone-900/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <Loader2 className="animate-spin text-teal h-8 w-8 mb-2" />
            <p className="text-charcoal dark:text-stone-100 font-medium animate-pulse">Analyzing Label...</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">Wine Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border border-stone-200 dark:border-stone-600 rounded-md mt-1 bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100"
            placeholder="e.g. Chateau Margaux"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">Vintage</label>
          <input 
            type="text" 
            value={formData.vintage} 
            onChange={e => setFormData({...formData, vintage: e.target.value})}
            className="w-full p-2 border border-stone-200 dark:border-stone-600 rounded-md mt-1 bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100"
            placeholder="e.g. 2015"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">Producer</label>
          <input 
            type="text" 
            value={formData.producer} 
            onChange={e => setFormData({...formData, producer: e.target.value})}
            className="w-full p-2 border border-stone-200 dark:border-stone-600 rounded-md mt-1 bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">Country</label>
          <input 
            type="text" 
            value={formData.country} 
            onChange={e => setFormData({...formData, country: e.target.value})}
            className="w-full p-2 border border-stone-200 dark:border-stone-600 rounded-md mt-1 bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">Region</label>
          <input 
            type="text" 
            value={formData.region} 
            onChange={e => setFormData({...formData, region: e.target.value})}
            className="w-full p-2 border border-stone-200 dark:border-stone-600 rounded-md mt-1 bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100"
          />
        </div>
        
        {/* Quick Mode Additional Fields directly here */}
        {isQuickMode && (
          <div className="col-span-2 space-y-4 pt-4 border-t border-stone-100 dark:border-stone-600 mt-2">
            <div>
               <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Your Rating (0-100)</label>
               <div className="flex items-center gap-4">
                 <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={formData.conclusion.personalRating}
                    onChange={(e) => updateField('conclusion', 'personalRating', parseInt(e.target.value))}
                    className="flex-1 accent-vermillion h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer"
                 />
                 <span className="font-serif font-bold text-2xl text-charcoal dark:text-stone-100 w-12 text-center">
                   {formData.conclusion.personalRating}
                 </span>
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Notes</label>
              <textarea 
                value={formData.conclusion.notes}
                onChange={e => updateField('conclusion', 'notes', e.target.value)}
                className="w-full p-2 border border-stone-200 dark:border-stone-600 rounded-md h-24 bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100"
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
                  className="w-full accent-vermillion h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
               />
               <div className="text-center font-serif font-bold text-2xl text-charcoal mt-2">
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
    <div className="bg-white dark:bg-stone-800 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[85vh] w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-charcoal p-4 flex justify-between items-center text-white">
        <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
          {isEditing ? `Edit: ${formData.name}` : (formData.name || "New Tasting")}
        </h2>
        <button onClick={onCancel} className="text-stone-400 hover:text-white text-sm">Cancel</button>
      </div>

      {/* Progress Bar (Only for Full Mode) */}
      {!isQuickMode && (
        <div className="flex bg-stone-100 dark:bg-stone-700 border-b border-stone-200 dark:border-stone-600">
          {steps.map((s, idx) => (
            <button 
              key={idx} 
              type="button"
              onClick={() => setStep(idx)}
              className={`flex-1 py-3 flex justify-center items-center border-b-2 transition-all cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-600 ${
                step === idx ? 'border-vermillion text-charcoal dark:text-stone-100 font-medium bg-white dark:bg-stone-800' : 
                step > idx ? 'border-vine text-vine hover:text-vine/80' : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
               <span className="hidden sm:inline text-xs uppercase tracking-wide">{s.title}</span>
               <span className="sm:hidden text-xs">{idx + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 flex justify-between">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={`px-4 py-2 rounded-md border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 disabled:opacity-50 hover:bg-stone-100 dark:hover:bg-stone-600 flex items-center gap-1 ${isQuickMode ? 'invisible' : ''}`}
        >
          <ChevronLeft size={16} /> Back
        </button>

        {!isQuickMode && step < steps.length - 1 ? (
           <button 
             onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
             className="px-4 py-2 rounded-md bg-charcoal text-white hover:bg-stone-800 flex items-center gap-1"
           >
             Next <ChevronRight size={16} />
           </button>
        ) : (
          <button 
            onClick={() => onSave(formData)}
            className="px-6 py-2 rounded-md bg-vine text-white hover:bg-vine/90 font-medium shadow-sm flex items-center gap-2"
          >
            <Check size={16} /> {isEditing ? 'Update' : 'Save Entry'}
          </button>
        )}
      </div>
    </div>
  );
};