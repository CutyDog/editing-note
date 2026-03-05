export interface PageSummary {
  id: number;
  title: string;
  position: number;
  parent_id?: number | null;
  created_at: string;
  updated_at: string;
  is_favorited: boolean;
}
