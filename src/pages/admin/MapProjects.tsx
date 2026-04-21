import React, { useState } from 'react';
import { MAP_PROJECTS, MapProject } from '../../lib/mapProjects';

export const AdminMapProjects = () => {
  const [projects, setProjects] = useState<MapProject[]>(MAP_PROJECTS);

  const updateScore = (id: string, type: 'constraintScores' | 'capitalScores', key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, [type]: { ...p[type], [key]: numValue } }
          : p
      )
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-[#171614]">Map Project Inputs</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-2">Project</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Constraint Scores (P, C, W, L, S, Pr)</th>
              <th className="text-left p-2">Capital Scores (P, C, W, L, S, Pr)</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">
                  <div className="flex gap-1">
                    {Object.entries(p.constraintScores).map(([key, val]) => (
                      <input
                        key={key}
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={val}
                        onChange={(e) => updateScore(p.id, 'constraintScores', key, e.target.value)}
                        className="w-12 p-1 border border-slate-300 rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex gap-1">
                    {Object.entries(p.capitalScores).map(([key, val]) => (
                      <input
                        key={key}
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={val}
                        onChange={(e) => updateScore(p.id, 'capitalScores', key, e.target.value)}
                        className="w-12 p-1 border border-slate-300 rounded"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
