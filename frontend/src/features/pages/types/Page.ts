import type { PageSummary } from './PageSummary';

export interface Page {
  id: number;
  title: string;
  content?: Record<string, unknown>[];
  position: number;
  parent_id: number | null;
  children?: PageSummary[];
  created_at: string;
  updated_at: string;
}
