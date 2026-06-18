import { useState } from 'react';
import Footer from '../components/core/Footer';

interface FaqItem {
  question: string;
  answer: string;
  category: 'geral' | 'caravana' | 'plataforma';
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'geral' | 'caravana' | 'plataforma'>('todos');

  const faqData: FaqItem[] = [
    {
      category: 'geral',
      question: 'O que é o projeto iNTEGRA-TE?',
      answer: 'O iNTEGRA-TE é uma iniciativa inovadora no concelho de Loulé que combate o absentismo escolar e a exclusão social. Combinamos uma caravana pedagógica itinerante com uma plataforma digital para apoiar crianças, famílias e escolas.'
    },
    {
      category: 'caravana',
      question: 'Como funciona a caravana itinerante?',
      answer: 'A caravana desloca-se diretamente às comunidades e escolas do concelho. Funciona como um espaço seguro, lúdico e totalmente adaptado onde técnicos especializados realizam atividades pedagógicas com crianças do infantário ao 4.º ciclo.'
    },
    {
      category: 'geral',
      question: 'O projeto tem algum custo para as famílias?',
      answer: 'Não, o projeto é 100% gratuito para todas as famílias, escolas e comunidades integradas no programa do concelho de Loulé.'
    },
    {
      category: 'plataforma',
      question: 'Quem pode aceder à plataforma digital?',
      answer: 'A plataforma está aberta a toda a comunidade educativa: alunos, encarregados de educação, professores e técnicos. Foi desenhada para ser simples e acessível, mesmo para quem tem pouca literacia digital.'
    },
    {
      category: 'plataforma',
      question: 'Que tipo de conteúdos existem na plataforma?',
      answer: 'Encontrará jogos educativos interativos, materiais de apoio ao estudo adaptados a diferentes ciclos, recursos de sensibilização contra a discriminação e ferramentas de comunicação direta com os técnicos do projeto.'
    },
    {
      category: 'geral',
      question: 'Como podemos inscrever uma criança ou escola?',
      answer: 'A articulação é feita diretamente com os agrupamentos de escolas parceiros e equipas sociais locais. No entanto, pode entrar em contacto connosco através do formulário de contacto para sabermos como ajudar na sua zona.'
    }
  ];

