export interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "blocked";
  lastLogin: string;
  lastSession: string;
  emergencyFlag: boolean;
  avatar: string;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface TherapySession {
  id: string;
  userId: string;
  userName: string;
  type: string;
  duration: string;
  messageCount: number;
  status: "completed" | "active";
  sentiment: string;
  flagged: boolean;
  messages: ChatMessage[];
  date: string;
}

export interface EmergencyEvent {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  triggerSource: "user" | "system";
  twilioGeoStatus: string;
  cooldownStatus: "active" | "cleared";
  timeline: { title: string; time: string; desc: string }[];
}

export interface TwilioRegion {
  id: string;
  country: string;
  region: string;
  status: "active" | "inactive";
  registeredAddress: string;
}

export interface SystemSetting {
  emergencySystemEnabled: boolean;
  cooldownHours: number;
  maintenanceMode: boolean;
  aiChatEnabled: boolean;
  rateLimitThreshold: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  category: "SYSTEM" | "AUTH" | "CRISIS" | "SECURITY";
  severity: "INFO" | "WARNING" | "CRITICAL";
  description: string;
  operator?: string;
}

export interface AdminProfile {
  name: string;
  role: string;
  email: string;
  lastLogin: string;
}

// Persist the database in-memory globally in Next.js development
declare global {
  var _mockDb: {
    users: User[];
    sessions: TherapySession[];
    emergencyEvents: EmergencyEvent[];
    twilioRegions: TwilioRegion[];
    settings: SystemSetting;
    logs: SystemLog[];
    adminProfile: AdminProfile;
  } | undefined;
}

const initialUsers: User[] = [
  {
    id: "USR-001",
    name: "Elena Rodriguez",
    email: "elena.r@hmail.com",
    status: "active",
    lastLogin: "2026-05-17 14:32:00",
    lastSession: "2026-05-17 14:12:00",
    emergencyFlag: false,
    avatar: "ER"
  },
  {
    id: "USR-002",
    name: "Marcus Chen",
    email: "marcus.chen@outlook.com",
    status: "active",
    lastLogin: "2026-05-17 15:10:00",
    lastSession: "2026-05-17 14:45:00",
    emergencyFlag: true,
    avatar: "MC"
  },
  {
    id: "USR-003",
    name: "Sarah Jenkins",
    email: "s.jenkins@practitioner.com",
    status: "active",
    lastLogin: "2026-05-16 18:22:00",
    lastSession: "2026-05-16 17:55:00",
    emergencyFlag: false,
    avatar: "SJ"
  },
  {
    id: "USR-004",
    name: "Thomas Wayne",
    email: "t.wayne@gotham.org",
    status: "blocked",
    lastLogin: "2026-05-12 09:15:00",
    lastSession: "2026-05-12 08:30:00",
    emergencyFlag: false,
    avatar: "TW"
  }
];

const initialSessions: TherapySession[] = [
  {
    id: "SESS-001",
    userId: "USR-001",
    userName: "Elena Rodriguez",
    type: "Voice Support",
    duration: "14m 20s",
    messageCount: 8,
    status: "completed",
    sentiment: "Stable",
    flagged: false,
    date: "2026-05-17",
    messages: [
      { sender: "user", text: "I've been feeling extremely overwhelmed at work recently.", timestamp: "14:12:05" },
      { sender: "ai", text: "I hear you, Elena. Work stress can accumulate quickly. Let's take a deep breath. What specifically feels heaviest today?", timestamp: "14:12:15" },
      { sender: "user", text: "Just the sheer volume of tasks and deadlines.", timestamp: "14:13:00" },
      { sender: "ai", text: "It's completely normal to feel that way when demands outpace our focus. Let's try listing the top two items together.", timestamp: "14:13:20" }
    ]
  },
  {
    id: "SESS-002",
    userId: "USR-002",
    userName: "Marcus Chen",
    type: "Biometric Chat",
    duration: "42m 15s",
    messageCount: 14,
    status: "active",
    sentiment: "Distressed",
    flagged: true,
    date: "2026-05-17",
    messages: [
      { sender: "user", text: "I don't know what to do anymore. I feel completely disconnected and lost.", timestamp: "14:45:10" },
      { sender: "ai", text: "Marcus, I am right here with you. You are not alone. Please tell me more about what you're feeling right now.", timestamp: "14:45:30" },
      { sender: "user", text: "It's like everything is crashing. I'm having trouble breathing.", timestamp: "14:46:12" },
      { sender: "ai", text: "I understand, Marcus. Your safety is most important. Let's do a simple 4-4-4 breathing technique. Inhale for four seconds...", timestamp: "14:46:40" }
    ]
  }
];

