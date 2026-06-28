import React, { useState, useEffect } from "react";
import { 
  Plus, 
  MapPin, 
  LayoutDashboard, 
  Cpu, 
  TrendingUp, 
  BarChart3, 
  User, 
  RefreshCw, 
  Activity, 
  HelpCircle,
  FileText,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Zap,
  CheckCircle,
  Wrench
} from "lucide-react";
import CitizenPlatform from "./components/CitizenPlatform";
import GovernmentDashboard from "./components/GovernmentDashboard";
import DigitalTwinMap from "./components/DigitalTwinMap";
import MultiAgentVisualizer from "./components/MultiAgentVisualizer";
import PredictionEngine from "./components/PredictionEngine";
import AnalyticsPanel from "./components/AnalyticsPanel";

import { 
  Incident, 
  AgentLog, 
  PredictionInsight, 
  CitizenLeaderboardItem, 
  WardMetric, 
  DepartmentStats, 
  IssueStatus,
  IssueType
} from "./types";

type ViewTab = "citizen" | "government" | "twin" | "agents" | "predictions" | "analytics";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ViewTab>("citizen");

  // Server state arrays
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [predictions, setPredictions] = useState<PredictionInsight[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<CitizenLeaderboardItem[]>([]);
  const [wardMetrics, setWardMetrics] = useState<WardMetric[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [cityOverview, setCityOverview] = useState({
    totalActiveIncidents: 0,
    totalResolvedIncidents: 0,
    cityHealthIndex: 85,
    averageResolutionDays: 1.8,
    citizenParticipationRate: 84
  });

  // Loading indicator states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Digital Twin interactive cross-link selection
  const [selectedIncidentFromTwin, setSelectedIncidentFromTwin] = useState<Incident | null>(null);

  // Fetch telemetry from server APIs
  const fetchAllTelemetry = async () => {
    try {
      const [resIncidents, resPredictions, resLogs, resLeaderboard, resTwin] = await Promise.all([
        fetch("/api/incidents"),
        fetch("/api/predictions"),
        fetch("/api/agents/logs"),
        fetch("/api/gamification"),
        fetch("/api/digital-twin")
      ]);

      const dataIncidents = await resIncidents.json();
      const dataPredictions = await resPredictions.json();
      const dataLogs = await resLogs.json();
      const dataLeaderboard = await resLeaderboard.json();
      const dataTwin = await resTwin.json();

      setIncidents(dataIncidents);
      setPredictions(dataPredictions);
      setAgentLogs(dataLogs);
      setLeaderboard(dataLeaderboard);
      setWardMetrics(dataTwin.wardMetrics || []);
      setDepartmentStats(dataTwin.departmentStats || []);
      if (dataTwin.cityOverview) {
        setCityOverview(dataTwin.cityOverview);
      }
    } catch (err) {
      console.error("Failed to sync server telemetry:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Sync on startup and intervals
  useEffect(() => {
    fetchAllTelemetry();
    const interval = setInterval(() => {
      fetchAllTelemetry();
    }, 15000); // sync every 15s
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchAllTelemetry();
  };

  // Submission handler
  const handleSubmitIncident = async (data: {
    title: string;
    description: string;
    category: IssueType;
    latitude: number;
    longitude: number;
    reportedBy: string;
    image?: string;
  }) => {
    setIsSubmittingReport(true);
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchAllTelemetry();
      }
    } catch (err) {
      console.error("Error submitting incident:", err);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Status update
  const handleUpdateStatus = async (id: string, status: IssueStatus) => {
    try {
      const res = await fetch(`/api/incidents/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchAllTelemetry();
      }
    } catch (err) {
      console.error("Error updating incident status:", err);
    }
  };

  // Log Administrative Comment
  const handleAddOfficialComment = async (id: string, text: string) => {
    try {
      const res = await fetch(`/api/incidents/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: "City Administrator Desk",
          text,
          isOfficial: true
        })
      });
      if (res.ok) {
        await fetchAllTelemetry();
      }
    } catch (err) {
      console.error("Error adding administrative comment:", err);
    }
  };

  // Trigger Pre-emptive maintainer schedule
  const handleTriggerMaintenance = async (id: string) => {
    // Add custom Agent log on the server for tracking resolution dispatch
    setTimeout(() => {
      fetchAllTelemetry();
    }, 3000);
  };

  // Cross link map click to details
  const handleSelectIncidentFromTwin = (incident: Incident) => {
    setSelectedIncidentFromTwin(incident);
    setActiveTab("government");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#4285F4]/30 selection:text-white">
      
      {/* Glare effect background decorative */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4285F4]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#34A853]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 relative z-10">
        
        {/* Unified Futuristic Dashboard Header - Immersive UI Style */}
        <header className="h-20 flex flex-col sm:flex-row items-center justify-between px-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#4285F4] to-[#34A853] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(66,133,244,0.3)]">
              <span className="font-bold text-white text-xl tracking-tighter">C</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                  CIVICMIND <span className="text-[#4285F4]">AI</span>
                </h1>
                <span className="px-1.5 py-0.2 rounded bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20 text-[8px] font-mono uppercase tracking-widest font-bold">
                  v1.2
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">Autonomous Governance Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Quick Refresh Telemetry Panel embedded cleanly */}
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <div className="text-right">
                <span className="text-[9px] text-white/40 font-mono block">LIVE TELEMETRY</span>
                <span className="text-xs font-bold text-white/90 font-sans">
                  {incidents.length} Tickets Active
                </span>
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Refresh Global Sync"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#34A853]" : ""}`} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6 pr-2">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Active Agents</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-[#34A853] rounded-full animate-pulse shadow-[0_0_5px_#34A853]"></div>
                  <div className="w-1.5 h-1.5 bg-[#34A853] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#34A853] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#34A853] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#FBBC04] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white">Ward 43 - West Enclave</p>
                <p className="text-[10px] text-white/50">District: Central Metro</p>
              </div>
              <div className="w-9 h-9 rounded-full border border-white/20 bg-[#1a1a1a] flex items-center justify-center shadow-inner">
                <span className="text-[10px] text-white/70 font-mono font-bold">ADMIN</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Tab Navigation */}
        <nav className="flex flex-wrap items-center gap-2 bg-black/40 p-1.5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-x-auto">
          {[
            { id: "citizen", label: "Citizen Reporting", icon: User },
            { id: "government", label: "Government Dispatch", icon: LayoutDashboard },
            { id: "twin", label: "Civic Digital Twin", icon: MapPin },
            { id: "agents", label: "Multi-Agent network", icon: Cpu },
            { id: "predictions", label: "Predictive Intelligence", icon: TrendingUp },
            { id: "analytics", label: "City statistics", icon: BarChart3 }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ViewTab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                  isSelected 
                    ? "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30 shadow-[0_0_15px_rgba(66,133,244,0.15)]" 
                    : "text-white/60 hover:text-white border-transparent hover:bg-white/5"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Loading Block */}
        {isLoading ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center flex flex-col items-center justify-center space-y-4 shadow-xl backdrop-blur-md">
            <Cpu className="w-12 h-12 text-[#4285F4] animate-spin" />
            <div className="space-y-1.5">
              <h3 className="text-md font-mono font-semibold text-white uppercase tracking-wide">
                Configuring Autonomous Sandbox...
              </h3>
              <p className="text-xs text-white/50 font-sans">
                Seeding city coordinates, compiling sensor channels, and registering multi-agent neurons.
              </p>
            </div>
          </div>
        ) : (
          
          /* Active View Render Panel */
          <div className="transition-all duration-300">
            {activeTab === "citizen" && (
              <CitizenPlatform 
                incidents={incidents}
                leaderboard={leaderboard}
                onSubmitIncident={handleSubmitIncident}
                isSubmitting={isSubmittingReport}
              />
            )}

            {activeTab === "government" && (
              <GovernmentDashboard 
                incidents={incidents}
                wardMetrics={wardMetrics}
                departmentStats={departmentStats}
                onUpdateStatus={handleUpdateStatus}
                onAddOfficialComment={handleAddOfficialComment}
                selectedIncidentFromTwin={selectedIncidentFromTwin}
              />
            )}

            {activeTab === "twin" && (
              <DigitalTwinMap 
                incidents={incidents}
                predictions={predictions}
                onSelectIncident={handleSelectIncidentFromTwin}
                selectedIncidentId={selectedIncidentFromTwin?.id}
              />
            )}

            {activeTab === "agents" && (
              <MultiAgentVisualizer 
                logs={agentLogs}
              />
            )}

            {activeTab === "predictions" && (
              <PredictionEngine 
                predictions={predictions}
                onTriggerMaintenance={handleTriggerMaintenance}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsPanel 
                wardMetrics={wardMetrics}
                departmentStats={departmentStats}
                incidents={incidents}
                cityOverview={cityOverview}
              />
            )}
          </div>
        )}

        {/* Bottom Analytics Bar */}
        <footer className="mt-8 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between p-5 bg-black/60 shadow-xl gap-4">
          <div className="flex flex-wrap gap-6 items-center text-[10px] font-mono uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-white/40">SYSTEM_LATENCY:</span>
              <span className="text-[#34A853] font-bold">12ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/40">AI_CONFIDENCE:</span>
              <span className="text-[#34A853] font-bold">98.4%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/40">COMMUNITY_VERIFICATION_LOAD:</span>
              <span className="text-[#FBBC04] font-bold">MODERATE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/40">DISTRICT:</span>
              <span className="text-white/80 font-bold">WEST ENCLAVE</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">Real-time Sync Active</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34A853]"></span>
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
