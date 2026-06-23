import { useState } from 'react';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';

type TabId = 'geral' | 'dados' | 'direitos';

export default function Privacy() {
  return <PrivacyContent />;
}

function PrivacyContent() {
  const { isNightMode } = useNightMode();
  const [activeTab, setActiveTab] = useState<TabId>('geral');

  const sectionBg = isNightMode
    ? 'bg-slate-900/50 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.3)] border border-white/10'
    : 'bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30';

  const cardBg = isNightMode
    ? 'bg-slate-950/60 border border-white/10'
    : 'bg-white/85 border-2 border-white/60';

  const innerCardBg = isNightMode
    ? 'bg-white/5 border border-white/10'
    : 'bg-gray-50 border border-gray-100';

  const headingColor = isNightMode ? '#ffdf6d' : '#0c447c';
  const textColor = isNightMode ? '#e2e8f0' : '#4a5a7a';

  const tabs = [
    { id: 'geral',    label: '📄 Termos Gerais', color: '#3a6bc8' },
    { id: 'dados',    label: '🔒 Uso de Dados',  color: '#f76c6c' },
    { id: 'direitos', label: '🛡️ Teus Direitos', color: '#9b59b6' },
  ] as const;

  return (
    <main
      className="relative h-screen w-full px-3 md:px-6 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
       <img src="/src/assets/bottom_cloud.webp" alt="" aria-hidden="true"
            className={`pointer-events-none fixed bottom-[-29%] z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
        <img src="/src/assets/bottom_cloud2.webp" alt="" aria-hidden="true"
            className={`pointer-events-none fixed bottom-[-29%] z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />

      <NightModeBackground dayImage='/src/assets/bg_day.webp' nightImage='/src/assets/bg_night.webp' />

      <div className="max-w-3xl w-full mx-auto flex flex-col mt-40 pb-10 relative z-10 px-1">
        <section className={`w-full p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 ${sectionBg}`}>

          {/* Title */}
          <div className="text-center shrink-0">
            <h1
              className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl md:text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] inline-block tracking-wide text-white"
              style={!isNightMode ? { textShadow: '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb' } : {}}
            >
              Política de <span className="text-[#ffdf6d]">Privacidade</span>
            </h1>
            <div className="mx-auto w-24 h-1.5 bg-[#ffdf6d] rounded-full mt-2 shadow-md shrink-0" />
            <p className="mt-4 text-sm md:text-base font-semibold text-white/90 max-w-xl mx-auto leading-relaxed">
              No iNTEGRA-TE, a privacidade e a segurança dos dados das nossas crianças, famílias e escolas são a nossa maior prioridade.
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

            {activeTab === 'geral' && (
              <div className="space-y-6">
                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                  1. Compromisso de Confidencialidade
                </h2>
                <p>
                  Esta Política de Privacidade explica como o projeto iNTEGRA-TE recolhe, utiliza e protege as informações de todos os utilizadores que interagem com a nossa caravana itinerante e com a nossa plataforma digital no concelho de Loulé.
                </p>
                <p>
                  Garantimos que todas as interações pedagógicas, registos de assiduidade ou dados partilhados por encarregados de educação e técnicos parceiros são tratados no estrito cumprimento do <a href="/rgpd" className="font-bold hover:underline" style={{ color: isNightMode ? '#93c5fd' : '#3a6bc8' }}>RGPD (Regulamento Geral sobre a Proteção de Dados)</a>.
                </p>
                <div className={`border-l-4 border-[#3a6bc8] p-4 rounded-r-xl text-sm ${isNightMode ? 'bg-blue-900/30 text-blue-200' : 'bg-[#E6F1FB] text-[#1a3a6a]'}`}>
                  <strong>Nota Importante:</strong> O iNTEGRA-TE nunca irá vender, alugar ou partilhar quaisquer dados pessoais com terceiros para fins comerciais.
                </div>
              </div>
            )}

            {activeTab === 'dados' && (
              <div className="space-y-6">
                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                  2. Como Utilizamos as Informações
                </h2>
                <p>
                  Os dados recolhidos servem exclusivamente para monitorizar e combater o absentismo escolar e garantir o sucesso educativo dos alunos. Isto inclui:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Registo básico para acesso a jogos e materiais na plataforma digital.</li>
                  <li>Acompanhamento pedagógico e métricas de evolução nas atividades presenciais da caravana.</li>
                  <li>Comunicação direta e segura entre encarregados de educação, professores e técnicos do projeto.</li>
                </ul>
                <p>
                  Qualquer dado estatístico partilhado com entidades oficiais do Algarve para comprovar o impacto social do projeto será estritamente de caráter <strong>anónimo e agregado</strong>.
                </p>
                <div className={`border-l-4 border-[#f76c6c] p-4 rounded-r-xl text-sm ${isNightMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-[#7f1d1d]'}`}>
                  <strong>Segurança:</strong> Todos os dados são armazenados em servidores seguros e apenas acessíveis por pessoal autorizado do projeto.
                </div>
              </div>
            )}

            {activeTab === 'direitos' && (
              <div className="space-y-6">
                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                  3. Controlo e Direitos do Utilizador
                </h2>
                <p>
                  Como titular dos dados ou encarregado de educação da criança inscrita, deténs controlo total sobre as tuas informações. Podes exercer a qualquer momento os seguintes direitos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                  {[
                    { title: 'Acesso e Retificação', desc: 'Consultar as informações guardadas e corrigir qualquer dado desatualizado ou incorreto.' },
                    { title: 'Apagamento e Esquecimento', desc: 'Solicitar a remoção definitiva dos teus dados e do perfil do aluno do nosso sistema.' },
                    { title: 'Portabilidade', desc: 'Receber os teus dados num formato estruturado e de leitura automática.' },
                    { title: 'Oposição', desc: 'Opor-te ao tratamento dos teus dados para finalidades específicas, a qualquer momento.' },
                  ].map(item => (
                    <div key={item.title} className={`p-4 rounded-xl ${innerCardBg}`}>
                      <h4 className="font-bold mb-1" style={{ color: headingColor }}>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm pt-4 border-t border-dashed" style={{ borderColor: isNightMode ? 'rgba(255,255,255,0.15)' : '#e5e7eb' }}>
                  Para qualquer questão, pedido de remoção ou esclarecimento sobre a segurança dos teus dados, contacta a nossa equipa através do <a href="/contactar" className="font-bold hover:underline" style={{ color: isNightMode ? '#93c5fd' : '#3a6bc8' }}>formulário de contacto</a>. Para mais detalhes sobre o RGPD consulta a nossa <a href="/rgpd" className="font-bold hover:underline" style={{ color: isNightMode ? '#93c5fd' : '#3a6bc8' }}>página RGPD</a>.
                </p>
              </div>
            )}

          </div>

          <p className="text-center text-xs mt-2" style={{ color: isNightMode ? '#64748b' : 'rgba(255,255,255,0.6)' }}>
            Última atualização: Junho de 2026 • Projeto iNTEGRA-TE Loulé
          </p>

        </section>
      </div>

      <Footer />
      <div className="mb-50"></div>
    </main>
  );
}
