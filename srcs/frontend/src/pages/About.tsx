import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';

export default function About() {
  return <AboutContent />;
}

function AboutContent() {
  const { isNightMode } = useNightMode();

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
        className={`pointer-events-none fixed bottom-[-29%] z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bottom_cloud2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <NightModeBackground dayImage='/src/assets/content2.webp' nightImage='/src/assets/noite.webp' />

      <div className="max-w-3xl w-full mx-auto flex flex-col mt-40 pb-10 relative z-10 px-1">

        {/* SECÇÃO PRINCIPAL UNIFICADA */}
        <section className={`w-full p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 ${sectionBg}`}>

          {/* Bloco do Título Principal */}
          <div className="text-center shrink-0">
            <h1
              className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl md:text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] inline-block tracking-wide text-white"
              style={!isNightMode ? { textShadow: '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb' } : {}}
            >
              Sobre o <span className="text-[#ffdf6d]">Projeto</span>
            </h1>
            <div className="mx-auto w-24 h-1.5 bg-[#ffdf6d] rounded-full mt-2 shadow-md shrink-0" />
          </div>

          {/* Parágrafos de Introdução */}
          <div className="font-semibold leading-relaxed space-y-3 text-center sm:text-left text-sm md:text-base text-white">
            <p>
              O projeto <strong className={`${isNightMode ? 'text-blue-400' : 'text-yellow-300'} font-black`}>iNTEGRA-TE</strong> nasceu da necessidade urgente de combater o absentismo escolar e a discriminação social vivida por crianças e jovens das comunidades do concelho de Loulé.
            </p>
            <p>
              A iniciativa propõe uma abordagem inovadora: uma <span className="font-black text-[#ef4444]">caravana itinerante</span> que funciona como espaço educativo, seguro e adaptado às necessidades das crianças — do infantário ao 4.º ciclo.
            </p>
            <p className="hidden md:block">
              O projeto cria pontes entre escola, família e comunidade, promovendo a inclusão, o sucesso educativo e a igualdade de oportunidades no território do Algarve.
            </p>
          </div>

          {/* Grid de Pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[
              { title: 'Educação', desc: 'Promoção do sucesso escolar com recursos adaptados.', tag: 'Do infantário ao 4.º ciclo' },
              { title: 'Inclusão', desc: 'Combate à discriminação e ao absentismo escolar.', tag: 'Zero exclusão' },
              { title: 'Comunidade', desc: 'Ligação entre as famílias, as escolas e os técnicos.', tag: 'Concelho de Loulé' },
            ].map((pilar) => (
              <div
                key={pilar.title}
                className={`flex flex-col items-center border p-5 text-center shadow-md ${cardBg}`}
              >
                <h3
                  className="font-['Fredoka',sans-serif] font-black text-xl mb-1.5"
                  style={{ color: isNightMode ? '#ffffff' : '#1e3a8a' }}
                >
                  {pilar.title}
                </h3>
                <p
                  className="text-xs md:text-sm leading-relaxed mb-4 flex-1"
                  style={{ color: isNightMode ? '#e2e8f0' : '#4a5a7a' }}
                >
                  {pilar.desc}
                </p>
                <span className={`inline-block text-[10px] font-black tracking-wider uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${cardTag}`}>
                  {pilar.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Secção de Estatísticas */}
          <div className={`border p-4 md:p-6 shadow-md transition-colors w-full shrink-0 ${cardBg}`}>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x"
              style={{ borderColor: isNightMode ? 'rgba(255,255,255,0.1)' : '#dbeafe' }}
            >
              {[
                { num: '70%', color: 'text-blue-500', label: 'Redução abandono' },
                { num: '4', color: 'text-red-500', label: 'Ciclos abrangidos' },
                { num: '100%', color: 'text-green-500', label: 'Gratuito p/ famílias' },
                { num: 'Loulé', color: 'text-purple-500', label: 'Impacto local' },
              ].map((stat) => (
                <div key={stat.label} className="pt-4 md:pt-0 md:pl-4 first:pt-0 first:pl-0 text-center flex flex-col items-center">
                  <div className={`font-['Fredoka',sans-serif] font-black text-2xl sm:text-3xl md:text-4xl ${stat.color}`}>{stat.num}</div>
                  <div
                    className="text-[10px] md:text-xs font-black uppercase tracking-tight"
                    style={{ color: isNightMode ? '#94a3b8' : '#64748b' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Objetivos Secundários */}
          <div className="grid md:grid-cols-2 gap-5 w-full shrink-0">
            <div className={`border p-5 shadow-lg flex flex-col gap-3 h-full ${cardBg}`}>
              <h2
                className="font-['Fredoka',sans-serif] font-black text-xl mb-1 text-center md:text-left"
                style={{ color: isNightMode ? '#ffdf6d' : '#1e3a8a' }}
              >
                Missão & Objetivos
              </h2>
              <div
                className="space-y-2 text-xs md:text-sm leading-relaxed"
                style={{ color: isNightMode ? '#ffffff' : '#4a5a7a' }}
              >
                <p>• Reduzir o absentismo escolar em 20% promovendo assiduidade e permanência.</p>
                <p>• Melhorar o desempenho escolar com métricas claras de acompanhamento.</p>
                <p>• Eliminar discriminação e exclusão social através de metodologias ativas e integradas.</p>
              </div>
            </div>

            <div className={`border p-5 shadow-lg h-full ${cardBg}`}>
              <h2
                className="font-['Fredoka',sans-serif] font-black text-xl mb-3 text-center md:text-left"
                style={{ color: isNightMode ? '#ffffff' : '#1e3a8a' }}
              >
                O que muda com o Projeto?
              </h2>
              <div
                className="space-y-1.5 text-xs md:text-sm font-medium leading-relaxed"
                style={{ color: isNightMode ? '#e2e8f0' : '#4a5a7a' }}
              >
                <p>• Trajetórias educativas mais estáveis e inclusivas para todos.</p>
                <p>• Reforço do envolvimento e confiança das famílias nas instituições educativas.</p>
                <p>• Criação de espaços de diálogo integrados entre escola e comunidade.</p>
              </div>
            </div>
          </div>

        </section>

      </div>

      <Footer />
      <div className="mb-50"></div>
    </main>
  );
}
