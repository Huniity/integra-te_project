export { useCarousel, CarouselNav as AprenderCarouselNav } from '../core/Carousel';

import AprenderCard from './AprenderCard';
import type { Aula } from '../../api/contracts/aulas';

interface Props {
    pageItems: Aula[];
    onSelect: (aula: Aula) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export default function AprenderCarousel({ pageItems, onSelect, onTouchStart, onTouchEnd }: Props) {
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-stretch"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {pageItems.map(aula => (
                <AprenderCard key={aula.id} aula={aula} onSelect={onSelect} />
            ))}
        </div>
    );
}