  const filteredFaq = faqData.filter(item =>
    activeFilter === 'todos' ? true : item.category === activeFilter
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="relative overflow-hidden bg-[#c8e8ff] font-['Nunito',sans-serif] min-h-screen pb-2">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&family=Fredoka+One&display=swap');

        @keyframes cloudDrift1 {
          0%   { transform: translateX(-220px); }
          100% { transform: translateX(110vw); }
        }
        @keyframes cloudDrift2 {
          0%   { transform: translateX(-180px); }
          100% { transform: translateX(110vw); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sunRays {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .cloud-1 { animation: cloudDrift1 36s linear infinite; }
        .cloud-2 { animation: cloudDrift2 44s linear infinite 10s; }
        .animate-slideUp { animation: slideUp 0.6s ease both; }

        .faq-transition {
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, padding 0.35s ease;
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-44 h-44 opacity-20">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{ animation: 'sunRays 45s linear infinite', transformOrigin: '80px 80px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="80" y1="8" x2="80" y2="22"
                  stroke="#f9c74f" strokeWidth="3" strokeLinecap="round"
                  transform={`rotate(${i * 30} 80 80)`}
                />
              ))}
            </g>
            <circle cx="80" cy="80" r="32" fill="#f9c74f" />
          </svg>
        </div>

        <div className="cloud-1 absolute top-12">
          <svg width="180" height="70" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="56" rx="90" ry="28" fill="white" fillOpacity="0.5"/>
            <ellipse cx="70"  cy="44" rx="44" ry="36" fill="white" fillOpacity="0.5"/>
          </svg>
        </div>
        <div className="cloud-2 absolute top-72">
          <svg width="140" height="55" viewBox="0 0 130 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="65"  cy="36" rx="58" ry="18" fill="white" fillOpacity="0.4"/>
            <ellipse cx="86"  cy="30" rx="26" ry="20" fill="white" fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center relative z-10">
        <div className="animate-slideUp inline-flex items-center gap-2 bg-[#9b59b6] text-white text-xs font-bold tracking-wider uppercase px-5 py-2 rounded-full mb-6 shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Dúvidas Frequentes
        </div>

        <h1
          className="animate-slideUp font-['Fredoka_One',cursive] text-4xl md:text-5xl leading-tight mb-4"
          style={{ color: '#0c447c', textShadow: '0 3px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(12,68,124,0.12)' }}
        >
          Perguntas Frequentes
        </h1>

        <p className="animate-slideUp text-[#1a3a6a] max-w-lg text-base leading-relaxed center">
          Tens alguma dúvida sobre o funcionamento da caravana ou da plataforma? Encontra aqui todas as respostas rápidas!
        </p>

        <div className="animate-slideUp mt-8 flex flex-wrap justify-center gap-2.5">
          {[
            { id: 'todos', label: '🌟 Todos', color: '#3a6bc8' },
            { id: 'geral', label: '🤝 Geral', color: '#9b59b6' },
            { id: 'caravana', label: '🚌 Caravana', color: '#f76c6c' },
            { id: 'plataforma', label: '💻 Plataforma', color: '#3db8f5' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => { setActiveFilter(filter.id as any); setOpenIndex(null); }}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 transform active:scale-95 shadow-sm
                ${activeFilter === filter.id
                  ? 'text-white scale-105 shadow-md'
                  : 'bg-white/70 text-[#1a3a6a] hover:bg-white'
                }`}
              style={{ backgroundColor: activeFilter === filter.id ? filter.color : undefined }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="space-y-4">
          {filteredFaq.length > 0 ? (
            filteredFaq.map((item, index) => {
              const isOpen = openIndex === index;

              const themeColor =
                item.category === 'caravana' ? '#f76c6c' :
                item.category === 'plataforma' ? '#3db8f5' : '#9b59b6';

              return (
                <div
                  key={index}
                  className="bg-white/85 backdrop-blur-sm rounded-2xl border-2 overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isOpen ? themeColor : 'rgba(255,255,255,0.6)',
                    boxShadow: isOpen ? `0 12px 28px ${themeColor}15` : '0 4px 16px rgba(0,0,0,0.04)'
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-base md:text-[17px] text-[#0c447c] gap-4 transition-colors duration-200 hover:bg-white/40"
                  >
                    <span className="font-['Nunito',sans-serif] font-extrabold" style={{ color: isOpen ? themeColor : '#0c447c' }}>
                      {item.question}
                    </span>

                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isOpen ? themeColor : '#E6F1FB',
                        color: isOpen ? 'white' : themeColor,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>

                  <div
                    className="faq-transition overflow-hidden"
                    style={{
                      maxHeight: isOpen ? '240px' : '0px',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="p-5 pt-0 text-sm md:text-base text-[#4a5a7a] leading-relaxed border-t border-dashed border-gray-100">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60">
              <p className="text-[#4a5a7a] font-bold">Nenhuma pergunta encontrada nesta categoria.</p>
            </div>
          )}
        </div>

        <div className="mt-12 bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-10 text-center shadow-sm">
          <h3 className="font-['Fredoka_One',cursive] text-lg text-[#0c447c] mb-3">Ainda ficas-te com dúvidas?</h3>
          <p className="text-xs text-[#6677aa] mb-4">Não te preocupes, a nossa equipa está sempre pronta para ajudar a tua família ou escola!</p>
          <button className="bg-[#3a6bc8] hover:bg-[#2a5ab8] text-white font-bold text-xs uppercase tracking-wider px-3 py-3 rounded-xl transition-colors shadow-md transform active:scale-95 mt-3">
            Enviar Mensagem
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
