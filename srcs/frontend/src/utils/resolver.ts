import type { Subject } from '../components/resolver/Aside';

export const getLevelBadgeClassName = (level: number) => {
  if (level === 1) return 'bg-emerald-500 text-white';
  if (level === 2) return 'bg-orange-500 text-white';
  return 'bg-purple-500 text-white';
};

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
