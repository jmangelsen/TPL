import React, { useMemo } from 'react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { MAP_PROJECTS, MapProjectId } from '../lib/mapProjects';
import { CONSTRAINT_LABELS } from '../lib/constraintTaxonomy';

interface ConstraintRadarChartProps {
  projectId: MapProjectId;
}

const CustomAngleTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9}
        className="font-sans font-bold uppercase tracking-widest"
      >
        {CONSTRAINT_LABELS[payload.value] || payload.value}
      </text>
    </g>
  );
};

export const ConstraintRadarChart: React.FC<ConstraintRadarChartProps> = ({ projectId }) => {
  const activeProject = useMemo(() => 
    MAP_PROJECTS.find(p => p.id === projectId) || MAP_PROJECTS[0]
  , [projectId]);

  const radarData = useMemo(() => {
    const scores = activeProject.constraintScores;
    const capital = activeProject.capitalScores;
    return [
      { category: 'power', constraintScore: scores.power, spendScore: capital.power },
      { category: 'cooling', constraintScore: scores.cooling, spendScore: capital.cooling },
      { category: 'water', constraintScore: scores.water, spendScore: capital.water },
      { category: 'labor', constraintScore: scores.labor, spendScore: capital.labor },
      { category: 'supply', constraintScore: scores.supply, spendScore: capital.supply },
      { category: 'permitting', constraintScore: scores.permitting, spendScore: capital.permitting },
    ];
  }, [activeProject]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
        <PolarGrid stroke="#dcd9d5" strokeWidth={1} strokeOpacity={0.2} />
        <PolarAngleAxis 
          dataKey="category" 
          tick={<CustomAngleTick />}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 10]} 
          tick={false} 
          axisLine={false}
        />
        
        {/* Theoretical Constraint Boundary */}
        <Radar
          name="Theoretical Constraint Boundary"
          dataKey="constraintScore"
          stroke="#2b6cb0"
          strokeWidth={1.5}
          fill="#3182ce"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
        
        {/* Observed Capital Deployment */}
        <Radar
          name="Observed Capital Deployment"
          dataKey="spendScore"
          stroke="#c53030"
          strokeWidth={1.5}
          fill="#e53e3e"
          fillOpacity={0.6}
          isAnimationActive={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
