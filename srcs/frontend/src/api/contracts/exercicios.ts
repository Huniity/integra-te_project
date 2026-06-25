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
  pdfUrl?: string | null;
  // legacy fields (kept for backward compat with ExerciseModal, not editable via the dashboard)
  titleColor?: string;
  iconImg?: string;
  path?: string;
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
  pdfUrl?: string;
}
