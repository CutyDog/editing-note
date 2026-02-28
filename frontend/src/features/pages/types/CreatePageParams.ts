export interface CreatePageParams {
  title: string;
  parent_id?: number | null;
  position?: number;
  content?: Record<string, unknown>[];
}
