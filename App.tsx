import React, { useState, useEffect } from 'react';
import { TastingForm } from './components/TastingForm';
import { TastingCard } from './components/TastingCard';
import { WineInsights } from './components/WineInsights';
import { TastingNote } from './types';
import { saveTasting, getTastings, deleteTasting } from './services/storage';
import { Plus, Search, Filter, Wine, BarChart3, List } from 'lucide-react';

enum View {
  List,
  Add,
  Stats
}

function App() {
  const [view, setView] = useState<View>(View.List);
  const [notes, setNotes] = useState<TastingNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColor, setFilterColor] = useState<string>('All');

  useEffect(() => {
    setNotes(getTastings());
  }, [view]);

  const handleSave = (note: TastingNote) => {
    saveTasting(note);
    setView(View.List);
  };

  const filteredNotes = notes
    .filter(n => {
      if (filterColor !== 'All' && n.appearance.colorCategory !== filterColor) return false;
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        n.name.toLowerCase().includes(s) || 
        n.producer.toLowerCase().includes(s) || 
        n.grape.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0 md:pl-64">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-wine-900 text-wine-100 border-r border-wine-800 z-20">
        <div className="p-6 border-b border-wine-800">
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Wine className="text-wine-300" /> SommLog
          </h1>
          <p className="text-xs text-wine-300 mt-1 opacity-80">Professional Tasting Log</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView(View.List)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === View.List ? 'bg-wine-800 text-white' : 'hover:bg-wine-800/50'}`}
          >
            <List size={20} /> My Tastings
          </button>
          <button 
            onClick={() => setView(View.Stats)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === View.Stats ? 'bg-wine-800 text-white' : 'hover:bg-wine-800/50'}`}
          >
            <BarChart3 size={20} /> Insights
          </button>
          <button 
            onClick={() => setView(View.Add)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === View.Add ? 'bg-wine-800 text-white' : 'hover:bg-wine-800/50'}`}
          >
            <Plus size={20} /> New Note
          </button>
        </nav>
        <div className="p-6 text-xs text-wine-400 border-t border-wine-800">
          Powered by Gemini 2.5
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-wine-900 text-white p-4 sticky top-0 z-30 flex justify-between items-center shadow-md">
        <h1 className="font-serif text-xl font-bold flex items-center gap-2">
           <Wine className="text-wine-300 h-5 w-5" /> SommLog
        </h1>
        <button onClick={() => setView(View.Add)} className="bg-wine-700 p-2 rounded-full">
          <Plus size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        
        {view === View.Add && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <TastingForm onSave={handleSave} onCancel={() => setView(View.List)} />
          </div>
        )}

        {view === View.Stats && (
          <>
            <header className="mb-8">
              <h2 className="font-serif text-3xl font-bold text-wine-900">Cellar Analytics</h2>
              <p className="text-stone-500">Visualize your tasting history and palate preferences.</p>
            </header>
            <WineInsights notes={notes} />
          </>
        )}

        {(view === View.List || view === View.Stats) && (
          <>
            <header className={`mb-6 ${view === View.Stats ? 'mt-12' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                 <div>
                   <h2 className="font-serif text-3xl font-bold text-wine-900">Recent Tastings</h2>
                   <p className="text-stone-500">{notes.length} notes in your log</p>
                 </div>
                 {view !== View.Stats && (
                   <button 
                     onClick={() => setView(View.Add)}
                     className="hidden md:flex bg-wine-600 text-white px-4 py-2 rounded-lg hover:bg-wine-700 transition-colors items-center gap-2 shadow-sm"
                   >
                     <Plus size={18} /> Add Tasting
                   </button>
                 )}
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search wines, producers, grapes..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-wine-500"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <Filter className="text-stone-400 h-4 w-4" />
                  {['All', 'Red', 'White', 'Rose'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFilterColor(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        filterColor === c 
                          ? 'bg-wine-600 text-white' 
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="space-y-4">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 text-stone-400 bg-white rounded-lg border border-stone-200 border-dashed">
                  <Wine className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No wines found matching your criteria.</p>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <TastingCard 
                    key={note.id} 
                    note={note} 
                    onClick={() => {/* Typically open details view, omit for brevity */}} 
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-stone-200 z-30 flex justify-around py-3 text-xs font-medium text-stone-500 shadow-lg">
        <button onClick={() => setView(View.List)} className={`flex flex-col items-center gap-1 ${view === View.List ? 'text-wine-700' : ''}`}>
          <List size={20} /> List
        </button>
        <button onClick={() => setView(View.Add)} className={`flex flex-col items-center gap-1 ${view === View.Add ? 'text-wine-700' : ''}`}>
          <div className="bg-wine-600 text-white p-2 rounded-full -mt-6 border-4 border-white shadow-sm">
             <Plus size={24} />
          </div>
        </button>
        <button onClick={() => setView(View.Stats)} className={`flex flex-col items-center gap-1 ${view === View.Stats ? 'text-wine-700' : ''}`}>
          <BarChart3 size={20} /> Stats
        </button>
      </nav>
    </div>
  );
}

export default App;
