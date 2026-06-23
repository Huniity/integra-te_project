import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';

type TabId = 'projeto' | 'caravana' | 'missao';

export default function About() {
  return <AboutContent />;
}

function AboutContent() {
  const { isNightMode } = useNightMode();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('projeto');

  const sectionBg = isNightMode
    ? 'bg-slate-900/50 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.3)] border border-white/10 text-white'
    : 'bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30 text-white';

  const cardBg = isNightMode
    ? 'bg-slate-950/60 border border-white/10'
    : 'bg-white/85 border-2 border-white/60';

  const innerCardBg = isNightMode
    ? 'bg-white/5 border border-white/10'
    : 'bg-gray-50 border border-gray-100';

  const headingColor = isNightMode ? '#ffdf6d' : '#0c447c';
  const textColor = isNightMode ? '#e2e8f0' : '#4a5a7a';

  const tabs = [
    { id: 'projeto',  label: 'O Projeto',  color: '#3a6bc8' },
    { id: 'caravana', label: 'A Caravana', color: '#e74c3c' },
    { id: 'missao',   label: 'A Missão',   color: '#9b59b6' },
  ] as const;

  return (
    <main
      className="relative h-screen w-full px-3 md:px-6 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      <img src="/src/assets/bottom_cloud.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bottom_cloud2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <NightModeBackground dayImage='/src/assets/day_bg.webp' nightImage='/src/assets/night_bg.webp' />

      <motion.div
        className="max-w-3xl w-full mx-auto flex flex-col mt-40 pb-10 relative z-10 px-1"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <section className={`w-full p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 ${sectionBg}`}>

          {/* Title */}
          <div className="text-center shrink-0">
            <h1
              className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl md:text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] inline-block tracking-wide text-white"
              style={!isNightMode ? { textShadow: '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb' } : {}}
            >
              Sobre o <span className="text-[#ffdf6d]">Projeto</span>
            </h1>
            <div className="mx-auto w-24 h-1.5 bg-[#ffdf6d] rounded-full mt-2 shadow-md shrink-0" />
            <p className="mt-4 text-sm md:text-base font-semibold text-white/90 max-w-xl mx-auto leading-relaxed">
              Uma iniciativa que leva educação, inclusão e esperança diretamente às comunidades do concelho de Loulé.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl font-['Fredoka',sans-serif] font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm
                  ${activeTab === tab.id
                    ? 'text-white scale-105 shadow-md'
                    : isNightMode
                      ? 'bg-white/10 text-white/80 hover:bg-white/20'
                      : 'bg-white/70 text-[#1a3a6a] hover:bg-white'
                  }`}
                style={{ backgroundColor: activeTab === tab.id ? tab.color : undefined }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content card */}
          <div className={`rounded-3xl p-6 md:p-10 shadow-xl leading-relaxed space-y-6 ${cardBg}`} style={{ color: textColor }}>

            {activeTab === 'projeto' && (
              <div className="space-y-6">
                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                  O que é o iNTEGRA-TE?
                </h2>
                <p>
                  O <strong style={{ color: headingColor }}>iNTEGRA-TE</strong> nasceu de uma preocupação real: crianças e jovens das comunidades do concelho de Loulé que, por razões sociais, económicas ou familiares, ficavam para trás no seu percurso escolar.
                </p>
                <p>
                  Em vez de esperar que as famílias viessem até às instituições, decidimos ir nós ter com elas. Com uma caravana pedagógica itinerante, levamos apoio, atividades e acompanhamento diretamente às escolas e comunidades — sem julgamentos, sem barreiras.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {[
                    { title: 'Educação', desc: 'Do infantário ao 4.º ciclo, com recursos adaptados a cada faixa etária.' },
                    { title: 'Inclusão', desc: 'Combate ativo à discriminação e ao isolamento social.' },
                    { title: 'Comunidade', desc: 'A ponte entre famílias, escolas e técnicos especializados.' },
                  ].map(item => (
                    <div key={item.title} className={`p-4 rounded-2xl text-center ${innerCardBg}`}>
                      <h4 className="font-['Fredoka',sans-serif] font-black text-base mb-1" style={{ color: headingColor }}>{item.title}</h4>
                      <p className="text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'caravana' && (
              <div className="space-y-6">
                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                  Como funciona a Caravana?
                </h2>
                <p>
                  A caravana é muito mais do que um veículo — é um espaço seguro, colorido e pensado para as crianças. Desloca-se pelas zonas do concelho onde o apoio é mais necessário, com uma equipa de técnicos prontos para acompanhar cada criança ao seu ritmo.
                </p>
                <p>
                  As sessões são práticas, lúdicas e adaptadas: desde atividades de literacia e numeracia até momentos de expressão criativa, desporto e bem-estar emocional. Cada visita é uma oportunidade para criar laços e construir confiança.
                </p>
                <div className={`border-l-4 border-[#e74c3c] p-4 rounded-r-xl text-sm ${isNightMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-[#7f1d1d]'}`}>
                  <strong>Gratuito para todas as famílias.</strong> Sem inscrições complicadas, sem custos — a caravana chega a quem precisa.
                </div>
                <p>
                  O contacto direto com as famílias permite também perceber necessidades que vão além da sala de aula: apoio psicossocial, orientação para serviços locais ou simplesmente alguém que ouve. A caravana é isso também.
                </p>
              </div>
            )}

            {activeTab === 'missao' && (
              <div className="space-y-6">
                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                  Porque é que este projeto existe?
                </h2>
                <p>
                  Acreditamos que nenhuma criança deve ser deixada para trás — independentemente do código postal, da língua que fala em casa ou do percurso da sua família. Esta é a convicção que move toda a equipa do iNTEGRA-TE todos os dias.
                </p>
                <p>
                  A nossa missão é simples de dizer, mas exige esforço diário: <strong style={{ color: headingColor }}>criar pontes entre escola, família e comunidade</strong>, para que cada criança tenha uma trajetória educativa mais estável, mais segura e mais cheia de oportunidades.
                </p>
                <div className={`p-4 rounded-2xl ${innerCardBg}`}>
                  <p className="text-sm italic leading-relaxed">
                    "O sucesso de uma criança não começa na sala de aula — começa muito antes, no ambiente onde ela cresce, nas pessoas que a rodeiam e na confiança que deposita no futuro."
                  </p>
                </div>
                <p className="text-sm">
                  Tens perguntas sobre o projeto ou queres envolver a tua escola ou comunidade?
                </p>
                <button
                  onClick={() => navigate('/contactar')}
                  className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-md transform active:scale-95"
                >
                  Fala Connosco
                </button>
              </div>
            )}

          </div>

          <p className="text-center text-xs mt-2" style={{ color: isNightMode ? '#64748b' : 'rgba(255,255,255,0.6)' }}>
            Projeto iNTEGRA-TE • Concelho de Loulé
          </p>

        </section>
      </motion.div>

      <Footer />
      <div className="mb-50"></div>
    </main>
  );
}
