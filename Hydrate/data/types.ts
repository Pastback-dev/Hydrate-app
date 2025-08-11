
export type WaterEntry = {
  id: string; // unique id
  amountMl: number;
  timestamp: number; // ms since epoch
};

export type DayLog = {
  date: string; // YYYY-MM-DD
  totalMl: number;
  entries: WaterEntry[];
};

export type WaterState = {
  goalMl: number;
  days: Record<string, DayLog>;
};

export type ReminderSettings = {
  enabled: boolean;
  times: string[]; // 'HH:mm'
};
