export interface UpdatePageParams {
  title?: string;
  content?: Record<string, unknown>[];
  position?: number;
  parent_id?: number | null;
}
