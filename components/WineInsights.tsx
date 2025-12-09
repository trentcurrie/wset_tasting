import React, { useState } from 'react';
import { TastingNote } from '../types';
import { scaleToNum } from '../utils';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import { ChevronDown, Wine, Grape } from 'lucide-react';

interface Props {
  notes: TastingNote[];
}

// Bauhaus-inspired chart colors with gradients
const VERMILLION = '#E31C25';
const TEAL = '#00AEEF';
const VINE = '#2D8C4F';
const GRAPE = '#6B2D7B';
const SUN = '#FFD700';
const TANGERINE = '#FF6B00';

const QUALITY_COLORS: Record<string, string> = {
  'Outstanding': GRAPE,
  'Very Good': VINE,
  'Good': TEAL,
  'Acceptable': SUN,
  'Poor': VERMILLION,
  'Unknown': '#999999'
};

const BAR_COLORS = [TEAL, VINE, VERMILLION, GRAPE, SUN, TANGERINE];

export const WineInsights: React.FC<Props> = ({ notes }) => {
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null);
  
  if (notes.length === 0) return <div className="text-center text-stone-400 py-10">No data for insights yet.</div>;

  // 1. Average Structure Profile
  const structureData = [
    { subject: 'Acidity', A: 0, fullMark: 5 },
    { subject: 'Tannin', A: 0, fullMark: 5 },
    { subject: 'Alcohol', A: 0, fullMark: 5 },
    { subject: 'Body', A: 0, fullMark: 5 },
    { subject: 'Sweetness', A: 0, fullMark: 5 },
    { subject: 'Finish', A: 0, fullMark: 5 },
  ];

  notes.forEach(note => {
    structureData[0].A += scaleToNum(note.palate.acidity);
    structureData[1].A += scaleToNum(note.palate.tannin);
    structureData[2].A += scaleToNum(note.palate.alcohol === 'High' ? 'High' : note.palate.alcohol === 'Medium' ? 'Medium' : 'Low');
    structureData[3].A += scaleToNum(note.palate.body);
    structureData[4].A += scaleToNum(note.palate.sweetness);
    structureData[5].A += scaleToNum(note.palate.finish);
  });

  structureData.forEach(d => d.A = parseFloat((d.A / notes.length).toFixed(1)));

  // 2. Country Distribution
  const countryCount: Record<string, number> = {};
  notes.forEach(n => {
    const c = n.country || 'Unknown';
    countryCount[c] = (countryCount[c] || 0) + 1;
  });
  const countryData = Object.entries(countryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Flavor Frequency Analysis
  const getFlavorFrequency = () => {
    const frequency: Record<string, number> = {};
    notes.forEach(t => {
      [...(t.nose?.characteristics || []), ...(t.palate?.flavorCharacteristics || [])].forEach(flavor => {
        frequency[flavor] = (frequency[flavor] || 0) + 1;
      });
    });
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  };

  const flavorData = getFlavorFrequency();

  // 4. Quality Distribution
  const getQualityDistribution = () => {
    const distribution: Record<string, number> = {};
    notes.forEach(t => {
      const quality = t.conclusion?.quality || 'Unknown';
      distribution[quality] = (distribution[quality] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const qualityData = getQualityDistribution();

  // 5. Interactive Similar Wines Finder
  const selectedWine = notes.find(n => n.id === selectedWineId) || null;
  
  const getSimilarWinesFor = (wine: TastingNote) => {
    const wineFlavorSet = new Set([
      ...(wine.nose?.characteristics || []), 
      ...(wine.palate?.flavorCharacteristics || [])
    ]);
    
    return notes
      .filter(t => t.id !== wine.id)
      .map(t => {
        const otherFlavors = [...(t.nose?.characteristics || []), ...(t.palate?.flavorCharacteristics || [])];
        const shared = otherFlavors.filter(f => wineFlavorSet.has(f));
        return { 
          wine: t, 
          sharedCount: shared.length, 
          sharedFlavors: shared,
          similarity: otherFlavors.length > 0 ? Math.round((shared.length / otherFlavors.length) * 100) : 0
        };
      })
      .filter(s => s.sharedCount > 0)
      .sort((a, b) => b.sharedCount - a.sharedCount);
  };

  const similarResults = selectedWine ? getSimilarWinesFor(selectedWine) : [];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-charcoal text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="font-medium">{label || payload[0]?.name}</p>
          <p className="text-stone-300">{payload[0]?.value} {payload[0]?.value === 1 ? 'wine' : 'wines'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mb-8 animate-in fade-in duration-500">
      {/* Top row - Radar and Country charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal"></span>
            Average Palate Profile
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={structureData}>
                <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#44403c', fontSize: 11, fontWeight: 500 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                <Radar
                  name="Average"
                  dataKey="A"
                  stroke={TEAL}
                  strokeWidth={2}
                  fill={TEAL}
                  fillOpacity={0.25}
                  dot={{ r: 4, fill: TEAL }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vermillion"></span>
            Top Countries
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12, fill: '#44403c'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,174,239,0.1)'}} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {countryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second row - Most Common Flavors */}
      {flavorData.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vine"></span>
            Most Common Descriptors
          </h3>
          <div className="space-y-3">
            {flavorData.map((item, index) => {
              const percent = (item.count / flavorData[0].count) * 100;
              return (
                <div key={item.name} className="flex items-center gap-3 group">
                  <span className="text-sm text-stone-400 w-6 font-mono">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-1 h-9 bg-stone-100 rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full rounded-lg transition-all duration-700 ease-out group-hover:opacity-90"
                      style={{ 
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, ${BAR_COLORS[index % BAR_COLORS.length]}dd, ${BAR_COLORS[(index + 1) % BAR_COLORS.length]}aa)`
                      }}
                    />
                    <span className="absolute inset-0 flex items-center px-3 text-sm font-medium text-charcoal">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-stone-600 w-10 text-right tabular-nums">{item.count}×</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Third row - Quality Distribution and Wine Similarity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quality Distribution Pie */}
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-grape"></span>
            Quality Distribution
          </h3>
          <div className="flex justify-center">
            <PieChart width={280} height={220}>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {qualityData.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={QUALITY_COLORS[entry.name] || '#999'} 
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
              />
            </PieChart>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {qualityData.map(entry => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: QUALITY_COLORS[entry.name] || '#999' }} 
                />
                <span className="text-stone-600">{entry.name}</span>
                <span className="text-stone-400 font-mono">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Wine Similarity Finder */}
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tangerine"></span>
            Find Similar Wines
          </h3>
          <p className="text-sm text-stone-500 mb-4">Select a wine to discover similar bottles</p>
          
          {/* Wine Selector Dropdown */}
          <div className="relative mb-4">
            <select
              value={selectedWineId || ''}
              onChange={(e) => setSelectedWineId(e.target.value || null)}
              className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 pr-10 text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-tangerine/50 focus:border-tangerine transition-colors cursor-pointer"
            >
              <option value="">Choose a wine...</option>
              {notes.map(wine => (
                <option key={wine.id} value={wine.id}>
                  {wine.name} ({wine.vintage || 'NV'})
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>

          {/* Results */}
          {!selectedWine && (
            <div className="text-center py-8 text-stone-400">
              <Wine size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a wine above to see similar bottles</p>
            </div>
          )}
          
          {selectedWine && similarResults.length === 0 && (
            <div className="text-center py-8 text-stone-400">
              <Grape size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No similar wines found for "{selectedWine.name}"</p>
              <p className="text-xs mt-1">Add more tasting notes to see connections</p>
            </div>
          )}

          {selectedWine && similarResults.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {similarResults.map(({ wine, sharedCount, sharedFlavors, similarity }) => (
                <div 
                  key={wine.id} 
                  className="p-3 bg-gradient-to-r from-tangerine/5 to-transparent rounded-lg border-l-4 border-tangerine hover:from-tangerine/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-charcoal text-sm truncate flex-1 mr-2">{wine.name}</p>
                    <span className="bg-tangerine/15 text-tangerine px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                      {sharedCount} match{sharedCount !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sharedFlavors.slice(0, 5).map(flavor => (
                      <span 
                        key={flavor} 
                        className="px-2 py-0.5 bg-white border border-stone-200 rounded-full text-xs text-stone-600"
                      >
                        {flavor}
                      </span>
                    ))}
                    {sharedFlavors.length > 5 && (
                      <span className="px-2 py-0.5 text-xs text-stone-400">
                        +{sharedFlavors.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
