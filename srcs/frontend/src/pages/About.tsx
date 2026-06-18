import { useNavigate } from 'react-router-dom';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';

export default function About() {
  return (
    <NightModeProvider>
      <AboutContent />
    </NightModeProvider>
  );
}

function AboutContent() {
  const { isNightMode } = useNightMode();
  const navigate = useNavigate();

  const sectionBg = isNightMode
    ? 'bg-slate-900/50 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.3)] border border-white/10 text-white'
    : 'bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30 text-white';

  const cardBg = isNightMode
    ? 'bg-slate-950/60 border-white/10 text-white'
    : 'bg-white/80 border-white/40 text-[#1e3a8a]';

  const cardTag = isNightMode
    ? 'bg-[#185FA5]/30 text-blue-300'
    : 'bg-blue-50/95 text-blue-800';

  return (
    <main
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed font-['Nunito',sans-serif] overflow-hidden"
      style={{ backgroundImage: 'url(./src/assets/content2.png)' }}
    >
      <NightModeBackground dayImage='./src/assets/content2.png' nightImage='./src/assets/noite.png' />

      {/* Fixed Header Zone with isolated blur */}
      <div className="absolute top-0 inset-x-0 h-20 pointer-events-none z-40 backdrop-blur-md"
           style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent)' }} />

      <div className={`absolute top-0 inset-x-0 z-40 px-3 md:px-6 py-3 ${isNightMode ? 'text-white' : 'text-white'}`}>
        <header className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end relative z-40">
            <div className="lg:hidden shrink-0">
              <NightModeToggle />
            </div>
          </div>
        </header>
      </div>

      <div className="hidden lg:block absolute top-[14%] right-[14%] z-50">
        <NightModeToggle />
      </div>

      {/* Fullscreen scroll container passing completely behind header and footer */}
      <div
        className="absolute inset-0 w-full h-full z-10 overflow-y-auto px-3 md:px-6"
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

        {/* Inner wrapper padding keeps elements fully visible when at the extremes */}
        <div className="max-w-4xl w-full mx-auto flex flex-col gap-5 md:gap-8 pt-24 pb-36">

          <section className="text-center shrink-0">
            <h1
              className="font-['Fredoka',sans-serif] text-3xl md:text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] inline-block tracking-wide text-white"
              style={!isNightMode ? { textShadow: '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb' } : {}}
            >
              Sobre o <span className="text-[#ffdf6d]">Projeto</span>
            </h1>
            <div className="mx-auto w-24 h-1.5 bg-[#ffdf6d] rounded-full mt-2 shadow-md shrink-0" />
          </section>

          <section className={`w-full flex flex-col gap-6 p-5 sm:p-7 shadow-lg ${sectionBg}`}>
            <div className="font-semibold leading-relaxed space-y-3 text-center sm:text-left text-sm md:text-base">
              <p>
                O projeto <strong className={`${isNightMode ? 'text-blue-400' : 'text-yellow-300'} font-black`}>iNTEGRA-TE</strong> nasceu da necessidade urgente de combater o absentismo escolar e a discriminação social vivida por crianças e jovens das comunidades do concelho de Loulé.
              </p>
              <p>
                A initiative propõe uma abordagem inovadora: uma <span className="font-black text-[#ef4444]">caravana itinerante</span> que funciona como espaço educativo, seguro e adaptado às necessidades das crianças — do infantário ao 4.º ciclo.
              </p>
              <p className="hidden md:block">
                O projeto cria pontes entre escola, família e comunidade, promovendo a inclusão, o sucesso educativo e a igualdade de oportunidades no território do Algarve.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Educação', desc: 'Promoção do sucesso escolar com recursos adaptados.', tag: 'Do infantário ao 4.º ciclo' },
                { title: 'Inclusão', desc: 'Combate à discriminação e ao absentismo escolar.', tag: 'Zero exclusão' },
                { title: 'Comunidade', desc: 'Ligação entre as famílias, as escolas e os técnicos.', tag: 'Concelho de Loulé' },
              ].map((pilar) => (
                <div
                  key={pilar.title}
                  className={`flex flex-col items-center border rounded-2xl p-5 text-center shadow-md ${cardBg}`}
                >
                  <h3 className="font-['Fredoka',sans-serif] font-black text-xl mb-1.5 text-[#1e3a8a]">{pilar.title}</h3>
                  <p className={`text-xs md:text-sm leading-relaxed mb-4 flex-1 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>{pilar.desc}</p>
                  <span className={`inline-block text-[10px] md:text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-full ${cardTag}`}>
                    {pilar.tag}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className={`border rounded-2xl p-4 md:p-6 shadow-md transition-colors w-full shrink-0 ${cardBg}`}>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x ${isNightMode ? 'divide-white/10' : 'divide-blue-100'}`}>
              {[
                { num: '70%', color: 'text-blue-500', label: 'Redução abandono' },
                { num: '4', color: 'text-red-500', label: 'Ciclos abrangidos' },
                { num: '100%', color: 'text-green-500', label: 'Gratuito p/ famílias' },
                { num: 'Loulé', color: 'text-purple-500', label: 'Impacto local' },
              ].map((stat) => (
                <div key={stat.label} className="pt-4 md:pt-0 md:pl-4 first:pt-0 first:pl-0 text-center flex flex-col items-center">
                  <div className={`font-['Fredoka',sans-serif] font-black text-3xl md:text-4xl ${stat.color}`}>{stat.num}</div>
                  <div className={`text-[10px] md:text-xs font-black uppercase tracking-tight ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-5 w-full mb-4 shrink-0">
            <div className={`p-5 shadow-lg flex flex-col gap-3 h-full ${sectionBg}`}>
              <h2 className="font-['Fredoka',sans-serif] font-black text-xl mb-1 text-center md:text-left text-[#ffdf6d]">Missão & Objetivos</h2>
              <div className="space-y-2 text-xs md:text-sm leading-relaxed text-white">
                <p>• Reduzir o absentismo escolar em 20% promovendo assiduidade e permanência.</p>
                <p>• Melhorar o desempenho escolar com métricas claras de acompanhamento.</p>
                <p>• Eliminar discriminação e exclusão social através de metodologias ativas e integradas.</p>
              </div>
            </div>

            <div className={`border p-5 rounded-3xl shadow-lg h-full ${cardBg}`}>
              <h2 className="font-['Fredoka',sans-serif] font-black text-xl mb-3 text-center md:text-left text-[#1e3a8a]">O que muda com o Projeto?</h2>
              <div className={`space-y-1.5 text-xs md:text-sm font-medium leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>• Trajetórias educativas mais estáveis e inclusivas para todos.</p>
                <p>• Reforço do envolvimento e confiança das famílias nas instituições educativas.</p>
                <p>• Criação de espaços de diálogo integrados entre escola e comunidade.</p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* 1. Independent Blur Layer Behind the Footer (Does not affect footer elements) */}
      <div
        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none z-30 backdrop-blur-md"
        style={{
          maskImage: 'linear-gradient(to top, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent)'
        }}
      />

      {/* 2. Crisp, Solid Footer Container directly over the blur layer */}
      <div className={`absolute bottom-0 inset-x-0 z-40 w-full pt-4 pb-2 ${isNightMode ? 'bg-slate-950/20' : 'bg-transparent'}`}>
        <Footer />
      </div>
    </main>
  );
}
