import React from 'react';
import { TastingNote } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';

interface Props {
  notes: TastingNote[];
}

const scaleToNum = (val: string) => {
  const map: Record<string, number> = {
    "Low": 1, "Light": 1, "Dry": 1, "Short": 1,
    "Medium(-)": 2, "Off-Dry": 2, "Medium-Dry": 2,
    "Medium": 3, "Medium-Sweet": 3,
    "Medium(+)": 4, "Sweet": 4, "Full": 5, "Long": 5,
    "High": 5, "Pronounced": 5, "Luscious": 5, "Outstanding": 5
  };
  return map[val] || 3;
};

export const WineInsights: React.FC<Props> = ({ notes }) => {
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
    structureData[2].A += scaleToNum(note.palate.alcohol === 'High' ? '5' : note.palate.alcohol === 'Medium' ? '3' : '1');
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in fade-in duration-500">
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
        <h3 className="font-serif text-lg font-semibold text-wine-900 mb-4">Average Palate Profile</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={structureData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#44403c', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
              <Radar
                name="Average"
                dataKey="A"
                stroke="#9e526c"
                strokeWidth={2}
                fill="#9e526c"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
        <h3 className="font-serif text-lg font-semibold text-wine-900 mb-4">Top Countries</h3>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={countryData} layout="vertical" margin={{ left: 20 }}>
               <XAxis type="number" hide />
               <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}} />
               <Tooltip cursor={{fill: '#f5f5f4'}} />
               <Bar dataKey="count" fill="#843b53" radius={[0, 4, 4, 0]} barSize={20} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
