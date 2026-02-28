export interface Page {
  id: number;
  title: string;
  content?: any[];
  position: number;
  parent_id: number | null;
  children?: PageSummary[];
  created_at: string;
  updated_at: string;
}

export interface PageSummary {
  id: number;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePageParams {
  title: string;
  parent_id?: number | null;
  position?: number;
  content?: any[];
}

export interface UpdatePageParams {
  title?: string;
  content?: any[];
  position?: number;
  parent_id?: number | null;
}
