import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  Users, 
  Percent, 
  HelpCircle, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { WardMetric, DepartmentStats, Incident } from "../types";

interface AnalyticsPanelProps {
  wardMetrics: WardMetric[];
  departmentStats: DepartmentStats[];
  incidents: Incident[];
  cityOverview: {
    totalActiveIncidents: number;
    totalResolvedIncidents: number;
    cityHealthIndex: number;
    averageResolutionDays: number;
    citizenParticipationRate: number;
  };
}

export default function AnalyticsPanel({ 
  wardMetrics, 
  departmentStats, 
  incidents,
  cityOverview 
}: AnalyticsPanelProps) {

  // Simple category counts for custom SVG bar charts
  const categoryCounts: Record<string, number> = {};
  incidents.forEach(inc => {
    categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
  });

  const categories = Object.keys(categoryCounts).map(cat => ({
    name: cat.replace("_", " "),
    count: categoryCounts[cat]
  }));

  const maxCount = Math.max(...categories.map(c => c.count), 1);

  return (
    <div id="analytics-panel" className="space-y-6">
      
      {/* City Overview Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">City Health Index</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-bold text-white">{cityOverview.cityHealthIndex}%</span>
            <span className="text-xs text-[#34A853] font-mono">▲ Stable</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1 mt-3.5">
            <div className="h-full bg-[#34A853] rounded-full" style={{ width: `${cityOverview.cityHealthIndex}%` }} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Average Resolution Time</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-bold text-white">{cityOverview.averageResolutionDays} Days</span>
            <span className="text-xs text-[#34A853] font-mono">▼ -12%</span>
          </div>
          <span className="text-[10px] text-white/30 font-mono mt-3.5 block">Exceeds service level target of 3.0 days</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Active Ticket Load</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-bold text-white">{cityOverview.totalActiveIncidents} Issues</span>
            <span className="text-xs text-[#FBBC04] font-mono">▲ Under load</span>
          </div>
          <span className="text-[10px] text-white/30 font-mono mt-3.5 block">{cityOverview.totalResolvedIncidents} cases resolved historically</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Citizen Crowd Verification</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-bold text-white">{cityOverview.citizenParticipationRate}%</span>
            <span className="text-xs text-[#34A853] font-mono">▲ High engagement</span>
          </div>
          <span className="text-[10px] text-white/30 font-mono mt-3.5 block">84% of issues upvoted/verified by crowd</span>
        </div>
      </div>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Visualizer 1: SVG Bar Chart - Issues by Category */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4285F4]" />
              <h3 className="text-md font-bold text-white">Incident Distribution By Category</h3>
            </div>
            <span className="text-[10px] text-white/30 font-mono uppercase">Telemetry Aggregates</span>
          </div>

          <div className="space-y-4 pt-1.5">
            {categories.length === 0 ? (
              <p className="text-xs text-white/30 italic py-10 text-center">No category metrics logged.</p>
            ) : (
              categories.map((cat) => {
                const percentage = (cat.count / maxCount) * 100;
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white/80 capitalize">{cat.name}</span>
                      <span className="font-mono text-white/40">{cat.count} ticket(s)</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2.5 border border-white/5">
                      <div 
                        className="h-full bg-[#4285F4] rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Visualizer 2: SVG Line Chart - Simulated Weekly Resolution SLA */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#34A853]" />
                <h3 className="text-md font-bold text-white">Average Weekly Resolution Velocity</h3>
              </div>
              <span className="text-[10px] text-white/30 font-mono uppercase">Past 6 Weeks</span>
            </div>

            <p className="text-xs text-white/50 mb-6 leading-relaxed font-sans">
              Dynamic tracking of weekly incident response performance. The solid line represents target SLA duration threshold vs actual performance in days.
            </p>

            {/* Custom SVG line plot */}
            <div className="w-full h-36 border-l border-b border-white/10 relative mt-4">
              {/* Grid Lines */}
              <div className="absolute left-0 right-0 top-0 border-t border-white/5 text-[9px] text-white/30 font-mono pl-1 pt-1">3.0 Days SLA</div>
              <div className="absolute left-0 right-0 top-1/2 border-t border-white/5 text-[9px] text-white/30 font-mono pl-1 pt-1">1.5 Days</div>

              <svg viewBox="0 0 400 100" className="w-full h-full">
                {/* Target SLA dashed line */}
                <line x1="0" y1="30" x2="400" y2="30" stroke="#EA4335" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                
                {/* Weekly actual line */}
                <path 
                  d="M 10,80 L 80,60 L 150,65 L 220,40 L 290,32 L 380,15" 
                  fill="none" 
                  stroke="#34A853" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                
                {/* Dots */}
                <circle cx="10" cy="80" r="4" fill="#34A853" />
                <circle cx="80" cy="60" r="4" fill="#34A853" />
                <circle cx="150" cy="65" r="4" fill="#34A853" />
                <circle cx="220" cy="40" r="4" fill="#34A853" />
                <circle cx="290" cy="32" r="4" fill="#34A853" />
                <circle cx="380" cy="15" r="4" fill="#34A853" />
              </svg>
            </div>
            
            <div className="flex justify-between text-[10px] font-mono text-white/40 mt-2.5 px-1">
              <span>Wk 21</span>
              <span>Wk 22</span>
              <span>Wk 23</span>
              <span>Wk 24</span>
              <span>Wk 25</span>
              <span>Wk 26 (Current)</span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center gap-2 mt-4 text-[11px]">
            <AlertCircle className="w-4 h-4 text-[#34A853]" />
            <span className="text-white/70">
              Response velocity improved by <span className="text-white font-bold">32%</span> over the past 6 weeks due to autonomous duplicate merging and smart routing systems.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
