
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// Added 'strangle' to support the Advanced Mode in OptionsLab
export type StrategyType = 
  | 'long_call' 
  | 'short_put' 
  | 'iron_condor' 
  | 'vertical_spread' 
  | 'wheel' 
  | 'covered_call' 
  | 'leaps'
  | 'strangle';

export interface OptionStrategy {
  name: string;
  type: StrategyType;
  strikes: number[];
  premiums: number[];
  quantity: number;
}

export interface TranscriptionLine {
  time: string;
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  summary: string;
  materials?: string[];
  phase: 1 | 2 | 3; // 1: 萌芽, 2: 穩健, 3: 優化
  transcription?: TranscriptionLine[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  source?: {
    videoTitle: string;
    timestamp: string;
  };
}

// --- Homework System Types ---

export interface UserProfile {
  id: string;
  cmoney_sub: string;
  nickname: string | null;
  role: 'student' | 'tutor';
  created_at: string;
}

export interface Assignment {
  id: string;
  tutor_id: string;
  title: string;
  description: string | null;
  attachment_url: string | null;
  attachment_signed_url?: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  tutor?: { nickname: string | null };
  // Student-specific
  my_submission?: SubmissionBrief | null;
  // Tutor-specific
  submission_count?: number;
  submissions?: Submission[];
}

export interface SubmissionBrief {
  assignment_id: string;
  status: 'submitted' | 'graded';
  grade: string | null;
  submitted_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  file_signed_url?: string;
  file_name: string;
  comment: string | null;
  status: 'submitted' | 'graded';
  grade: string | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
  updated_at: string;
  student?: { id: string; nickname: string | null };
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_submission' | 'graded';
  title: string;
  message: string | null;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
