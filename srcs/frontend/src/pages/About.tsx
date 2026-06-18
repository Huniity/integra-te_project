export default function About() {
  return (
    <main
      className="relative overflow-hidden font-['Nunito',sans-serif] min-h-screen"
      style={{
        backgroundImage: 'url(./src/assets/jardim.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >

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
        @keyframes cloudDrift3 {
          0%   { transform: translateX(-160px); }
          100% { transform: translateX(110vw); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes peekIn {
          from { opacity: 0; transform: translateX(60px) rotate(8deg); }
          to   { opacity: 1; transform: translateX(0px) rotate(0deg); }
        }
        @keyframes drive {
          0%   { transform: translateX(-140px); }
          100% { transform: translateX(calc(100vw + 140px)); }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sunRays {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .cloud-1 { animation: cloudDrift1 32s linear infinite; }
        .cloud-2 { animation: cloudDrift2 48s linear infinite 14s; }
        .cloud-3 { animation: cloudDrift3 38s linear infinite 6s; }

        .animate-slideUp  { animation: slideUp 0.7s ease both; }
        .animate-fadeIn   { animation: fadeIn 0.6s ease both; }
        .animate-scaleIn  { animation: scaleIn 0.6s ease both; }
        .animate-peekIn   { animation: peekIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both; }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }

        .mascot-wrap { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .mascot-zone:hover .mascot-wrap {
          transform: translateX(14px) rotate(6deg);
        }

        .card-shine {
          position: relative;
          overflow: hidden;
        }
        .card-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.18) 50%,
            rgba(255,255,255,0) 100%
          );
          transform: skewX(-20deg);
          opacity: 0;
          transition: opacity 0.1s;
        }
        .card-shine:hover::after {
          opacity: 1;
          left: 125%;
          transition: left 0.55s ease, opacity 0.1s;
        }
      `}</style>

      {/* Fundo Decorativo */}
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 opacity-20">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{ animation: 'sunRays 40s linear infinite', transformOrigin: '80px 80px' }}>
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

        <div className="cloud-1 absolute top-16">
          <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="56" rx="90" ry="28" fill="white" fillOpacity="0.55"/>
            <ellipse cx="70"  cy="44" rx="44" ry="36" fill="white" fillOpacity="0.55"/>
            <ellipse cx="128" cy="46" rx="38" ry="30" fill="white" fillOpacity="0.55"/>
            <ellipse cx="100" cy="42" rx="30" ry="32" fill="white" fillOpacity="0.4"/>
          </svg>
        </div>

        <div className="cloud-2 absolute top-48">
          <svg width="130" height="52" viewBox="0 0 130 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="65"  cy="36" rx="58" ry="18" fill="white" fillOpacity="0.45"/>
            <ellipse cx="44"  cy="28" rx="28" ry="24" fill="white" fillOpacity="0.45"/>
            <ellipse cx="86"  cy="30" rx="26" ry="20" fill="white" fillOpacity="0.45"/>
          </svg>
        </div>

        <div className="cloud-3 absolute top-80">
          <svg width="170" height="66" viewBox="0 0 170 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="85"  cy="46" rx="76" ry="22" fill="white" fillOpacity="0.35"/>
            <ellipse cx="58"  cy="36" rx="36" ry="30" fill="white" fillOpacity="0.35"/>
            <ellipse cx="112" cy="38" rx="34" ry="26" fill="white" fillOpacity="0.35"/>
            <ellipse cx="85"  cy="34" rx="26" ry="28" fill="white" fillOpacity="0.28"/>
          </svg>
        </div>

        <div className="absolute bottom-1/3 left-8  w-40 h-40 rounded-full bg-[#3db8f5]/08 blur-2xl" />
        <div className="absolute top-1/2  right-12 w-56 h-56 rounded-full bg-[#9b59b6]/06 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-32 h-32 rounded-full bg-[#f9c74f]/08 blur-2xl" />
      </div>

      <section className="mascot-zone relative max-w-5xl mx-auto px-6 pt-16 pb-6 text-center">


        {/* IMPLEMENTAÇÃO DA IDEIA 3: Bi-Tom Estilo Marcador */}
        <h1 className="animate-slideUp delay-100 font-['Fredoka_One',cursive] text-5xl md:text-6xl leading-tight mb-8 text-[#0c447c] tracking-wide backdrop-blur-sm bg-white/40 inline-block px-4 py-2 rounded-3xl">
          Sobre o{' '}
          <span
            className="inline-block px-6 py-2 text-white bg-[#f76c6c] rounded-2xl transform -rotate-2 shadow-xl border-2 border-white"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            Projeto
          </span>
        </h1>

        <div className="animate-scaleIn delay-200 mx-auto w-28 h-1.5 bg-gradient-to-r from-[#3db8f5] via-[#9b59b6] to-[#f76c6c] rounded-full mb-8" />

        <div className="animate-fadeIn delay-300 max-w-2xl mx-auto space-y-4 text-[#1a3a6a] text-base md:text-[17px] leading-[1.85] bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/60">
          <p>
            O projeto{' '}
            <strong className="text-[#3a6bc8] font-extrabold">iNTEGRA-TE</strong>{' '}
            nasceu da necessidade urgente de combater o absentismo escolar e a
            discriminação social vivida por crianças e jovens das comunidades do
            concelho de Loulé.
          </p>
          <p>
            A iniciativa propõe uma abordagem inovadora: uma{' '}
            <span className="font-extrabold text-[#f76c6c]">caravana itinerante</span>{' '}
            que funciona como espaço educativo, seguro e adaptado às necessidades
            das crianças — do infantário ao 4.º ciclo.
          </p>
          <p>
            O projeto cria pontes entre escola, família e comunidade, promovendo
            a inclusão, o sucesso educativo e a igualdade de oportunidades no
            território do Algarve.
          </p>
        </div>
      </section>

      {/* Grid de Cards Pilares */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              color: '#3db8f5', gradFrom: '#3db8f5', gradTo: '#48cae4',
              bg: '#E6F1FB', delay: 'delay-200',
              shadowColor: 'rgba(61,184,245,0.3)',
              icon: (
                <svg className="w-10 h-10 group-hover:animate-bounce" viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="14" width="24" height="22" rx="4" fill="#3db8f5"/>
                  <path d="M14 14V10a6 6 0 0 1 12 0v4" stroke="#2da8e5" strokeWidth="2.5" strokeLinecap="round"/>
                  <rect x="15" y="20" width="10" height="6" rx="2" fill="white"/>
                  <line x1="20" y1="20" x2="20" y2="26" stroke="#3db8f5" strokeWidth="1.5"/>
                  <rect x="17" y="8" width="6" height="3" rx="1.5" fill="#c8e6ff"/>
                </svg>
              ),
              title: 'Educação',
              desc: 'Promoção do sucesso escolar com recursos pedagógicos adaptados a cada criança.',
              tag: 'Do infantário ao 4.º ciclo',
              tagBg: '#E6F1FB', tagColor: '#185FA5',
            },
            {
              color: '#f76c6c', gradFrom: '#f76c6c', gradTo: '#f9c74f',
              bg: '#FBEAF0', delay: 'delay-300',
              shadowColor: 'rgba(247,108,108,0.3)',
              icon: (
                <svg className="w-10 h-10 group-hover:animate-bounce" viewBox="0 0 40 40" fill="none">
                  <path d="M8 22c0-2 1.5-3.5 3.5-3.5S15 20 15 22v-8a2.5 2.5 0 0 1 5 0v6a2.5 2.5 0 0 1 5 0v2a2.5 2.5 0 0 1 5 0v6c0 4-3 6-7 6H14c-2 0-4-1-5-3l-3-5a2 2 0 0 1 3-2.5l1 1.5" stroke="#f76c6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="28" cy="10" r="5" fill="#f9c74f"/>
                  <path d="M26 10h4M28 8v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              title: 'Inclusão',
              desc: 'Igualdade de oportunidades, combatendo a discriminação e o absentismo escolar.',
              tag: 'Zero exclusão',
              tagBg: '#FBEAF0', tagColor: '#993556',
            },
            {
              color: '#8bc34a', gradFrom: '#8bc34a', gradTo: '#48cae4',
              bg: '#EAF3DE', delay: 'delay-400',
              shadowColor: 'rgba(139,195,74,0.3)',
              icon: (
                <svg className="w-10 h-10 group-hover:animate-bounce" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="13" fill="#48cae4"/>
                  <path d="M7 20h26M20 7c-1 3-1.5 8-1.5 13S19 29 20 33" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14c3 1 10 2 20 0M10 26c3-1 10-2 20 0" stroke="white" strokeWidth="1" opacity="0.7"/>
                  <circle cx="20" cy="20" r="13" stroke="#2da8e5" strokeWidth="1.5" fill="none"/>
                  <circle cx="14" cy="9" r="2.5" fill="#f9c74f"/>
                  <circle cx="26" cy="9" r="2.5" fill="#f76c6c"/>
                  <circle cx="20" cy="7" r="2.5" fill="#9b59b6"/>
                </svg>
              ),
              title: 'Comunidade',
              desc: 'Ligação entre famílias, escolas e técnicos no território do Algarve.',
              tag: 'Concelho de Loulé',
              tagBg: '#EAF3DE', tagColor: '#3B6D11',
            },
          ].map(({ color, gradFrom, gradTo, bg, delay, shadowColor, icon, title, desc, tag, tagBg, tagColor }) => (
            <div
              key={title}
              className={`group animate-slideUp ${delay} card-shine relative bg-white/90 backdrop-blur-sm border-2 border-white/70 rounded-3xl p-8 text-center cursor-default
                hover:-translate-y-3 transition-all duration-300 ease-out overflow-hidden`}
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 20px 60px ${shadowColor}`
                e.currentTarget.style.borderColor = color + '60'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                style={{ background: `linear-gradient(to right, ${gradFrom}, ${gradTo})` }}
              />

              <div
                className="relative mb-5 inline-flex items-center justify-center w-20 h-20 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: bg }}
              >
                {icon}
              </div>

              <h3 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c] mb-2">{title}</h3>
              <p className="text-sm text-[#4a5a7a] leading-relaxed">{desc}</p>

              <div
                className="mt-5 inline-block text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
                style={{ background: tagBg, color: tagColor }}
              >
                {tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Estatísticas */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="bg-white/85 backdrop-blur-sm border border-white/80 rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 4px 32px rgba(58,107,200,0.10)' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#dbeeff]">
            {[
              { num: '70%',   color: '#3db8f5', label: 'Redução do abandono',  icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
              { num: '4',      color: '#f76c6c', label: 'Ciclos abrangidos',     icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
              { num: '100%',  color: '#8bc34a', label: 'Gratuito p/ famílias',  icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 0 0 0 0-7.78z"/></svg> },
              { num: 'Loulé', color: '#9b59b6', label: 'Território de impacto', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
            ].map(({ num, color, label, icon }) => (
              <div key={label} className="py-6 px-4 text-center group hover:bg-white/50 transition-colors duration-200">
                <div className="flex justify-center mb-2 opacity-50 group-hover:opacity-80 transition-opacity" style={{ color }}>
                  {icon}
                </div>
                <div className="font-['Fredoka_One',cursive] text-3xl mb-1" style={{ color }}>{num}</div>
                <div className="text-[11px] font-bold text-[#8899bb] uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão Timeline */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="bg-white/85 backdrop-blur-sm border border-white/80 rounded-3xl p-8 md:p-12"
          style={{ boxShadow: '0 4px 32px rgba(58,107,200,0.08)' }}
        >
          <div className="text-center mb-10">
            <span className="inline-block bg-[#3a6bc8] text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4">
              Missão & Objetivos
            </span>
            <h2 className="font-['Fredoka_One',cursive] text-3xl text-[#0c447c]">
              O que queremos alcançar?
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3db8f5] via-[#9b59b6] to-[#8bc34a] md:left-1/2 md:-translate-x-px" />
            <div className="space-y-8">
              {[
                { color: '#3db8f5', bg: '#E6F1FB', side: 'right', num: 1, title: 'Reduzir o abandono',   desc: 'Diminuir o abandono escolar em 20% entre os grupos-alvo, promovendo assiduidade e permanência.' },
                { color: '#f76c6c', bg: '#FBEAF0', side: 'left',  num: 2, title: 'Melhorar o desempenho', desc: 'Melhorar o desempenho escolar de forma consistente com métricas claras de acompanhamento.' },
                { color: '#9b59b6', bg: '#EEEDFE', side: 'right', num: 3, title: 'Eliminar a exclusão',   desc: 'Eliminar situações de discriminação e exclusão social através de uma metodologia baseada em dados.' },
                { color: '#8bc34a', bg: '#EAF3DE', side: 'left',  num: 4, title: 'Plataforma digital',    desc: 'Criar uma plataforma com recursos, jogos e materiais de apoio, ancorada em boas práticas pedagógicas.' },
              ].map(({ color, bg, side, num, title, desc }) => (
                <div
                  key={title}
                  className={`relative flex items-start gap-4 pl-14 md:pl-0
                    ${side === 'left' ? 'md:flex-row-reverse md:pr-[calc(50%+28px)]' : 'md:pl-[calc(50%+28px)]'}`}
                >
                  <div
                    className="absolute left-3 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg z-10"
                    style={{ background: color }}
                  >
                    {num}
                  </div>
                  <div className="flex-1 rounded-2xl p-5 border transition-all duration-300 hover:shadow-md" style={{ background: bg, borderColor: color + '35' }}>
                    <h3 className="font-['Fredoka_One',cursive] text-base mb-1" style={{ color }}>{title}</h3>
                    <p className="text-sm text-[#4a5a7a] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secção Impacto Final */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="font-['Fredoka_One',cursive] text-3xl text-[#0c447c] backdrop-blur-sm bg-white/40 inline-block px-4 py-1 rounded-full">
            O que muda com o iNTEGRA-TE?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { color: '#3db8f5', title: 'Impacto social',     desc: 'Redução de desigualdades e promoção de igualdade de oportunidades. Ao diminuir o absentismo, reforça o envolvimento familiar e combate o insucesso escolar.' },
            { color: '#9b59b6', title: 'Impacto educacional', desc: 'Melhores resultados escolares, maior motivação e desenvolvimento de competências sociais através de espaços de diálogo entre famílias, escolas e comunidade.' },
            { color: '#8bc34a', title: 'Longo prazo',          desc: 'Trajetórias educativas mais estáveis e inclusivas, com base em soluções digitais testadas e validadas pelo projeto.' },
            { color: '#f76c6c', title: 'Plataforma digital',  desc: 'Ferramenta acessível com recursos, jogos e materiais pedagógicos, desenhada para qualquer família independentemente da literacia digital.' },
          ].map(({ color, title, desc }) => (
            <div
              key={title}
              className="group bg-white/90 backdrop-blur-sm border-l-4 border border-[#dbeeff] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-default"
              style={{ borderLeftColor: color }}
            >
              <h3 className="font-['Fredoka_One',cursive] text-lg mb-2" style={{ color }}>{title}</h3>
              <p className="text-sm text-[#4a5a7a] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
