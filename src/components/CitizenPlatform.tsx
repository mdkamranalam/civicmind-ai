import React, { useState, useEffect } from "react";
import { 
  Plus, 
  MapPin, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Award, 
  Trophy, 
  Users, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { Incident, IssueType, CitizenLeaderboardItem } from "../types";

interface CitizenPlatformProps {
  incidents: Incident[];
  leaderboard: CitizenLeaderboardItem[];
  onSubmitIncident: (data: {
    title: string;
    description: string;
    category: IssueType;
    latitude: number;
    longitude: number;
    reportedBy: string;
    image?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const PRESET_LOCATIONS = [
  { name: "Downtown Crossing", lat: 37.7785, lng: -122.4182 },
  { name: "Riverside Firehouse Intersection", lat: 37.7742, lng: -122.4235 },
  { name: "Industrial Warehouse Park", lat: 37.7801, lng: -122.4115 },
  { name: "Oak Heights Residential", lat: 37.7685, lng: -122.4168 }
];

export default function CitizenPlatform({ 
  incidents, 
  leaderboard, 
  onSubmitIncident, 
  isSubmitting 
}: CitizenPlatformProps) {
  // Active Citizen state
  const [currentUser, setCurrentUser] = useState<string>("Sienna Vance");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDesc, setFormDesc] = useState<string>("");
  const [formCategory, setFormCategory] = useState<IssueType>(IssueType.POTHOLE);
  
  // Locations coordinates
  const [formLat, setFormLat] = useState<number>(37.7785);
  const [formLng, setFormLng] = useState<number>(-122.4182);
  const [locationName, setLocationName] = useState<string>("Downtown Crossing");

  // Media inputs
  const [image64, setImage64] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceLoggedText, setVoiceLoggedText] = useState<string>("");
  const [duplicateWarning, setDuplicateWarning] = useState<Incident | null>(null);

  // Success indicator
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Trigger active duplicate detection checks
  useEffect(() => {
    // Check if any existing incident of identical category is within 150m of input coordinates
    const dup = incidents.find(inc => {
      if (inc.status === "duplicate_merged") return false;
      if (inc.category !== formCategory) return false;
      
      // Compute simple distance
      const latDiff = Math.abs(inc.latitude - formLat);
      const lngDiff = Math.abs(inc.longitude - formLng);
      // Roughly 111km per lat, 85km per lng at SF lat.
      const distMeters = Math.sqrt(Math.pow(latDiff * 111000, 2) + Math.pow(lngDiff * 85000, 2));
      return distMeters < 150;
    });

    setDuplicateWarning(dup || null);
  }, [formLat, formLng, formCategory, incidents]);

  // Handle Preset select
  const handlePresetSelect = (preset: typeof PRESET_LOCATIONS[0]) => {
    setFormLat(preset.lat);
    setFormLng(preset.lng);
    setLocationName(preset.name);
  };

  // Convert File to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock Voice Recording transcript engine
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time vocal streaming transcription after 3 seconds
      setTimeout(() => {
        setVoiceLoggedText("Active water leak from hydrants flooding entire crosswalk.");
        setFormDesc("Microphone transcribed input: Active water leak from hydrants flooding entire crosswalk.");
        setFormCategory(IssueType.WATER_LEAKAGE);
        setFormTitle("Severe Hydrant Pipe Rupture");
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  // Submit report handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    await onSubmitIncident({
      title: formTitle,
      description: formDesc || "Reported via citizen portal.",
      category: formCategory,
      latitude: formLat,
      longitude: formLng,
      reportedBy: currentUser,
      image: image64 || undefined
    });

    setReportSuccess(true);
    setFormTitle("");
    setFormDesc("");
    setImage64("");
    setVoiceLoggedText("");
    
    // Clear success banner after 4 seconds
    setTimeout(() => {
      setReportSuccess(false);
    }, 4000);
  };

  // Active user profile metrics
  const activeUserProfile = leaderboard.find(u => u.username === currentUser) || {
    level: 1,
    heroPoints: 0,
    reportsSubmitted: 0,
    reportsVerified: 0,
    reputationScore: 80,
    badges: ["Community Hero"]
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Road Guardian": return "🛣️";
      case "Water Protector": return "💧";
      case "City Defender": return "🛡️";
      case "Civic Champion": return "🏆";
      default: return "🦸";
    }
  };

  return (
    <div id="citizen-portal" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Left Grid: User Profile & Leaderboard (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Citizen Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-3.5 border-b border-white/10 pb-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4] font-bold text-lg shadow-inner">
              {currentUser.split(" ").map(w=>w[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-md">{currentUser}</h4>
                <span className="bg-[#34A853]/10 text-[#34A853] border border-[#34A853]/25 px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wide">
                  Active Hero
                </span>
              </div>
              <p className="text-xs text-white/50">Citizen Level {activeUserProfile.level}</p>
            </div>
          </div>

          {/* Gamification progress indicators */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-4">
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-white/40 block font-mono">HERO POINTS</span>
              <span className="text-white font-bold font-sans text-md">{activeUserProfile.heroPoints} HP</span>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-white/40 block font-mono">REPUTATION</span>
              <span className="text-[#34A853] font-bold font-sans text-md">{activeUserProfile.reputationScore}%</span>
            </div>
          </div>

          {/* Badges Cabinet */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-white/40 uppercase font-bold block">Unlocked Civic Badges</span>
            <div className="flex flex-wrap gap-2">
              {activeUserProfile.badges.map((badge) => (
                <div 
                  key={badge} 
                  className="bg-[#34A853]/10 text-emerald-300 border border-[#34A853]/20 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"
                  title={`${badge} badge unlocked`}
                >
                  <span>{getBadgeIcon(badge)}</span>
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Leaderboard of Champions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[#FBBC04]" />
            <h3 className="text-md font-bold text-white">Verdant Hills Leaderboard</h3>
          </div>
          <div className="space-y-3.5">
            {leaderboard.map((user, idx) => (
              <div 
                key={user.id} 
                onClick={() => setCurrentUser(user.username)}
                className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all ${
                  currentUser === user.username ? "bg-[#4285F4]/10 border border-[#4285F4]/20" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-white/40 font-bold w-4">#{idx+1}</span>
                  <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-[11px] font-bold text-white/80">
                    {user.username.split(" ").map(w=>w[0]).join("")}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white/90">{user.username}</h5>
                    <p className="text-[10px] text-white/40">Lv {user.level} • {user.reportsSubmitted} submitted</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#34A853]">{user.heroPoints} HP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Right Grid: AI Vision Incident Reporting Form (8 cols) */}
      <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Sparkles background styling */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Sparkles className="w-24 h-24 text-[#34A853]" />
        </div>

        <div className="border-b border-white/10 pb-4 mb-5">
          <h3 className="text-lg font-bold text-white">AI Vision Issue Reporting</h3>
          <p className="text-xs text-white/50 font-sans mt-1">
            Submit photo/text or voice description. CivicMind AI automatically classifies, extracts severity, analyzes coordinates, and allocates repair structures.
          </p>
        </div>

        {reportSuccess && (
          <div className="bg-[#34A853]/10 border border-[#34A853]/30 rounded-xl p-4 mb-5 text-emerald-300 text-xs flex items-center gap-2.5 animate-pulse">
            <CheckCircle className="w-5 h-5 text-[#34A853] flex-shrink-0" />
            <div>
              <p className="font-bold text-white">Incident successfully registered!</p>
              <p className="text-white/60">The Multi-Agent AI team has completed analysis, geolocated the ward, and drafted the repair resolution plan. +50 HP added to profile!</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/40 uppercase font-semibold">Incident Headline</label>
              <input
                type="text"
                placeholder="e.g. Major pothole on middle lane"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4285F4]/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/40 uppercase font-semibold">Issue Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as IssueType)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4285F4]/50"
              >
                <option value={IssueType.POTHOLE}>Pothole</option>
                <option value={IssueType.WATER_LEAKAGE}>Water Leakage</option>
                <option value={IssueType.DAMAGED_ROAD}>Damaged Road Structure</option>
                <option value={IssueType.GARBAGE}>Uncontrolled Waste/Garbage</option>
                <option value={IssueType.FLOODING}>Flooding Probability</option>
                <option value={IssueType.STREETLIGHT_FAILURE}>Streetlight Bulbs Failure</option>
                <option value={IssueType.DRAINAGE_PROBLEM}>Drainage & Sewerage Damage</option>
                <option value={IssueType.PUBLIC_INFRA_DAMAGE}>Public Infrastructure Damage</option>
              </select>
            </div>
          </div>

          {/* Description & Voice Dictation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-white/40 uppercase font-semibold">Incident Details</label>
              
              {/* Voice transcribe button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`text-[11px] font-mono px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRecording 
                    ? "bg-red-950/60 border-[#EA4335]/30 text-[#EA4335] animate-pulse" 
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {isRecording ? <MicOff className="w-3 h-3 text-[#EA4335]" /> : <Mic className="w-3 h-3 text-[#34A853]" />}
                {isRecording ? "Transcribing Voice..." : "Dictate Report"}
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Provide context, estimated width, or local impact descriptions..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4285F4]/50"
            />
            {voiceLoggedText && (
              <p className="text-[10px] text-[#4285F4] font-mono italic">
                🎤 Auto-Transcribed: &quot;{voiceLoggedText}&quot;
              </p>
            )}
          </div>

          {/* Photo upload block */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/40 uppercase font-semibold">Photo Evidence Payload</label>
            <div className="border border-dashed border-white/10 hover:border-[#4285F4]/40 rounded-xl bg-black/20 p-4 text-center transition-all">
              <input
                type="file"
                id="photo-evidence"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <label htmlFor="photo-evidence" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                {image64 ? (
                  <div className="space-y-2">
                    <img src={image64} className="w-24 h-24 mx-auto object-cover rounded-lg border border-white/10" alt="uploaded thumbnail" />
                    <span className="text-xs font-mono text-[#34A853]">File attached. Click to replace.</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-white/30" />
                    <p className="text-xs text-white/60 font-medium">Drag & Drop or Click to upload photo (JPG, PNG)</p>
                    <p className="text-[10px] text-white/30 font-mono uppercase">Supported sizes up to 50MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Coordinate geolocator & preset selects */}
          <div className="space-y-3.5 bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#4285F4]" />
                <span className="text-xs font-mono text-white/40 uppercase font-semibold">Geospatial Plotting</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">Active Grid Location: {locationName}</span>
            </div>

            {/* Quick preset locations */}
            <div className="flex flex-wrap gap-2">
              {PRESET_LOCATIONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded transition-all border cursor-pointer ${
                    locationName === preset.name
                      ? "bg-[#4285F4]/10 border-[#4285F4]/30 text-[#4285F4] font-bold"
                      : "bg-black/40 border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-white/40">
              <div>
                <span>Latitude: </span>
                <span className="text-white/80">{formLat.toFixed(5)}</span>
              </div>
              <div>
                <span>Longitude: </span>
                <span className="text-white/80">{formLng.toFixed(5)}</span>
              </div>
            </div>
          </div>

          {/* Dynamic DUPLICATE DETECTION WARNING alert */}
          {duplicateWarning && (
            <div className="bg-[#FBBC04]/10 border border-[#FBBC04]/30 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#FBBC04] mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-[#FBBC04] uppercase tracking-wide font-mono">Potential Duplicate Alert</p>
                <p className="text-white/80 mt-1">
                  Our Geo-Verification Agent detected an active ticket of category <span className="font-bold text-white font-mono">{formCategory}</span> within 150m:
                </p>
                <p className="text-white/50 mt-1 italic">&quot;{duplicateWarning.title}&quot; (ID: {duplicateWarning.id})</p>
                <p className="text-[11px] text-white/30 mt-2 font-mono">
                  Submitting will automatically bundle this report. Your entry will still upvote and validate the existing master incident.
                </p>
              </div>
            </div>
          )}

          {/* Submission button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white font-mono text-sm py-3 rounded-xl transition-all font-bold uppercase shadow-lg shadow-[#4285F4]/10 hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? "Processing AI Agents..." : "Submit Civic Report Payload"}
            <Plus className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
