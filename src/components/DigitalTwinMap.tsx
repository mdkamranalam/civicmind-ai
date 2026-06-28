import React, { useState } from "react";
import { MapPin, ShieldAlert, AlertTriangle, Radio, Zap, HelpCircle, Eye, RefreshCw } from "lucide-react";
import { Incident, PredictionInsight } from "../types";

interface DigitalTwinMapProps {
  incidents: Incident[];
  predictions: PredictionInsight[];
  onSelectIncident?: (incident: Incident) => void;
  selectedIncidentId?: string | null;
}

type MapLayer = "incidents" | "severityHeatmap" | "riskHeatmap" | "predictions";

export default function DigitalTwinMap({ 
  incidents, 
  predictions, 
  onSelectIncident, 
  selectedIncidentId 
}: DigitalTwinMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>("incidents");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [radarActive, setRadarActive] = useState<boolean>(true);

  // Map coordinates bounding box for San Francisco region mapping inside standard SVG 800x500 box
  // Lat: 37.765 to 37.785
  // Lng: -122.425 to -122.410
  const mapWidth = 800;
  const mapHeight = 500;

  const latMin = 37.765;
  const latMax = 37.785;
  const lngMin = -122.425;
  const lngMax = -122.410;

  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * mapWidth;
    // SVG y-axis is inverted
    const y = mapHeight - ((lat - latMin) / (latMax - latMin)) * mapHeight;
    return { x, y };
  };

  // Preset streets for high-fidelity digital twin appearance
  const mockStreets = [
    // Main Diagonal Blvd
    { d: "M 50,450 L 750,50" },
    // Horizontal streets
    { d: "M 0,100 L 800,100" },
    { d: "M 0,250 L 800,250" },
    { d: "M 0,380 L 800,380" },
    // Vertical streets
    { d: "M 150,0 L 150,500" },
    { d: "M 350,0 L 350,500" },
    // Diagonal bypass
    { d: "M 600,0 L 600,500" },
    { d: "M 100,50 L 700,450" }
  ];

  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#EA4335"; // Google red
      case "high": return "#FBBC04"; // Google yellow/orange
      case "medium": return "#4285F4"; // Google blue
      default: return "#34A853"; // Google green
    }
  };

  return (
    <div id="digital-twin-map" className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" />
            <h3 className="font-mono text-xs font-semibold tracking-wider text-[#34A853] uppercase">
              Civic Digital Twin telemetry
            </h3>
          </div>
          <p className="text-sm font-sans font-medium text-white/90">Verdant Hills Virtual Coordinate Grid</p>
        </div>

        {/* Map Layer Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 border border-white/10 rounded-lg">
          {(["incidents", "severityHeatmap", "riskHeatmap", "predictions"] as MapLayer[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md cursor-pointer transition-all uppercase ${
                activeLayer === layer
                  ? "bg-white/10 text-[#4285F4] border border-[#4285F4]/30 shadow-md font-bold"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {layer === "incidents" && "Live Incidents"}
              {layer === "severityHeatmap" && "Severity Heat"}
              {layer === "riskHeatmap" && "Structural Risk"}
              {layer === "predictions" && "Predictive Grids"}
            </button>
          ))}
        </div>
      </div>

      {/* Map Control bar */}
      <div className="absolute top-20 right-8 z-10 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
          className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-white/5 flex items-center justify-center text-lg font-bold cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
          className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-white/5 flex items-center justify-center text-lg font-bold cursor-pointer"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={() => setRadarActive(!radarActive)}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
            radarActive ? "bg-[#34A853]/10 border-[#34A853]/30 text-[#34A853]" : "bg-black/60 border-white/10 text-white/40"
          }`}
          title="Toggle Radar Scan"
        >
          <Radio className="w-4 h-4" />
        </button>
      </div>

      {/* Actual SVG Canvas Container */}
      <div className="relative overflow-auto border border-white/5 bg-[#050505] rounded-xl" style={{ maxHeight: "550px" }}>
        <div 
          className="transition-transform duration-300 origin-center" 
          style={{ transform: `scale(${zoomLevel})`, width: `${mapWidth}px`, height: `${mapHeight}px` }}
        >
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full select-none"
            style={{ background: "#050505" }}
          >
            {/* Grid Lines background */}
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />

            {/* Radar Sweep Effect */}
            {radarActive && (
              <g className="opacity-40">
                <circle cx={mapWidth / 2} cy={mapHeight / 2} r="240" fill="none" stroke="#4285F4" strokeWidth="0.5" strokeDasharray="3,3" />
                <circle cx={mapWidth / 2} cy={mapHeight / 2} r="140" fill="none" stroke="#4285F4" strokeWidth="0.5" />
                <line x1={mapWidth / 2} y1={mapHeight / 2} x2={mapWidth / 2 + 240} y2={mapHeight / 2 - 120} stroke="#4285F4" strokeWidth="1" className="origin-center animate-spin" style={{ animationDuration: "12s" }} />
              </g>
            )}

            {/* Simulated Streets/Roads Layout */}
            <g opacity="0.1">
              {mockStreets.map((street, idx) => (
                <path
                  key={idx}
                  d={street.d}
                  fill="none"
                  stroke="#4285F4"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
            </g>
            <g opacity="0.3">
              {mockStreets.map((street, idx) => (
                <path
                  key={idx}
                  d={street.d}
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* --- SEVERITY HEATMAP LAYER --- */}
            {activeLayer === "severityHeatmap" && (
              <g>
                {incidents.map((inc) => {
                  const { x, y } = convertCoords(inc.latitude, inc.longitude);
                  const radius = inc.severity === "critical" ? 80 : inc.severity === "high" ? 60 : 40;
                  const color = inc.severity === "critical" ? "rgba(234, 67, 53, 0.15)" : inc.severity === "high" ? "rgba(251, 188, 4, 0.12)" : "rgba(66, 133, 244, 0.1)";
                  return (
                    <g key={`sh-${inc.id}`}>
                      <circle cx={x} cy={y} r={radius} fill={color} className="animate-pulse" />
                      <circle cx={x} cy={y} r={radius / 2} fill={color} />
                    </g>
                  );
                })}
              </g>
            )}

            {/* --- RISK HEATMAP LAYER --- */}
            {activeLayer === "riskHeatmap" && (
              <g>
                {/* Structural Stress Zones */}
                <path d="M 250,200 Q 300,100 400,180 T 550,220" fill="rgba(234, 67, 53, 0.05)" stroke="rgba(234, 67, 53, 0.15)" strokeWidth="3" strokeDasharray="5,5" />
                <circle cx="350" cy="150" r="120" fill="rgba(251, 188, 4, 0.03)" stroke="rgba(251, 188, 4, 0.1)" strokeWidth="1" />
                <circle cx="620" cy="380" r="90" fill="rgba(234, 67, 53, 0.04)" stroke="rgba(234, 67, 53, 0.1)" strokeWidth="1" />
              </g>
            )}

            {/* --- PREDICTIONS LAYER --- */}
            {activeLayer === "predictions" && (
              <g>
                {predictions.map((pred) => {
                  const { x, y } = convertCoords(pred.latitude, pred.longitude);
                  return (
                    <g key={pred.id}>
                      {/* Pulse circle for predictions */}
                      <circle cx={x} cy={y} r="25" fill="none" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2,2" className="animate-pulse" />
                      <circle cx={x} cy={y} r="5" fill="#a855f7" className="animate-ping" />
                      <circle cx={x} cy={y} r="4" fill="#a855f7" />
                      {/* Hover text / info indicator */}
                      <foreignObject x={x + 10} y={y - 20} width="160" height="40" className="overflow-visible">
                        <div className="bg-black/90 border border-purple-500/30 rounded px-2 py-0.5 shadow-lg">
                          <p className="text-[9px] font-mono font-bold text-purple-400 uppercase">
                            AI PREDICTION: {pred.probability * 100}%
                          </p>
                          <p className="text-[10px] font-sans font-medium text-white/90 truncate">
                            {pred.category.replace("_", " ")}
                          </p>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </g>
            )}

            {/* --- LIVE INCIDENTS MARKERS --- */}
            {(activeLayer === "incidents" || activeLayer === "severityHeatmap") && (
              <g>
                {incidents.map((inc) => {
                  if (inc.status === "duplicate_merged") return null; // skip merged
                  const { x, y } = convertCoords(inc.latitude, inc.longitude);
                  const color = getIncidentColor(inc.severity);
                  const isSelected = selectedIncidentId === inc.id;

                  return (
                    <g
                      key={inc.id}
                      className="cursor-pointer group"
                      onClick={() => onSelectIncident && onSelectIncident(inc)}
                    >
                      {/* Outer pulse */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 16 : 8}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        opacity={isSelected ? "1" : "0.5"}
                        className="animate-ping"
                        style={{ animationDuration: "2.5s" }}
                      />

                      {/* Solid marker container */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 7 : 5}
                        fill={color}
                        stroke="#050505"
                        strokeWidth="1.5"
                        className="transition-all group-hover:scale-125"
                      />

                      {/* Small crown icon indicator if highly upvoted */}
                      {inc.upvotes >= 30 && (
                        <circle
                          cx={x}
                          cy={y - 8}
                          r="2.5"
                          fill="#facc15"
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/5 border border-white/10 rounded-xl p-3 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#EA4335]" />
          <span className="text-xs font-mono text-white/40">Critical Failure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FBBC04]" />
          <span className="text-xs font-mono text-white/40">High Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4285F4]" />
          <span className="text-xs font-mono text-white/40">Medium Danger</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500" />
          <span className="text-xs font-mono text-white/40">AI Predictive Risk</span>
        </div>
      </div>
    </div>
  );
}
