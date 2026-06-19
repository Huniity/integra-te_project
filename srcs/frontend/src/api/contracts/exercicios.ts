export interface Exercicio {
  id: number;
  title: string;
  level: number;
  subjectId: string;
  titleColor: string;
  iconImg: string;
  path: string;
  description: string;
  pdfUrl: string | null;
}
