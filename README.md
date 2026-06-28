# CivicMind AI
### *Autonomous Hyperlocal Governance Intelligence Platform*

**Winner of the Google Developers x Coding Ninjas Vibe2Ship Hackathon**  
*Fusing Interactive Civic Digital Twins, Multi-Agent AI Networks, and Predictive Telemetry to Redefine Hyperlocal Public Governance.*

---

## 📌 Problem Statement
Hyperlocal civic reporting (potholes, water leaks, garbage heaps, streetlight outages) is fundamentally broken. Current channels are fragmented, slow, opaque, and entirely reactive. Citizens feel ignored, and municipalities operate blindly without predictive insights or optimal resource allocations.

## 💡 Core Vision
**CivicMind AI** transforms the traditional reactive "Citizen → Complaint → Admin" funnel into an autonomous, agentic civic intelligence loop:

```
Citizen
   ↓
Vision Agent (Analyzes Image/Text Payload)
   ↓
Categorization Agent (Calculates Severity & Hazard Risk)
   ↓
Geo Agent (Registers Telemetry on Digital Twin grid)
   ↓
Verification Agent (Runs Haversine deduplication clusters)
   ↓
Prediction Agent (Predicts escalation risk & failure spread)
   ↓
Resolution Agent (Drafts Repair & Cost Plan)
   ↓
Analytics Agent (Updates Ward risk and Health diagnostics)
   ↓
Notification Agent (Notifies local citizens & dispatches teams)
   ↓
Government Dashboard (Administrative Action / Solved status)
```

---

## 🚀 Key Features

### 1. Multi-Agent AI Core (`/src/components/MultiAgentVisualizer.tsx`)
Operates 8 decentralized agents powered by **Gemini 3.5 Flash** server-side schemas. Each agent has dedicated roles:
- **Vision Agent**: Extracts volumetric structural defect data from photos and transcripts.
- **Categorization Agent**: Classifies issues and sets safety risk multipliers.
- **Geo Agent**: Verifies bounding coordinates and updates digital twin grids.
- **Verification Agent**: Clusters neighboring complaints of matching categories using Haversine formulas to prevent duplicate ticketing.
- **Prediction Agent**: Forecasts structural deterioration curves.
- **Resolution Agent**: Synthesizes custom Repair Blueprints (assigned dept, cost forecasts, duration, crew allocations).
- **Analytics Agent**: Recalculates ward-wide risk index indexes.
- **Notification Agent**: Pushes alerts and logs gamification progress.

### 2. Civic Digital Twin (`/src/components/DigitalTwinMap.tsx`)
A high-fidelity virtual city map built with interactive SVG vector layouts. Admins and citizens can toggle layers representing:
- **Live Active Incidents**
- **Severity Heatmaps**
- **Structural Fatigue Stress Zones**
- **Predictive Deterioration Risks**

### 3. Duplicate Detection Engine
Reduces admin fatigue by checking distance and category in real time. If a citizen attempts to report an issue within 150 meters of an active ticket, the system displays a duplicate alert and bundles the entry under a **Master Incident**.

### 4. Predictive Civic Intelligence (`/src/components/PredictionEngine.tsx`)
Forecasts structural collapses (e.g., "87% chance of pothole formation in the next 20 days"). Features an interactive **Pre-emptive Maintenance** action to dispatch crew members *before* the infrastructure fails.

### 5. Gamification Core (`/src/components/CitizenPlatform.tsx`)
Incentivizes crowd validation. Citizens earn **Hero Points** and **Reputation Scores** by reporting issues or voting on/verifying active reports, unlocking custom badges like **Road Guardian**, **Water Protector**, **City Defender**, and **Civic Champion**.

### 6. Government Dispatch Console (`/src/components/GovernmentDashboard.tsx`)
A unified command center for municipal officials to manage active queues, update repair progress, inspect AI-generated cost blueprints, and log official administrative updates.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, TailwindCSS, Lucide Icons, Framer Motion transitions.
- **Backend**: Node.js, Express, tsx.
- **AI Integrations**: `@google/genai` (utilizing server-side **Gemini 3.5 Flash** with JSON `responseSchema` constraints).
- **Local Fallback**: Robust, rule-based semantic parser that handles operations if no API keys are present.

### ER Database Schema & States
- **Incident**: `{ id, title, description, category, status, severity, urgency, latitude, longitude, ward, reportedBy, reportedAt, upvotes, verifiedCount, confidenceScore, resolutionPlan: { assignedDepartment, estimatedCost, estimatedTimeDays, allocatedResources } }`
- **AgentLog**: `{ id, timestamp, agentName, status, task, thought, output, incidentId }`
- **PredictionInsight**: `{ id, category, latitude, longitude, ward, probability, timeframeDays, reason, riskScore, recommendedAction }`
- **CitizenLeaderboardItem**: `{ id, username, level, heroPoints, reportsSubmitted, reportsVerified, reputationScore, badges }`

---

## 💻 Development & Execution

### Prerequisites
Ensure your workspace has a `GEMINI_API_KEY` configured in the Secrets manager to enjoy full multi-modal AI reporting features.

### Commands

1. **Install Base dependencies**:
   ```bash
   npm install
   ```

2. **Run in development mode**:
   ```bash
   npm run dev
   ```

3. **Build and bundle for production**:
   ```bash
   npm run build
   ```

4. **Start production server**:
   ```bash
   npm run start
   ```

---
