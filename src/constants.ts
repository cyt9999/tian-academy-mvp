import { Lesson } from '@/types';

export const COLORS = {
  primary: '#10b981',
  secondary: '#f59e0b',
  background: '#020617',
  card: '#0f172a',
};

// Strictly using the YouTube thumbnails provided by the user
const YT_THUMBS = [
  'https://img.youtube.com/vi/lHkczC8C71g/0.jpg',
  'https://img.youtube.com/vi/J1dQyw-bZlo/0.jpg',
  'https://img.youtube.com/vi/3HZRuQiswF4/0.jpg',
  'https://img.youtube.com/vi/lHkczC8C71g/0.jpg' // Re-use one for the 4th lesson
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    title: '第一課：CSP 入門與 Delta 核心概念',
    thumbnail: YT_THUMBS[0],
    duration: '25:00',
    category: '複利萌芽',
    phase: 1,
    summary: '適合小資金新手。學習如何手動輸入參數，觀察損益圖變化，並理解天哥最核心的「安全邊際」。',
    materials: ['Delta 概率對照表.pdf', '新手 CSP 紀錄表.xlsx'],
    transcription: [
      { time: '00:00', text: '大家好，我是天哥。今天我們來聊聊期權複利的第一步。' },
      { time: '02:30', text: '所謂的 CSP，就是現金擔保看跌期權。' },
      { time: '05:15', text: 'Delta 的重要性在於它告訴你行權價被觸發的概率。' }
    ]
  },
  {
    id: '2',
    title: '第二課：垂直價差的防禦性佈局',
    thumbnail: YT_THUMBS[1],
    duration: '32:00',
    category: '複利萌芽',
    phase: 1,
    summary: '利用價差對沖，用最少的保證金參與市場震盪，限制最大虧損。',
    materials: ['垂直價差風險手冊.pdf'],
    transcription: [
      { time: '00:00', text: '垂直價差是保護你的資產不被大幅波動吞噬的利器。' }
    ]
  },
  {
    id: '3',
    title: '第三課：輪轉策略 (The Wheel) 完整閉環管理',
    thumbnail: YT_THUMBS[2],
    duration: '58:00',
    category: '穩健收租',
    phase: 2,
    summary: '進階管理多個階段。從 CSP 到接股後的 Covered Call，建立長期穩定的收租系統。',
    materials: ['輪轉策略轉換流程.pdf'],
    transcription: [
      { time: '00:00', text: 'Wheel Strategy 是一個完整的循環。' }
    ]
  },
  {
    id: '4',
    title: '第四課：LEAPS / PMCC 槓桿效率最大化',
    thumbnail: YT_THUMBS[3],
    duration: '45:00',
    category: '策略優化',
    phase: 3,
    summary: '進階玩家必修。利用 Delta > 0.8 的長期 Call 模擬現股，高效運用資金。',
    materials: ['槓桿效率計算器.xlsx'],
    transcription: [
      { time: '00:00', text: 'LEAPS 是長期的深度實值期權。' }
    ]
  }
];

export const STRATEGY_MATRIX = [
  { name: '輪轉策略 (Wheel)', level: 5, capital: '最高', greeks: 'Delta, Theta', goal: '長期複利系統' },
  { name: '備兌看漲 (CC)', level: 2, capital: '高', greeks: 'Theta, Delta', goal: '持股加薪計畫' },
  { name: '現金擔保 (CSP)', level: 2, capital: '中高', greeks: 'Delta, Theta', goal: '低價接股/收租' },
  { name: '長期代股 (LEAPS)', level: 4, capital: '中', greeks: 'Delta, Vega', goal: '以小博大/類現股' },
];

export const MOCK_TICKERS: Record<string, number> = {
  'AAPL': 189.43,
  'TSLA': 175.22,
  'NVDA': 875.38,
  'MSFT': 415.50,
  'AMD': 160.79,
  'SPY': 512.30,
  'QQQ': 438.10
};
