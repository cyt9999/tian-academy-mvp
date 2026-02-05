
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

export interface Assignment {
  id: string;
  title: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  feedback?: string;
  submittedAt?: string;
}
