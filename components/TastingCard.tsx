import React from 'react';
import { TastingNote } from '../types';
import { MapPin, Calendar, Droplet, Zap, BookOpen, ChevronRight } from 'lucide-react';
import { getQualityColor, getQualityInitial } from '../utils';

interface Props {
  note: TastingNote;
  onClick: () => void;
}

export const TastingCard: React.FC<Props> = ({ note, onClick }) => {
  const getColorClass = () => {
    switch (note.appearance.colorCategory) {
      case 'Red': return 'bg-vermillion/10 text-vermillion border-vermillion/20';
      case 'White': return 'bg-sun/20 text-charcoal border-sun/30';
      case 'Rose': return 'bg-tangerine/10 text-tangerine border-tangerine/20';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getQualityBgClass = () => {
    switch (note.conclusion.quality) {
      case 'Outstanding': return 'bg-grape';
      case 'Very Good': return 'bg-vine';
      case 'Good': return 'bg-teal';
      case 'Acceptable': return 'bg-sun text-charcoal';
      default: return 'bg-stone-400';
    }
  };

  const getBorderColor = () => {
    switch (note.appearance.colorCategory) {
      case 'Red': return 'border-l-vermillion';
      case 'White': return 'border-l-sun';
      case 'Rose': return 'border-l-tangerine';
      default: return 'border-l-stone-300';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-3 md:p-4 border border-stone-200 border-l-4 ${getBorderColor()} shadow-sm hover:shadow-lg hover:border-stone-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 cursor-pointer group flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden`}
    >
      {/* Label Image Thumbnail */}
      <div className="h-20 w-20 shrink-0 bg-stone-100 rounded-lg border border-stone-100 overflow-hidden flex items-center justify-center group-hover:border-stone-200 transition-colors">
        {note.imageUrl ? (
          <img src={note.imageUrl} alt={note.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-2xl opacity-20 group-hover:opacity-30 transition-opacity">🍷</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getColorClass()}`}>
            {note.vintage || 'NV'} {note.appearance.colorCategory}
          </span>
          <span className="text-xs text-stone-400 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
          {note.type === 'Quick' ? (
             <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded flex items-center gap-1">
               <Zap size={10} /> Quick
             </span>
          ) : (
            <span className="text-[10px] bg-teal/10 text-teal px-1.5 py-0.5 rounded flex items-center gap-1">
               <BookOpen size={10} /> Full
            </span>
          )}
        </div>
        
        <h3 className="font-serif text-lg font-semibold text-charcoal group-hover:text-vermillion truncate transition-colors duration-200">
          {note.name || "Unknown Wine"}
        </h3>
        <p className="text-sm text-stone-500 font-medium truncate">{note.producer}</p>
        
        <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 truncate">
          <span className="flex items-center gap-1 truncate">
            <MapPin size={12} /> {note.region}, {note.country}
          </span>
          <span className="flex items-center gap-1 truncate">
            <Droplet size={12} /> {note.grape}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto sm:border-l sm:border-stone-100 sm:pl-4 justify-between sm:justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-stone-100 sm:border-t-0">
         <div className="text-right">
            <div className="text-xs text-stone-400 uppercase tracking-wider">Score</div>
            <div className="text-2xl font-serif font-bold text-charcoal">{note.conclusion.personalRating}</div>
         </div>
         <div className="flex flex-col items-center gap-1">
           <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 ${getQualityBgClass()}`} title={note.conclusion.quality}>
             {getQualityInitial(note.conclusion.quality)}
           </div>
           <span className="text-[10px] text-stone-400 font-medium">{note.conclusion.quality}</span>
         </div>
         <ChevronRight size={20} className="text-stone-300 group-hover:text-vermillion group-hover:translate-x-0.5 transition-all duration-200 hidden sm:block" />
      </div>
    </div>
  );
};