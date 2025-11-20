export enum SentimentType {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral'
}

export interface SentimentData {
  score: number; // 0 to 100
  sentiment: SentimentType;
  summary: string;
  keyPoints: string[];
  trendingHashtags: string[];
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  data: SentimentData;
  sources: GroundingSource[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill: string;
}