const initialEmergencyEvents: EmergencyEvent[] = [
  {
    id: "EMR-9201",
    userId: "USR-002",
    userName: "Marcus Chen",
    timestamp: "2026-05-17 14:46:15",
    triggerSource: "system",
    twilioGeoStatus: "Delivered (San Francisco, CA)",
    cooldownStatus: "active",
    timeline: [
      { title: "Biometric Crisis Threshold", time: "14:46:12", desc: "System detected critical panic signal and breathing difficulty." },
      { title: "Twilio Dispatch Initialized", time: "14:46:15", desc: "Automated emergency SMS dispatched to registered emergency contact." },
      { title: "Local Geo Routing", time: "14:46:20", desc: "Twilio location tracking mapped to CA-Zone-9." }
    ]
  }
];

const initialTwilioRegions: TwilioRegion[] = [
  { id: "REG-01", country: "United States", region: "California (US-West)", status: "active", registeredAddress: "120 Pine St, San Francisco, CA" },
  { id: "REG-02", country: "United States", region: "New York (US-East)", status: "active", registeredAddress: "350 5th Ave, New York, NY" },
  { id: "REG-03", country: "United Kingdom", region: "London (UK-South)", status: "active", registeredAddress: "10 Downing St, London" }
];

const initialSettings: SystemSetting = {
  emergencySystemEnabled: true,
  cooldownHours: 24,
  maintenanceMode: false,
  aiChatEnabled: true,
  rateLimitThreshold: 120
};

const initialLogs: SystemLog[] = [
  { id: "LOG-1001", timestamp: "2026-05-17 15:24:00", category: "AUTH", severity: "INFO", description: "Admin session authenticated successfully", operator: "Admin User" },
  { id: "LOG-1002", timestamp: "2026-05-17 14:46:15", category: "CRISIS", severity: "CRITICAL", description: "Biometric system trigger dispatched for Marcus Chen" },
  { id: "LOG-1003", timestamp: "2026-05-17 14:10:00", category: "SYSTEM", severity: "WARNING", description: "Database cluster replication delay exceeded 150ms" },
  { id: "LOG-1004", timestamp: "2026-05-17 12:30:14", category: "SECURITY", severity: "WARNING", description: "Blocked login attempt from IP 203.0.113.45" }
];

const initialAdminProfile: AdminProfile = {
  name: "Admin User",
  role: "Administrator",
  email: "admin@aurapulse.com",
  lastLogin: "2026-05-17 15:24:00"
};

if (!global._mockDb) {
  global._mockDb = {
    users: initialUsers,
    sessions: initialSessions,
    emergencyEvents: initialEmergencyEvents,
    twilioRegions: initialTwilioRegions,
    settings: initialSettings,
    logs: initialLogs,
    adminProfile: initialAdminProfile
  };
}

export const mockDb = global._mockDb;

// Helper to push admin actions into the logs
export function logAdminAction(desc: string) {
  const newLog: SystemLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    category: "SYSTEM",
    severity: "INFO",
    description: `Admin action: ${desc}`,
    operator: "Admin User"
  };
  mockDb.logs.unshift(newLog);
}
