export interface BookType {
  id: string;
  title: string;
  ageGroup: string;
  abstract: string;
  externalLink: string;
  photoUrl: string;
  iconType: string;
}

interface BookModalProps {
  book: BookType;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-6 shadow-2xl"
      >

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Capa do Livro */}
        <div className="w-28 h-36 flex items-center justify-center my-2">
          <img
            src={book.photoUrl}
            alt={book.title}
            className="w-full h-full object-contain drop-shadow-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<span class="text-6xl">${book.iconType}</span>`;
            }}
          />
        </div>


        <h3 className="font-['Fredoka',sans-serif] text-2xl font-black text-center text-blue-600 mb-2 mt-2">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500 font-medium text-center leading-relaxed mb-6 px-4">
          {book.abstract}
        </p>

        {/* Botão de Ação */}
        <a
          href={book.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center text-white font-extrabold text-sm py-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
        >
          Começar Leitura 📖
        </a>
      </div>
    </div>
  );
}
