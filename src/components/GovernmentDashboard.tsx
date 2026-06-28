import React, { useState } from "react";
import { 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  User, 
  Activity, 
  ShieldAlert, 
  FileText,
  Hammer
} from "lucide-react";
import { Incident, IssueStatus, Comment, ResolutionPlan, WardMetric, DepartmentStats } from "../types";

interface GovernmentDashboardProps {
  incidents: Incident[];
  wardMetrics: WardMetric[];
  departmentStats: DepartmentStats[];
  onUpdateStatus: (incidentId: string, status: IssueStatus) => void;
  onAddOfficialComment: (incidentId: string, text: string) => void;
  selectedIncidentFromTwin?: Incident | null;
}

export default function GovernmentDashboard({ 
  incidents, 
  wardMetrics, 
  departmentStats, 
  onUpdateStatus, 
  onAddOfficialComment,
  selectedIncidentFromTwin
}: GovernmentDashboardProps) {
  const [selectedIncId, setSelectedIncId] = useState<string | null>(
    selectedIncidentFromTwin ? selectedIncidentFromTwin.id : (incidents[0]?.id || null)
  );
  const [officialCommentText, setOfficialCommentText] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("active");

  React.useEffect(() => {
    if (selectedIncidentFromTwin) {
      setSelectedIncId(selectedIncidentFromTwin.id);
    }
  }, [selectedIncidentFromTwin]);

  const selectedIncident = incidents.find(i => i.id === selectedIncId);

  // Filter incidents list
  const filteredIncidents = incidents.filter(inc => {
    const matchesCat = filterCategory === "all" || inc.category === filterCategory;
    
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = inc.status !== IssueStatus.RESOLVED && inc.status !== IssueStatus.DUPLICATE_MERGED;
    } else if (filterStatus === "resolved") {
      matchesStatus = inc.status === IssueStatus.RESOLVED;
    } else if (filterStatus === "duplicate") {
      matchesStatus = inc.status === IssueStatus.DUPLICATE_MERGED;
    }
    
    return matchesCat && matchesStatus;
  });

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.REPORTED:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Reported</span>;
      case IssueStatus.VISION_VERIFIED:
        return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Vision OK</span>;
      case IssueStatus.GEOLOCATED:
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Geolocated</span>;
      case IssueStatus.CITIZEN_VOTED:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Citizen Voted</span>;
      case IssueStatus.DEPT_ASSIGNED:
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Assigned</span>;
      case IssueStatus.RESOLVING:
        return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Resolving</span>;
      case IssueStatus.RESOLVED:
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Resolved</span>;
      case IssueStatus.DUPLICATE_MERGED:
        return <span className="bg-slate-700/10 text-slate-400 border border-slate-700/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Duplicate</span>;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-xs font-mono font-bold uppercase animate-pulse">Critical</span>;
      case "high":
        return <span className="bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">High</span>;
      case "medium":
        return <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Medium</span>;
      default:
        return <span className="bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-mono uppercase">Low</span>;
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncId || !officialCommentText.trim()) return;
    onAddOfficialComment(selectedIncId, officialCommentText);
    setOfficialCommentText("");
  };

  return (
    <div id="gov-dashboard" className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      
      {/* 1. Left Sidebar: Wards & Department Telemetry */}
      <div className="xl:col-span-1 space-y-6">
        {/* Ward Health Index */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[#34A853]" />
            <h3 className="text-md font-bold text-white">Ward Risk Diagnostics</h3>
          </div>
          <div className="space-y-4">
            {wardMetrics.map((m) => (
              <div key={m.wardName} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-white/80">{m.wardName}</span>
                  <span className={`font-mono font-bold ${m.riskIndex > 70 ? "text-[#EA4335]" : m.riskIndex > 50 ? "text-[#FBBC04]" : "text-[#34A853]"}`}>
                    Risk Index: {m.riskIndex}%
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5 border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.riskIndex > 70 ? "bg-[#EA4335]" : m.riskIndex > 50 ? "bg-[#FBBC04]" : "bg-[#34A853]"
                    }`}
                    style={{ width: `${m.riskIndex}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
                  <span>Health: {m.healthScore}%</span>
                  <span>Active: {m.activeCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Budgets & Allocation */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-[#4285F4]" />
            <h3 className="text-md font-bold text-white">Department Dispatch</h3>
          </div>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <p className="text-xs font-semibold text-white/80 truncate" title={dept.name}>
                  {dept.name}
                </p>
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>Active: {dept.activeTickets}</span>
                  <span>Avg Speed: {dept.avgResolutionTimeDays}d</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1 border border-white/5">
                  <div 
                    className="h-full bg-[#4285F4]" 
                    style={{ width: `${dept.budgetUtilization}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-white/30">
                  <span>Budget: {dept.budgetUtilization}% utilized</span>
                  <span>Capacity: {dept.resourceUtilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle Panel: Interactive Incidents Grid with Filters */}
      <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col min-h-[600px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Active Civic Incident Queues</h3>
            <p className="text-xs text-white/50 font-sans mt-0.5">Crowdsourced validation and multi-agent merged entries</p>
          </div>

          {/* Filtering controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono focus:outline-none focus:border-[#4285F4]/40"
            >
              <option value="active">Active Tickets</option>
              <option value="resolved">Resolved</option>
              <option value="duplicate">Duplicates</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono focus:outline-none focus:border-[#4285F4]/40"
            >
              <option value="all">All Categories</option>
              <option value="pothole">Potholes</option>
              <option value="water_leakage">Water Leakage</option>
              <option value="garbage">Garbage</option>
              <option value="flooding">Flooding</option>
              <option value="streetlight_failure">Streetlights</option>
            </select>
          </div>
        </div>

        {/* Incident List Rows */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {filteredIncidents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/30 py-12 text-center">
              <FileText className="w-12 h-12 text-white/10 mb-2 animate-bounce" />
              <p className="text-sm font-medium">No incidents matched filters.</p>
              <p className="text-xs text-white/20 mt-1">Try switching status or category selections above.</p>
            </div>
          ) : (
            filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncId(inc.id)}
                className={`cursor-pointer border rounded-xl p-4 transition-all flex items-start gap-3.5 relative overflow-hidden ${
                  selectedIncId === inc.id
                    ? "bg-black/40 border-[#4285F4]/40 shadow-[#4285F4]/5 shadow-md"
                    : "bg-white/5 border-white/10 hover:border-white/25"
                }`}
              >
                {/* Left indicators */}
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className={`p-2 rounded-lg ${
                    inc.severity === "critical" ? "bg-[#EA4335]/10 text-[#EA4335]" :
                    inc.severity === "high" ? "bg-[#FBBC04]/10 text-[#FBBC04]" :
                    "bg-black/40 text-white/40"
                  } border border-white/10`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/40">{inc.id}</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 justify-between">
                    <h4 className="font-bold text-sm text-white truncate">{inc.title}</h4>
                    <span className="text-[10px] text-white/40 font-mono">
                      {new Date(inc.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{inc.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {getStatusBadge(inc.status)}
                    {getSeverityBadge(inc.severity)}
                    <span className="text-[10px] text-white/40 font-mono">
                      Ward: {inc.ward}
                    </span>
                    <span className="text-[10px] text-[#34A853] bg-[#34A853]/5 border border-[#34A853]/10 px-1.5 py-0.2 rounded font-mono">
                      ★ Conf: {(inc.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Right Panel: Selected Incident Deep Dive & Admin Actions */}
      <div className="xl:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col min-h-[600px]">
        {selectedIncident ? (
          <div className="flex-1 flex flex-col space-y-5">
            {/* Header details */}
            <div className="border-b border-white/10 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-white/40 font-bold uppercase">{selectedIncident.id} Telemetry</span>
                {getStatusBadge(selectedIncident.status)}
              </div>
              <h3 className="font-bold text-md text-white leading-snug">{selectedIncident.title}</h3>
              <div className="flex items-center gap-2 text-xs text-white/50 mt-2">
                <User className="w-3.5 h-3.5 text-white/40" />
                <span>Reporter: {selectedIncident.reportedBy}</span>
              </div>
            </div>

            {/* Media Image Payload */}
            {selectedIncident.imageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-white/10 h-32 bg-black/60 flex items-center justify-center">
                <img 
                  src={selectedIncident.imageUrl} 
                  alt={selectedIncident.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 border border-white/10 text-[9px] font-mono font-semibold px-2 py-0.5 rounded text-white/60">
                  CAMERA_01_FEED
                </span>
              </div>
            )}

            {/* AI Generated Resolution Plan */}
            {selectedIncident.resolutionPlan && (
              <div className="bg-[#34A853]/10 border border-[#34A853]/20 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-1.5">
                  <Hammer className="w-4 h-4 text-[#34A853]" />
                  <span className="text-xs font-mono font-bold text-[#34A853] uppercase tracking-wide">AI Auto-Resolution Blueprint</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3.5 text-xs border-b border-[#34A853]/10 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-white/30 uppercase block">Dept Allocated</span>
                    <span className="text-white/80 font-medium">{selectedIncident.resolutionPlan.assignedDepartment}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-white/30 uppercase block">Cost Projection</span>
                    <span className="text-[#34A853] font-mono font-bold">${selectedIncident.resolutionPlan.estimatedCost}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className="text-[9px] font-mono text-white/30 uppercase block">Duration Est</span>
                    <span className="text-white/80 font-medium font-mono">{selectedIncident.resolutionPlan.estimatedTimeDays} Day(s)</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-white/30 uppercase block">Crew Allocation</span>
                    <span className="text-white/70 text-[11px] font-sans truncate block">
                      {selectedIncident.resolutionPlan.allocatedResources.join(", ") || "DPW standard team"}
                    </span>
                  </div>
                </div>

                {selectedIncident.resolutionPlan.escalationPath && (
                  <div className="text-[10px] text-[#FBBC04]/90 font-mono border-t border-[#34A853]/10 pt-2 bg-[#FBBC04]/5 p-1 rounded">
                    ⚠️ ALERT: {selectedIncident.resolutionPlan.escalationPath}
                  </div>
                )}
              </div>
            )}

            {/* Dispatch Commands Panel */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Admins Dispatch Command</span>
              
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onUpdateStatus(selectedIncident.id, IssueStatus.DEPT_ASSIGNED)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border cursor-pointer transition-all ${
                    selectedIncident.status === IssueStatus.DEPT_ASSIGNED
                      ? "bg-white/10 text-[#4285F4] border-[#4285F4]/30 font-bold"
                      : "bg-black/40 text-white/40 border-white/10 hover:text-white"
                  }`}
                >
                  ASSIGN
                </button>
                <button
                  onClick={() => onUpdateStatus(selectedIncident.id, IssueStatus.RESOLVING)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border cursor-pointer transition-all ${
                    selectedIncident.status === IssueStatus.RESOLVING
                      ? "bg-white/10 text-[#FBBC04] border-[#FBBC04]/30 font-bold"
                      : "bg-black/40 text-white/40 border-white/10 hover:text-white"
                  }`}
                >
                  RESOLVING
                </button>
                <button
                  onClick={() => onUpdateStatus(selectedIncident.id, IssueStatus.RESOLVED)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border cursor-pointer transition-all ${
                    selectedIncident.status === IssueStatus.RESOLVED
                      ? "bg-[#34A853]/20 text-[#34A853] border-[#34A853]/30 font-bold"
                      : "bg-black/40 text-white/40 border-white/10 hover:text-white"
                  }`}
                >
                  SOLVED
                </button>
              </div>
            </div>

            {/* Official Activity Logs (Post comment) */}
            <div className="flex-1 overflow-y-auto space-y-2.5 border-t border-white/10 pt-4">
              <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Official Action Logs</span>
              
              <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                {selectedIncident.comments.length === 0 ? (
                  <p className="text-xs text-white/30 italic">No official updates logged yet.</p>
                ) : (
                  selectedIncident.comments.map((c) => (
                    <div key={c.id} className={`p-2 rounded-lg border text-xs ${
                      c.isOfficial ? "bg-[#4285F4]/10 border-[#4285F4]/20 text-white/95" : "bg-black/40 border-white/10 text-white/70"
                    }`}>
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-1">
                        <span className="font-bold">{c.author}</span>
                        <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-normal">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Form */}
              <form onSubmit={submitComment} className="mt-3.5 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Log administrative action..."
                  value={officialCommentText}
                  onChange={(e) => setOfficialCommentText(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none focus:border-[#4285F4]/50"
                />
                <button
                  type="submit"
                  className="bg-[#4285F4] hover:opacity-90 text-white font-mono text-xs px-3 py-1.5 rounded transition-all font-semibold cursor-pointer"
                >
                  ADD
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-white/30 text-center py-20">
            <ShieldAlert className="w-8 h-8 text-white/10 mb-2 animate-pulse" />
            <p className="text-sm">Select an incident to view deep data</p>
          </div>
        )}
      </div>

    </div>
  );
}
