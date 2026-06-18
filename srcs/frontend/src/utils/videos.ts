import type { Subject } from '../components/core/Aside';

export const subjects: Subject[] = [
  {
    id: 'todos',
    label: 'Todos',
    iconImg: './src/assets/video.webp',
    path: '/videos',
  },
  {
    id: 'portugues',
    label: 'Português',
    iconImg: './src/assets/letter.webp',
    path: '/videos/portugues',
  },
  {
    id: 'matematica',
    label: 'Matemática',
    iconImg: './src/assets/math.webp',
    path: '/videos/matematica',
  },
  {
    id: 'estudo-do-meio',
    label: 'Estudo do Meio',
    iconImg: './src/assets/world.webp',
    path: '/videos/estudo-do-meio',
  },
];
