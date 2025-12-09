import React from 'react';
import { TastingNote } from '../types';
import { getQualityInitial } from '../utils';
import { X, Edit3, MapPin, Calendar, Droplet, Wine, Eye, Wind, Grape, Award } from 'lucide-react';

interface Props {
  note: TastingNote;
  onClose: () => void;
  onEdit: () => void;
}

const Section = ({ title, icon: Icon, children, color = 'teal', delay = 0 }: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  color?: 'teal' | 'vermillion' | 'tangerine' | 'vine' | 'grape';
  delay?: number;
}) => {
  const colorClasses = {
    teal: 'bg-teal/10 text-teal border-teal/20',
    vermillion: 'bg-vermillion/10 text-vermillion border-vermillion/20',
    tangerine: 'bg-tangerine/10 text-tangerine border-tangerine/20',
    vine: 'bg-vine/10 text-vine border-vine/20',
    grape: 'bg-grape/10 text-grape border-grape/20',
  };
  
  return (
    <div 
      className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className={`px-4 py-2.5 border-b ${colorClasses[color]} flex items-center gap-2`}>
        <Icon size={16} />
        <h3 className="font-semibold text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

const Tag = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'highlight' }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium transition-transform hover:scale-105 cursor-default ${
    variant === 'highlight' 
      ? 'bg-teal/15 text-teal border border-teal/30' 
      : 'bg-stone-100 text-stone-600'
  }`}>
    {children}
  </span>
);

const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
  value ? (
    <div className="flex justify-between py-2 border-b border-stone-100 last:border-0 group">
      <span className="text-stone-500 text-sm">{label}</span>
      <span className="text-charcoal font-medium text-sm group-hover:text-teal transition-colors">{value}</span>
    </div>
  ) : null
);

export const TastingDetail: React.FC<Props> = ({ note, onClose, onEdit }) => {
  const getQualityBgClass = () => {
    switch (note.conclusion.quality) {
      case 'Outstanding': return 'bg-grape';
      case 'Very Good': return 'bg-vine';
      case 'Good': return 'bg-teal';
      case 'Acceptable': return 'bg-sun text-charcoal';
      default: return 'bg-stone-400';
    }
  };

  const getColorBadgeClass = () => {
    switch (note.appearance.colorCategory) {
      case 'Red': return 'bg-vermillion';
      case 'White': return 'bg-sun text-charcoal';
      case 'Rose': return 'bg-tangerine';
      default: return 'bg-stone-500';
    }
  };

  return (
    <div className="bg-canvas-warm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] w-full max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="bg-charcoal relative">
        {/* Top bar with buttons */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-700">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getColorBadgeClass()}`}>
              {note.vintage || 'NV'} {note.appearance.colorCategory}
            </span>
            <span className="text-stone-400 text-xs flex items-center gap-1.5">
              <Calendar size={12} />
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-white transition-all duration-200 flex items-center gap-1.5 text-sm"
              title="Edit"
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-vermillion/80 active:scale-95 rounded-lg text-white transition-all duration-200"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main header content */}
        <div className="p-5 flex gap-5 items-start">
          {/* Label Image */}
          <div className="h-28 w-20 shrink-0 bg-stone-800 rounded-lg overflow-hidden flex items-center justify-center border border-stone-700 shadow-lg">
            {note.imageUrl ? (
              <img src={note.imageUrl} alt={note.name} className="h-full w-full object-cover" />
            ) : (
              <Wine className="text-stone-600" size={28} />
            )}
          </div>

          {/* Wine Info */}
          <div className="flex-1 min-w-0 text-white">
            <h1 className="font-serif text-xl md:text-2xl font-bold mb-1 leading-tight">{note.name}</h1>
            <p className="text-stone-300 font-medium text-sm mb-3">{note.producer}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> {note.region}, {note.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Grape size={12} /> {note.grape}
              </span>
            </div>
          </div>

          {/* Score Badge - positioned to not overlap */}
          <div className="text-center shrink-0 pl-2">
            <div className="text-3xl md:text-4xl font-serif font-bold text-white leading-none">{note.conclusion.personalRating}</div>
            <div className="text-xs text-stone-500 mb-2">/ 100</div>
            <div className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${getQualityBgClass()}`}>
              {getQualityInitial(note.conclusion.quality)}
            </div>
            <div className="text-xs text-stone-400 mt-1 whitespace-nowrap">{note.conclusion.quality}</div>
          </div>
        </div>

        {/* Geometric accent */}
        <div className="h-1 flex">
          <div className="flex-1 bg-vermillion"></div>
          <div className="flex-1 bg-tangerine"></div>
          <div className="flex-1 bg-teal"></div>
          <div className="flex-1 bg-vine"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Appearance */}
          <Section title="Appearance" icon={Eye} color="tangerine" delay={50}>
            <InfoRow label="Clarity" value={note.appearance.clarity} />
            <InfoRow label="Intensity" value={note.appearance.intensity} />
            <InfoRow label="Color" value={note.appearance.color} />
          </Section>

          {/* Nose */}
          <Section title="Nose" icon={Wind} color="teal" delay={100}>
            <InfoRow label="Condition" value={note.nose.condition} />
            <InfoRow label="Intensity" value={note.nose.intensity} />
            <InfoRow label="Development" value={note.nose.development} />
            {note.nose.characteristics.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-2">Aromas</p>
                <div className="flex flex-wrap gap-1.5">
                  {note.nose.characteristics.map((char, i) => (
                    <Tag key={i} variant="highlight">{char}</Tag>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Palate */}
          <Section title="Palate" icon={Droplet} color="vine" delay={150}>
            <div className="grid grid-cols-2 gap-x-4">
              <InfoRow label="Sweetness" value={note.palate.sweetness} />
              <InfoRow label="Acidity" value={note.palate.acidity} />
              <InfoRow label="Tannin" value={note.palate.tannin} />
              <InfoRow label="Alcohol" value={note.palate.alcohol} />
              <InfoRow label="Body" value={note.palate.body} />
              <InfoRow label="Finish" value={note.palate.finish} />
            </div>
            {note.palate.flavorCharacteristics.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-2">Flavors</p>
                <div className="flex flex-wrap gap-1.5">
                  {note.palate.flavorCharacteristics.map((char, i) => (
                    <Tag key={i} variant="highlight">{char}</Tag>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Conclusion */}
          <Section title="Conclusion" icon={Award} color="grape" delay={200}>
            <InfoRow label="Quality" value={note.conclusion.quality} />
            <InfoRow label="Readiness" value={note.conclusion.readiness} />
            <InfoRow label="Rating" value={`${note.conclusion.personalRating}/100`} />
            {note.conclusion.notes && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-2">Notes</p>
                <p className="text-sm text-charcoal leading-relaxed">{note.conclusion.notes}</p>
              </div>
            )}
          </Section>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stone-200 bg-white flex justify-between items-center">
        <button 
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 hover:border-stone-400 active:scale-95 transition-all duration-200"
        >
          Close
        </button>
        <button 
          onClick={onEdit}
          className="px-6 py-2 rounded-lg bg-vermillion text-white hover:bg-vermillion/90 active:scale-95 font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <Edit3 size={16} /> Edit Note
        </button>
      </div>
    </div>
  );
};

export default TastingDetail;
