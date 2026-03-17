export interface AnswerField {
  id: string;
  label: string; // e.g., "父", "母"
  correctAnswer: string;
}

export interface SubQuestion {
  id: string;
  label: string; // e.g., "(2)父母の名"
  fields: AnswerField[];
}

export interface QuestionStats {
  attempts: number;
  corrects: number;
  incorrects: number;
  lastIncorrectTime?: number; // 常に最新の間違いを追跡
}

export interface Question {
  id: string;
  title: string;
  body: string;
  subQuestions: SubQuestion[];
  stats?: QuestionStats;
}

export type LearningMode = 'ALL' | 'INCORRECT' | 'WEAK';
