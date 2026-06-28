import React, { useState } from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  Brain, 
  MapPin, 
  AlertTriangle,
  Zap
} from "lucide-react";
import { PredictionInsight, IssueType } from "../types";

interface PredictionEngineProps {
  predictions: PredictionInsight[];
  onTriggerMaintenance?: (predictionId: string) => void;
}

export default function PredictionEngine({ predictions: initialPredictions, onTriggerMaintenance }: PredictionEngineProps) {
  const [predictions, setPredictions] = useState<PredictionInsight[]>(initialPredictions);
  const [scheduledIds, setScheduledIds] = useState<string[]>([]);

  // Local effect to sync predictions if props update
  React.useEffect(() => {
    setPredictions(initialPredictions);
  }, [initialPredictions]);

  const handleScheduleMaintenance = (id: string) => {
    setScheduledIds(prev => [...prev, id]);
    if (onTriggerMaintenance) {
      onTriggerMaintenance(id);
    }
    // Remove prediction or update status locally after 3s
    setTimeout(() => {
      setPredictions(prev => prev.filter(p => p.id !== id));
    }, 3000);
  };

  const getCategoryIcon = (category: IssueType) => {
    switch (category) {
      case IssueType.WATER_LEAKAGE: return "💧";
      case IssueType.GARBAGE: return "🗑️";
      default: return "🛣️";
    }
  };

  return (
    <div id="prediction-engine" className="space-y-6">
      
      {/* Header telemetry stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Model Confidence</span>
            <span className="text-2xl font-bold text-white font-sans">94.6%</span>
            <p className="text-[11px] text-[#34A853] font-mono mt-1">★ Exceeds municipal threshold</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#34A853]/10 text-[#34A853] border border-[#34A853]/20">
            <Brain className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Active Predictive Feeds</span>
            <span className="text-2xl font-bold text-white font-sans">{predictions.length} Sectors</span>
            <p className="text-[11px] text-[#a855f7] font-mono mt-1">▲ Multi-sensor acoustic mapping</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Pre-emptive Budget Saved</span>
            <span className="text-2xl font-bold text-white font-sans">$34,850</span>
            <p className="text-[11px] text-white/40 font-mono mt-1">Estimated 4.2x capital safety factor</p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 text-white/50 border border-white/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main predictions dashboard body */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-5">
          <h3 className="text-lg font-bold text-white">AI-Predicted Public Infrastructure Risks</h3>
          <p className="text-xs text-white/50 font-sans mt-0.5 leading-relaxed">
            Our telemetry model correlates historical street cracks, vibration logs, thermal fluctuations, and garbage volume spikes to predict failures up to 30 days before they occur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {predictions.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-white/30 text-center">
              <CheckCircle className="w-12 h-12 text-[#34A853] mb-2 animate-pulse" />
              <p className="text-sm font-bold">All sectors fully reinforced!</p>
              <p className="text-xs text-white/20 mt-1">No pending predictive risks detected across town grids.</p>
            </div>
          ) : (
            predictions.map((pred) => {
              const isScheduled = scheduledIds.includes(pred.id);

              return (
                <div 
                  key={pred.id} 
                  className={`border rounded-xl p-4.5 space-y-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                    isScheduled 
                      ? "bg-black/60 border-[#34A853]/40 scale-[0.98]" 
                      : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                  }`}
                >
                  {/* Headline */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{getCategoryIcon(pred.category)}</span>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wide">
                          {pred.category.replace("_", " ")} RISK
                        </span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${
                        pred.riskScore > 80 ? "text-[#EA4335] bg-[#EA4335]/5 px-2 py-0.5 rounded border border-[#EA4335]/15" : "text-[#FBBC04] bg-[#FBBC04]/5 px-2 py-0.5 rounded border border-[#FBBC04]/15"
                      }`}>
                        RISK: {pred.riskScore}/100
                      </span>
                    </div>

                    <div className="bg-black/40 rounded px-2.5 py-1.5 text-xs text-white/80 font-mono flex items-center justify-between mt-2.5">
                      <span className="text-white/40">PROBABILITY</span>
                      <span className="text-purple-400 font-bold text-sm">{(pred.probability * 100).toFixed(0)}% chance</span>
                    </div>
                  </div>

                  {/* Geolocation metadata */}
                  <div className="text-xs text-white/55 flex items-center gap-1.5 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-[#34A853]" />
                    <span>{pred.ward}</span>
                  </div>

                  {/* Reasoning & Recommended Pre-emptive Maintenance */}
                  <div className="space-y-2.5 bg-black/30 p-3 rounded-lg border border-white/10 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-white/30 uppercase block">Model Heuristics</span>
                      <p className="text-white/70 leading-relaxed mt-0.5 font-sans italic">&quot;{pred.reason}&quot;</p>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <span className="text-[9px] font-mono text-[#34A853] uppercase block font-bold">Pre-emptive recommendation</span>
                      <p className="text-white/80 mt-0.5 leading-normal">{pred.recommendedAction}</p>
                    </div>
                  </div>

                  {/* Interactive Pre-emptive schedule button */}
                  <div>
                    {isScheduled ? (
                      <div className="bg-[#34A853]/15 border border-[#34A853]/30 text-[#34A853] py-2.5 rounded-lg text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#34A853] animate-bounce" />
                        <span>PRE-EMPTIVE WORK DISPATCHED</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleScheduleMaintenance(pred.id)}
                        className="w-full bg-[#a855f7] hover:opacity-90 border border-[#a855f7]/30 text-white font-mono text-xs py-2.5 rounded-lg transition-all font-semibold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#FBBC04] animate-pulse" />
                        <span>Schedule pre-emptive patching</span>
                      </button>
                    )}
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
