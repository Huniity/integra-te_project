

export interface Aula {
  id: number;
  title: string;
  subjectId: string;
  level: number;
  description: string;
  videoUrl?: string;
  thumbnail_url?: string;
  publicado: boolean;
}
