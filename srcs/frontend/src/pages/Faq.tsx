import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';

interface FaqItem {
  question: string;
  answer: string;
  category: 'geral' | 'caravana' | 'plataforma';
}

export default function Faq() {
  return <FaqContent />;
}

function FaqContent() {
  const { isNightMode } = useNightMode();
  const navigate = useNavigate();
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

  // As tuas variáveis de estilo personalizadas
  const sectionBg = isNightMode
    ? 'bg-slate-900/50 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.3)] border border-white/10 text-white'
    : 'bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30 text-white';

  const cardBg = isNightMode
    ? 'bg-slate-950/60 border border-white/10 text-white'
    : 'bg-white/80 border border-white/40 text-[#1e3a8a] rounded-2xl shadow-sm';

  const cardTag = isNightMode
    ? 'bg-[#185FA5]/30 text-blue-300'
    : 'bg-blue-50/95 text-blue-800';

  return (
    <main
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed font-['Nunito',sans-serif] overflow-hidden flex flex-col justify-between"
      style={{ backgroundImage: 'url(./src/assets/content2.webp)' }}
    >
      <NightModeBackground dayImage='./src/assets/content2.webp' nightImage='./src/assets/noite.webp' />

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s ease both; }

        .faq-transition {
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, padding 0.35s ease;
        }
      `}</style>

      {/* Content wrapper com Scrollbar Oculta */}
      <div
        className="flex-1 max-w-4xl w-full mx-auto relative z-10 flex flex-col min-h-0 overflow-y-auto py-2 pr-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none !important;
          }
        `}</style>

        <div className="max-w-3xl w-full mx-auto flex flex-col pt-12 sm:pt-16 pb-16 sm:pb-24 md:pb-36 px-3 sm:px-4 md:px-6">

          {/* SECÇÃO PRINCIPAL COM O TEU SECTIONBG */}
          <section className={`w-full p-4 sm:p-6 md:p-10 ${sectionBg}`}>

            <div className="text-center shrink-0 mb-8">
              <div className="animate-slideUp inline-flex items-center gap-2 bg-[#9b59b6] text-white text-xs font-bold tracking-wider uppercase px-5 py-2 rounded-full mb-6 shadow-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Dúvidas Frequentes
              </div>

              <h1 className="animate-slideUp font-['Fredoka',sans-serif] text-2xl sm:text-3xl md:text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] inline-block tracking-wide text-white">
                Perguntas Frequentes
              </h1>

              <p className={`animate-slideUp max-w-lg text-sm md:text-base leading-relaxed mx-auto font-semibold mt-4 ${isNightMode ? 'text-gray-200' : 'text-blue-50'}`}>
                Tens alguma dúvida sobre o funcionamento da caravana ou da plataforma? Encontra aqui todas as respostas rápidas!
              </p>

              {/* Filtros customizados combinando com o design */}
              <div className="animate-slideUp mt-8 flex flex-wrap justify-center gap-2.5">
                {[
                  { id: 'todos', label: 'Todos', color: '#1e40af' },
                  { id: 'geral', label: 'Geral', color: '#8e44ad' },
                  { id: 'caravana', label: 'Caravana', color: '#e74c3c' },
                  { id: 'plataforma', label: 'Plataforma', color: '#2980b9' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => { setActiveFilter(filter.id as any); setOpenIndex(null); }}
                    className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 transform active:scale-95 shadow-sm
                      ${activeFilter === filter.id
                        ? 'text-white scale-105 shadow-md border border-white/20'
                        : 'bg-white text-[#1a3a6a] hover:bg-gray-100'
                      }`}
                    style={{ backgroundColor: activeFilter === filter.id ? filter.color : undefined }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista com o teu cardBg nos cartões */}
            <div className="w-full flex flex-col gap-4">
              {filteredFaq.length > 0 ? (
                filteredFaq.map((item, index) => {
                  const isOpen = openIndex === index;

                  const themeColor =
                    item.category === 'caravana' ? '#f76c6c' :
                    item.category === 'plataforma' ? '#3db8f5' : '#9b59b6';

                  return (
                    <div
                      key={index}
                      className={`${cardBg} overflow-hidden transition-all duration-300 rounded-2xl border`}
                      style={{
                        borderColor: isOpen ? themeColor : undefined,
                      }}
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-base md:text-[17px] gap-4 transition-colors duration-200 hover:bg-white/20 dark:hover:bg-white/5"
                      >
                        <span className="font-['Nunito',sans-serif] font-extrabold" style={{ color: isOpen && !isNightMode ? '#1e40af' : undefined }}>
                          {item.question}
                        </span>

                        <span
                          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isOpen ? themeColor : (isNightMode ? 'rgba(24, 95, 165, 0.3)' : '#E6F1FB'),
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
                        <div className={`p-5 pt-0 text-sm md:text-base leading-relaxed border-t border-dashed ${isNightMode ? 'text-gray-200 border-white/10' : 'text-[#2563eb] border-gray-200/60'}`}>
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-12 rounded-2xl ${cardTag}`}>
                  <p className="font-bold">Nenhuma pergunta encontrada nesta categoria.</p>
                </div>
              )}
            </div>

                        {/* Rodapé Interno com a cor injetada diretamente via JS */}
            <div className={`mt-8 sm:mt-12 p-4 sm:p-6 md:p-8 text-center shrink-0 rounded-2xl border ${cardBg}`}>
              <h3
                className="font-['Fredoka',sans-serif] font-black text-lg mb-2"
                style={{ color: isNightMode ? '#ffffff' : '#0c447c' }}
              >
                Ainda ficaste com dúvidas?
              </h3>

              <p
                className="text-xs md:text-sm mb-4 font-medium opacity-90"
                style={{ color: isNightMode ? '#ffffff' : '#4a5a7a' }}
              >
                Não te preocupes, a nossa equipa está sempre pronta para ajudar a tua família ou escola!
              </p>

              <button
                onClick={() => navigate('/contactos')}
                className="bg-[#3a6bc8] hover:bg-[#2a5ab8] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-md transform active:scale-95"
              >
                Enviar Mensagem
              </button>
            </div>

          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
