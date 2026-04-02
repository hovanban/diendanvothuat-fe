/**
 * Shared type interfaces for FE components
 * No mongoose dependencies - plain TypeScript interfaces
 */

export interface UserId {
  userId: string;
}

export interface QuestionId {
  questionId: string;
}

export interface Voting {
  hasupVoted: boolean;
  hasdownVoted: boolean;
}
