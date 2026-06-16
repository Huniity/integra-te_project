export interface Aula {
  id: number;
  title: string;
  subjectId: string;
  level: number;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt?: string;
}
