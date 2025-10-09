export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteDraft = {
  title: string;
  content: string;
};
