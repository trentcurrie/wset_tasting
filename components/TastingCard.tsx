import React from 'react';
import { TastingNote } from '../types';
import { MapPin, Calendar, Droplet, Zap, BookOpen } from 'lucide-react';

interface Props {
  note: TastingNote;
  onClick: () => void;
}

export const TastingCard: React.FC<Props> = ({ note, onClick }) => {
  const getColorClass = () => {
    switch (note.appearance.colorCategory) {
      case 'Red': return 'bg-red-100 text-red-800 border-red-200';
      case 'White': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Rose': return 'bg-pink-50 text-pink-700 border-pink-200';
      default: return 'bg-stone-100';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg p-3 md:p-4 border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden"
    >
      {/* Label Image Thumbnail */}
      <div className="h-20 w-20 shrink-0 bg-stone-100 rounded-md border border-stone-100 overflow-hidden flex items-center justify-center">
        {note.imageUrl ? (
          <img src={note.imageUrl} alt={note.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-2xl opacity-20">🍷</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getColorClass()}`}>
            {note.vintage} {note.appearance.colorCategory}
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
            <span className="text-[10px] bg-wine-50 text-wine-600 px-1.5 py-0.5 rounded flex items-center gap-1">
               <BookOpen size={10} /> Full
            </span>
          )}
        </div>
        
        <h3 className="font-serif text-lg font-semibold text-wine-900 group-hover:text-wine-600 truncate">
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
            <div className="text-2xl font-serif font-bold text-wine-800">{note.conclusion.personalRating}</div>
         </div>
         <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
           note.conclusion.quality === 'Outstanding' ? 'bg-purple-600' :
           note.conclusion.quality === 'Very Good' ? 'bg-green-600' :
           note.conclusion.quality === 'Good' ? 'bg-blue-500' :
           note.conclusion.quality === 'Acceptable' ? 'bg-yellow-500' :
           'bg-stone-400'
         }`}>
           {note.conclusion.quality[0]}
         </div>
      </div>
    </div>
  );
};