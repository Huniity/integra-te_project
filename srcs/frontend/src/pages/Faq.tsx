import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      className="relative h-screen w-full px-3 md:px-6 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      <img src="/src/assets/bottom_cloud.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bottom_cloud2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <NightModeBackground dayImage='/src/assets/bg_day.webp' nightImage='/src/assets/bg_night.webp' />

      <motion.div
        className="max-w-3xl w-full mx-auto flex flex-col mt-40 pb-10 relative z-10 px-1"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >

          {/* SECÇÃO PRINCIPAL COM O TEU SECTIONBG */}
          <section className={`w-full p-4 sm:p-6 md:p-10 ${sectionBg}`}>

            <div className="text-center shrink-0 mb-8">
              <h1
                className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl md:text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] inline-block tracking-wide text-white"
                style={!isNightMode ? { textShadow: '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb' } : {}}
              >
                Perguntas <span className="text-[#ffdf6d]">Frequentes</span>
              </h1>
              <div className="mx-auto w-24 h-1.5 bg-[#ffdf6d] rounded-full mt-2 shadow-md" />

              <p className="mt-4 text-sm md:text-base leading-relaxed mx-auto font-semibold text-white/90 max-w-lg">
                Tens alguma dúvida sobre o funcionamento da caravana ou da plataforma? Encontra aqui todas as respostas rápidas!
              </p>

              {/* Category filters */}
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                {[
                  { id: 'todos',     label: 'Todos',      color: '#1e40af' },
                  { id: 'geral',     label: 'Geral',      color: '#8e44ad' },
                  { id: 'caravana',  label: 'Caravana',   color: '#e74c3c' },
                  { id: 'plataforma',label: 'Plataforma', color: '#2980b9' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => { setActiveFilter(filter.id as any); setOpenIndex(null); }}
                    className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-['Fredoka',sans-serif] font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm
                      ${activeFilter === filter.id
                        ? 'text-white scale-105 shadow-md'
                        : isNightMode
                          ? 'bg-white/10 text-white/80 hover:bg-white/20'
                          : 'bg-white/70 text-[#1a3a6a] hover:bg-white'
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
                        borderColor: isOpen ? themeColor : isNightMode ? 'rgba(255,255,255,0.1)' : undefined,
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
                        className="overflow-hidden"
                        style={{
                          maxHeight: isOpen ? '240px' : '0px',
                          opacity: isOpen ? 1 : 0,
                          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease'
                        }}
                      >
                        <div className={`p-5 pt-0 text-sm md:text-base leading-relaxed border-t border-dashed ${isNightMode ? 'text-gray-200 border-white/10' : 'text-[#4a5a7a] border-gray-200/60'}`}>
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
                onClick={() => navigate('/contactar')}
                className="bg-[#3a6bc8] hover:bg-[#2a5ab8] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-md transform active:scale-95"
              >
                Enviar Mensagem
              </button>
            </div>

          </section>

      </motion.div>

      <Footer />
      <div className="mb-50"></div>
    </main>
  );
}
