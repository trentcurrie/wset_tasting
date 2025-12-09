import React, { useState } from 'react';
import { TastingForm } from './components/TastingForm';
import { TastingCard } from './components/TastingCard';
import { TastingDetail } from './components/TastingDetail';
import { WineInsights } from './components/WineInsights';
import { AromaReference } from './components/AromaReference';
import { ThemeToggle } from './components/ThemeToggle';
import { TastingNote } from './types';
import { useTastings, FilterCategory } from './hooks';
import { Plus, Search, Filter, Wine, BarChart3, List, Book, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';

enum View {
  List,
  Add,
  Stats,
  Reference,
  Detail,
  Edit
}

function App() {
  const [view, setView] = useState<View>(View.List);
  const [selectedNote, setSelectedNote] = useState<TastingNote | null>(null);
  const { signOut, user } = useAuth();
  
  // Use the custom hook instead of direct storage operations
  const {
    filteredTastings,
    totalCount,
    filter,
    searchTerm,
    setFilter,
    setSearchTerm,
    addTasting,
    updateTasting,
    tastings,
  } = useTastings();

  const handleSave = (note: TastingNote) => {
    if (view === View.Edit && selectedNote) {
      updateTasting(note);
    } else {
      addTasting(note);
    }
    setSelectedNote(null);
    setView(View.List);
  };

  const handleCardClick = (note: TastingNote) => {
    setSelectedNote(note);
    setView(View.Detail);
  };

  const handleEditFromDetail = () => {
    setView(View.Edit);
  };

  const handleCloseDetail = () => {
    setSelectedNote(null);
    setView(View.List);
  };

  const handleCancelEdit = () => {
    if (selectedNote) {
      setView(View.Detail);
    } else {
      setView(View.List);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter as FilterCategory);
  };

  return (
    <div className="min-h-screen bg-canvas-warm dark:bg-stone-900 pb-20 md:pb-0 md:pl-64 grid-overlay">
      
      {/* Desktop Sidebar - Bauhaus-inspired with bold geometric accent */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-charcoal text-stone-100 z-20">
        {/* Geometric accent bar - Albers inspired */}
        <div className="h-2 w-full flex">
          <div className="flex-1 bg-vermillion"></div>
          <div className="flex-1 bg-tangerine"></div>
          <div className="flex-1 bg-teal"></div>
        </div>
        
        <div className="p-6 border-b border-stone-800">
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Wine className="text-vermillion" /> <span className="text-vermillion">Pour</span>Decisions
          </h1>
          <p className="text-xs text-stone-400 mt-1">Drink. Rate. Repeat.</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView(View.List)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden group ${view === View.List ? 'bg-stone-800 text-white shadow-sm' : 'hover:bg-stone-800/50 text-stone-300'}`}
          >
            <List size={20} className={view === View.List ? 'text-vermillion' : 'group-hover:text-vermillion transition-colors'} /> 
            <span className="relative">
              My Tastings
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-vermillion transition-all duration-200 ${view === View.List ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </span>
          </button>
          <button 
            onClick={() => setView(View.Stats)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden group ${view === View.Stats ? 'bg-stone-800 text-white shadow-sm' : 'hover:bg-stone-800/50 text-stone-300'}`}
          >
            <BarChart3 size={20} className={view === View.Stats ? 'text-teal' : 'group-hover:text-teal transition-colors'} /> 
            <span className="relative">
              Insights
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-teal transition-all duration-200 ${view === View.Stats ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </span>
          </button>
          <button 
            onClick={() => setView(View.Reference)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden group ${view === View.Reference ? 'bg-stone-800 text-white shadow-sm' : 'hover:bg-stone-800/50 text-stone-300'}`}
          >
            <Book size={20} className={view === View.Reference ? 'text-vine' : 'group-hover:text-vine transition-colors'} /> 
            <span className="relative">
              Aroma Guide
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-vine transition-all duration-200 ${view === View.Reference ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </span>
          </button>
          <button 
            onClick={() => setView(View.Add)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-vermillion text-white hover:bg-vermillion/90 active:scale-98 transition-all duration-200 mt-4 shadow-md hover:shadow-lg"
          >
            <Plus size={20} /> New Note
          </button>
        </nav>
        
        {/* Theme toggle and Logout at bottom of sidebar */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-stone-400">Theme</span>
            <ThemeToggle />
          </div>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/50 transition-all duration-200"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header - with geometric accent */}
      <header className="md:hidden bg-charcoal text-white p-4 sticky top-0 z-30 flex justify-between items-center shadow-md relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-vermillion"></div>
          <div className="flex-1 bg-tangerine"></div>
          <div className="flex-1 bg-teal"></div>
          <div className="flex-1 bg-vine"></div>
        </div>
        <h1 className="font-serif text-xl font-bold flex items-center gap-2">
           <Wine className="text-vermillion h-5 w-5" /> <span className="text-vermillion">Pour</span>Decisions
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setView(View.Add)} className="bg-vermillion p-2.5 rounded-full hover:bg-vermillion/80 active:scale-95 transition-all shadow-lg">
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        
        {view === View.Add && (
          <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <TastingForm onSave={handleSave} onCancel={() => setView(View.List)} />
          </div>
        )}

        {view === View.Edit && selectedNote && (
          <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <TastingForm onSave={handleSave} onCancel={handleCancelEdit} initialNote={selectedNote} />
          </div>
        )}

        {view === View.Detail && selectedNote && (
          <div className="fixed inset-0 md:left-64 bg-canvas-warm dark:bg-stone-900 z-40 overflow-auto p-4 md:p-8 animate-in fade-in duration-200">
            <TastingDetail 
              note={selectedNote} 
              onEdit={handleEditFromDetail} 
              onClose={handleCloseDetail} 
            />
          </div>
        )}

        {view === View.Reference && (
          <div className="fixed inset-0 md:left-64 bg-canvas-warm dark:bg-stone-900 z-40 overflow-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <AromaReference onClose={() => setView(View.List)} />
          </div>
        )}

        {view === View.Stats && (
          <>
            <header className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="font-serif text-3xl font-bold text-charcoal dark:text-stone-100">Cellar Analytics</h2>
              <p className="text-stone-500 dark:text-stone-400">Visualize your tasting history and palate preferences.</p>
            </header>
            <WineInsights notes={tastings} />
          </>
        )}

        {(view === View.List || view === View.Stats) && (
          <>
            <header className={`mb-6 ${view === View.Stats ? 'mt-12' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                 <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                   <h2 className="font-serif text-3xl font-bold text-charcoal dark:text-stone-100">Recent Tastings</h2>
                   <p className="text-stone-500 dark:text-stone-400">{totalCount} notes in your log</p>
                 </div>
                 {view !== View.Stats && (
                   <button 
                     onClick={() => setView(View.Add)}
                     className="hidden md:flex bg-vermillion text-white px-4 py-2 rounded-lg hover:bg-vermillion/90 active:scale-95 transition-all items-center gap-2 shadow-md hover:shadow-lg"
                   >
                     <Plus size={18} /> Add Tasting
                   </button>
                 )}
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search wines, producers, grapes..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <Filter className="text-stone-400 h-4 w-4 shrink-0" />
                  {(['All', 'Red', 'White', 'Rose'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => handleFilterChange(c)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                        filter === c 
                          ? c === 'Red' ? 'bg-vermillion text-white shadow-sm' 
                          : c === 'White' ? 'bg-sun text-charcoal shadow-sm' 
                          : c === 'Rose' ? 'bg-tangerine text-white shadow-sm'
                          : 'bg-charcoal text-white shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 hover:text-charcoal dark:hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="space-y-4">
              {filteredTastings.length === 0 ? (
                <div className="text-center py-16 text-stone-400 bg-white dark:bg-stone-800 rounded-xl border-2 border-stone-200 dark:border-stone-700 border-dashed animate-in fade-in duration-300">
                  <Wine className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium text-stone-500 dark:text-stone-400">No wines found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredTastings.map((note, index) => (
                  <div 
                    key={note.id} 
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                  >
                    <TastingCard 
                      note={note} 
                      onClick={() => handleCardClick(note)} 
                    />
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Mobile Navigation - Bauhaus styled */}
      <nav className="md:hidden fixed bottom-0 w-full bg-charcoal z-30 flex justify-around py-2 text-xs font-medium text-stone-400 shadow-2xl border-t border-stone-700">
        <button onClick={() => setView(View.List)} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${view === View.List ? 'text-vermillion bg-stone-800' : 'hover:text-white'}`}>
          <List size={20} /> List
        </button>
        <button onClick={() => setView(View.Stats)} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${view === View.Stats ? 'text-teal bg-stone-800' : 'hover:text-white'}`}>
          <BarChart3 size={20} /> Stats
        </button>
        <button onClick={() => setView(View.Add)} className="flex flex-col items-center gap-1 -mt-5">
          <div className={`p-3.5 rounded-full border-4 border-charcoal shadow-xl transition-all duration-200 active:scale-90 ${view === View.Add ? 'bg-vermillion' : 'bg-tangerine hover:bg-tangerine/90'} text-white`}>
            <Plus size={24} />
          </div>
        </button>
        <button onClick={() => setView(View.Reference)} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${view === View.Reference ? 'text-vine bg-stone-800' : 'hover:text-white'}`}>
          <Book size={20} /> Guide
        </button>
      </nav>
    </div>
  );
}

export default App;
