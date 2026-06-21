export interface Aula {
  id: string;
  title: string;
  subjectId: string;
  level: number;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  ficheiro_url?: string;
  createdAt?: string;
  publicado: boolean;
}

export interface AulaPayload {
  title: string;
  subjectId: string;
  level: number;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  ficheiro?: File | null;
  publicado: boolean;
}
