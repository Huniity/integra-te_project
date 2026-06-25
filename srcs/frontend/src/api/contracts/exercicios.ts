export interface Exercicio {
  id: string;
  title: string;
  subjectId: string;
  level: number;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  ficheiro_url?: string;
  publicado: boolean;
  // legacy fields (kept for backward compat with ExerciseModal)
  titleColor?: string;
  iconImg?: string;
  path?: string;
  pdfUrl?: string | null;
}

export interface ExercicioPayload {
  title: string;
  subjectId: string;
  level: number;
  description?: string;
  thumbnailUrl?: string;
  thumbnail?: File | null;
  videoUrl?: string;
  ficheiro?: File | null;
  publicado: boolean;
}
