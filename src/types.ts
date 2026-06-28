export enum IssueType {
  POTHOLE = "pothole",
  WATER_LEAKAGE = "water_leakage",
  DAMAGED_ROAD = "damaged_road",
  GARBAGE = "garbage",
  FLOODING = "flooding",
  STREETLIGHT_FAILURE = "streetlight_failure",
  DRAINAGE_PROBLEM = "drainage_problem",
  PUBLIC_INFRA_DAMAGE = "public_infrastructure_damage"
}

export enum IssueStatus {
  REPORTED = "reported",
  VISION_VERIFIED = "vision_verified",
  GEOLOCATED = "geolocated",
  DUPLICATE_MERGED = "duplicate_merged",
  CITIZEN_VOTED = "citizen_voted",
  DEPT_ASSIGNED = "department_assigned",
  RESOLVING = "resolving",
  RESOLVED = "resolved"
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IssueType;
  status: IssueStatus;
  severity: "low" | "medium" | "high" | "critical";
  urgency: "low" | "medium" | "high" | "critical";
  latitude: number;
  longitude: number;
  ward: string;
  reportedBy: string;
  reportedAt: string;
  imageUrl?: string;
  voiceTranscript?: string;
  duplicateOfId?: string; // If this is a duplicate, points to the master incident
  mergedIncidentIds?: string[]; // If this is a master incident, lists merged duplicates
  upvotes: number;
  downvotes: number;
  userVoted?: "up" | "down" | null;
  confidenceScore: number; // Verification confidence (e.g. 0.96)
  verifiedCount: number; // Number of citizens verifying
  resolutionPlan?: ResolutionPlan;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface ResolutionPlan {
  assignedDepartment: string;
  repairPriority: "low" | "medium" | "high" | "critical";
  estimatedCost: number;
  estimatedTimeDays: number;
  allocatedResources: string[];
  escalationPath?: string;
  generatedAt: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentName: string;
  status: "idle" | "running" | "completed" | "error";
  task: string;
  thought: string;
  output: string;
  incidentId?: string;
}

export interface PredictionInsight {
  id: string;
  category: IssueType;
  latitude: number;
  longitude: number;
  ward: string;
  probability: number; // e.g. 0.87 (87%)
  timeframeDays: number; // e.g. 20 (within 20 days)
  reason: string;
  riskScore: number; // e.g. 85 / 100
  recommendedAction: string;
}

export interface CitizenLeaderboardItem {
  id: string;
  username: string;
  level: number;
  heroPoints: number;
  reportsSubmitted: number;
  reportsVerified: number;
  reputationScore: number; // Out of 100
  badges: string[];
}

export interface WardMetric {
  wardName: string;
  activeCount: number;
  resolvedCount: number;
  riskIndex: number; // 0-100
  healthScore: number; // 0-100
  totalCostEstimate: number;
}

export interface DepartmentStats {
  name: string;
  activeTickets: number;
  resolvedTickets: number;
  avgResolutionTimeDays: number;
  budgetUtilization: number; // 0-100
  resourceUtilization: number; // 0-100
}
