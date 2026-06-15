import type { Subject } from '../components/resolver/Aside';

export const subjects: Subject[] = [
  {
    id: 'todos',
    label: 'Todos',
    iconImg: './src/assets/book2.png',
    // iconBg: 'bg-slate-100',
    path: '/exercicios',
  },
  {
    id: 'portugues',
    label: 'Português',
    iconImg: './src/assets/letter.webp',
    // iconBg: 'bg-green-100',
    path: '/exercicios/portugues',
  },
  {
    id: 'matematica',
    label: 'Matemática',
    iconImg: './src/assets/math.webp',
    // iconBg: 'bg-blue-100',
    path: '/exercicios/matematica',
  },
  {
    id: 'estudo-do-meio',
    label: 'Estudo do Meio',
    iconImg: './src/assets/world.webp',
    // iconBg: 'bg-sky-100',
    path: '/exercicios/estudo-do-meio',
  },
];
