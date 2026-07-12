export type LeadSource = 'referral' | 'portal' | 'sign_call' | 'website';
export type LeadType = 'buyer' | 'seller' | 'investor' | 'past_client';
export type Channel = 'voice' | 'sms' | 'web';

export interface Lead {
  id: string;
  source: LeadSource;
  type: LeadType;
  contact: { name: string; phone: string; email?: string };
  channel: Channel;
  message: string;
  createdAt: number;
  qualified: boolean;
  valueEstimate: { transaction: number; lifetime: number }; // USD
}

export interface Appointment {
  id: string;
  leadId: string;
  type: 'showing' | 'listing_consult' | 'investor_review' | 'callback';
  channel: Channel;
  agent: string;
  start: number; // epoch ms
  durationMin: number;
  confirmed: boolean;
}

export type VoiceTurn = { role: 'ai' | 'caller'; text: string; at: number };

export interface AIVoiceSession {
  id: string;
  leadId: string;
  status: 'ringing' | 'connected' | 'qualifying' | 'booking' | 'complete';
  startedAt: number;
  transcript: VoiceTurn[];
  outcome?: { qualified: boolean; appointmentId?: string };
}

export interface LeadStream {
  id: LeadSource;
  label: string;
  monthlyLeads: number;
  missedPct: number; // fraction missed pre-AI
  color: string;
  height: number; // normalized bar height
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  leadType: LeadType;
  situation: string;
  aiResponse: string;
  speedToBooking: string;
  projectedLTV: string;
  color: string;
}
