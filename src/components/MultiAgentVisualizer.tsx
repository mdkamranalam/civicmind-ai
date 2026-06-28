import React, { useState } from "react";
import { 
  Eye, 
  Layers, 
  MapPin, 
  CheckCircle, 
  TrendingUp, 
  Wrench, 
  BarChart3, 
  Bell, 
  Brain, 
  Cpu, 
  Clock, 
  History 
} from "lucide-react";
import { AgentLog } from "../types";

interface MultiAgentVisualizerProps {
  logs: AgentLog[];
}

export default function MultiAgentVisualizer({ logs }: MultiAgentVisualizerProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // List of the 8 core agents in the autonomous network
  const agents = [
    {
      name: "Vision Agent",
      icon: Eye,
      color: "text-blue-400 border-blue-500/20 bg-blue-950/20",
      glowColor: "shadow-blue-500/10",
      role: "Multi-Modal Sensor Analyzer",
      desc: "Processes user images, video payloads, and voice audios. Uses Gemini Vision algorithms to parse structural defects and calculate physical dimensions."
    },
    {
      name: "Categorization Agent",
      icon: Layers,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
      glowColor: "shadow-cyan-500/10",
      role: "Semantic Ticket Classifier",
      desc: "Classifies reported incidents into municipal categories. Evaluates potential public safety hazard multipliers, and determines severity levels."
    },
    {
      name: "Geo Agent",
      icon: MapPin,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
      glowColor: "shadow-emerald-500/10",
      role: "Geospatial Boundary Assessor",
      desc: "Performs reverse geocoding, boundary intersecting, and registers incoming coordinates against ward grids and city parcel indexes."
    },
    {
      name: "Verification Agent",
      icon: CheckCircle,
      color: "text-yellow-400 border-yellow-500/20 bg-yellow-950/20",
      glowColor: "shadow-yellow-500/10",
      role: "Deduplication & Consensus Engine",
      desc: "Applies spatial Haversine algorithms to cluster neighboring reports of matching categories. Groups duplicate submissions into Master Incidents."
    },
    {
      name: "Prediction Agent",
      icon: TrendingUp,
      color: "text-purple-400 border-purple-500/20 bg-purple-950/20",
      glowColor: "shadow-purple-500/10",
      role: "Predictive Infrastructure Assessor",
      desc: "Synthesizes historical trends, current active queues, and weather data to predict failure propagation, structure fatigue, and escalation curves."
    },
    {
      name: "Resolution Agent",
      icon: Wrench,
      color: "text-rose-400 border-rose-500/20 bg-rose-950/20",
      glowColor: "shadow-rose-500/10",
      role: "Tactical Resource Allocator",
      desc: "Formulates optimal repair schedules, estimates materials and operations costs, allocates municipal department gears, and designs escalation branches."
    },
    {
      name: "Analytics Agent",
      icon: BarChart3,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-950/20",
      glowColor: "shadow-indigo-500/10",
      role: "City Health Metrologist",
      desc: "Dynamically audits ward-wide active densities, aggregates resolved throughput speed, and updates city-wide public safety risk indicators."
    },
    {
      name: "Notification Agent",
      icon: Bell,
      color: "text-orange-400 border-orange-500/20 bg-orange-950/20",
      glowColor: "shadow-orange-500/10",
      role: "Hyperlocal Citizen Communicator",
      desc: "Fosters transparency by dispatching push messages, updating citizen profiles with Hero Points, and signaling local utility alerts."
    }
  ];

  return (
    <div id="multi-agent-visualizer" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agents Nodes Map */}
      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#34A853]" />
            <h3 className="text-lg font-bold text-white">Multi-Agent AI Core</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#34A853]/10 text-[#34A853] border border-[#34A853]/20 uppercase tracking-widest font-semibold">
            Autonomous Governed Network
          </span>
        </div>

        <p className="text-sm text-white/60 mb-6 font-sans leading-relaxed">
          Our decentralized multi-agent collective runs concurrent, sequential steps on every community report. Click any agent below to inspect its cognitive memory, specialized neural directives, and active workloads.
        </p>

        {/* 8 Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const AgentIcon = agent.icon;
            const isSelected = selectedAgent === agent.name;
            const hasRecentLogs = logs.some(l => l.agentName === agent.name);

            return (
              <div
                key={agent.name}
                onClick={() => setSelectedAgent(agent.name)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 flex items-start gap-4 shadow-lg ${
                  isSelected 
                    ? "border-[#34A853]/50 bg-black/40 scale-[1.02] ring-1 ring-[#34A853]/20" 
                    : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                }`}
              >
                <div className={`p-2.5 rounded-lg border border-white/10 bg-black/40 shadow-inner`}>
                  <AgentIcon className="w-5 h-5 text-[#4285F4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-white text-sm truncate">{agent.name}</h4>
                    {hasRecentLogs ? (
                      <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" title="Active on queue" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/20" title="Standby Mode" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#4285F4] font-mono mt-0.5">{agent.role}</p>
                  <p className="text-xs text-white/55 line-clamp-2 mt-1.5 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Memory Details */}
        {selectedAgent && (
          <div className="mt-6 border border-white/10 bg-black/30 p-4 rounded-xl">
            {(() => {
              const current = agents.find(a => a.name === selectedAgent);
              if (!current) return null;
              const AgentIcon = current.icon;
              return (
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className={`p-3 rounded-lg border border-white/10 bg-black/40`}>
                    <AgentIcon className="w-6 h-6 text-[#4285F4]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md font-bold text-white">{current.name} Internal Sandbox</h4>
                    <p className="text-xs text-[#34A853] font-mono mt-0.5 uppercase tracking-wide">Directive: {current.role}</p>
                    <p className="text-sm text-white/70 mt-2 leading-relaxed">{current.desc}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-black/40 border border-white/5 rounded px-3 py-2 text-xs">
                        <span className="text-white/40 block font-mono">NEURAL MODEL</span>
                        <span className="text-white/80 font-medium font-sans">Gemini 3.5 Flash Core</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded px-3 py-2 text-xs">
                        <span className="text-white/40 block font-mono">CONCURRENT MEMORY</span>
                        <span className="text-white/80 font-medium font-sans">128-Step Ephemeral Window</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Agents Logs/Thoughts Stream */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col h-[560px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#34A853]" />
            <h3 className="text-md font-bold text-white font-sans">Agentic Reasoning Stream</h3>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34A853]"></span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/30 p-4 text-center">
              <Brain className="w-8 h-8 text-white/10 mb-2 animate-pulse" />
              <p className="text-sm">Listening on grid channels...</p>
              <p className="text-[11px] text-white/20 mt-1">Submit a citizen report to trigger active multi-agent pipeline logs.</p>
            </div>
          ) : (
            logs.map((log) => {
              const matchedAgent = agents.find(a => a.name === log.agentName);
              const LogIcon = matchedAgent ? matchedAgent.icon : Clock;

              return (
                <div key={log.id} className="border border-white/10 bg-black/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-black/60 border border-white/10">
                        <LogIcon className="w-3.5 h-3.5 text-[#34A853]" />
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{log.agentName}</span>
                    </div>
                    <span className="text-[9px] text-white/40 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                    <span className="text-purple-300 font-bold uppercase">Task:</span> {log.task}
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed italic bg-black/20 p-2 rounded border border-white/5">
                    &quot;{log.thought}&quot;
                  </p>

                  <div className="text-xs text-white/70 leading-relaxed font-sans font-medium pl-1">
                    💡 <span className="font-mono text-[10px] text-white/40 font-bold uppercase">Output:</span> {log.output}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
