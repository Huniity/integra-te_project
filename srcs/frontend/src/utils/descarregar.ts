import type { Subject } from '../components/core/Aside';

export const subjects: Subject[] = [
  {
    id: 'todos',
    label: 'Todos',
    iconImg: '/src/assets/download.webp',
    path: '/descarregar',
  },
  {
    id: 'portugues',
    label: 'Português',
    iconImg: '/src/assets/letter.webp',
    path: '/descarregar/portugues',
  },
  {
    id: 'matematica',
    label: 'Matemática',
    iconImg: '/src/assets/math.webp',
    path: '/descarregar/matematica',
  },
  {
    id: 'estudo-do-meio',
    label: 'Estudo do Meio',
    iconImg: '/src/assets/world.webp',
    path: '/descarregar/estudo-do-meio',
  },
];
