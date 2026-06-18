import { useState } from 'react';
import Footer from '../components/core/Footer';

export default function Privacy() {
  const [activeTab, setActiveTab] = useState<'geral' | 'dados' | 'direitos'>('geral');

  return (
    <main className="relative overflow-hidden bg-[#c8e8ff] font-['Nunito',sans-serif] min-h-screen">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&family=Fredoka+One&display=swap');

        @keyframes cloudDrift1 {
          0%   { transform: translateX(-220px); }
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

        .cloud-1 { animation: cloudDrift1 40s linear infinite; }
        .animate-slideUp { animation: slideUp 0.6s ease both; }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 opacity-15">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style={{ animation: 'sunRays 50s linear infinite', transformOrigin: '80px 80px' }}>
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

        <div className="cloud-1 absolute top-20">
          <svg width="180" height="70" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="56" rx="90" ry="28" fill="white" fillOpacity="0.45"/>
            <ellipse cx="70"  cy="44" rx="44" ry="36" fill="white" fillOpacity="0.45"/>
          </svg>
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center relative z-10">
        <div className="animate-slideUp inline-flex items-center gap-2 bg-[#8bc34a] text-white text-xs font-bold tracking-wider uppercase px-5 py-2 rounded-full mb-6 shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Segurança e Transparência
        </div>

        <h1
          className="animate-slideUp font-['Fredoka_One',cursive] text-4xl md:text-5xl leading-tight mb-4"
          style={{ color: '#0c447c', textShadow: '0 3px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(12,68,124,0.12)' }}
        >
          Política de Privacidade
        </h1>

        <p className="animate-slideUp text-[#1a3a6a] max-w-lg mx-auto text-base leading-relaxed">
          No iNTEGRA-TE, a privacidade e a segurança dos dados das nossas crianças, famílias e escolas são a nossa maior prioridade.
        </p>

        <div className="animate-slideUp mt-8 flex flex-wrap justify-center gap-2.5">
          {[
            { id: 'geral', label: '📄 Termos Gerais', color: '#3a6bc8' },
            { id: 'dados', label: '🔒 Uso de Dados', color: '#f76c6c' },
            { id: 'direitos', label: '🛡️ Teus Direitos', color: '#9b59b6' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 transform active:scale-95 shadow-sm
                ${activeTab === tab.id
                  ? 'text-white scale-105 shadow-md'
                  : 'bg-white/70 text-[#1a3a6a] hover:bg-white'
                }`}
              style={{ backgroundColor: activeTab === tab.id ? tab.color : undefined }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 md:p-10 border-2 border-white/60 shadow-xl text-[#4a5a7a] leading-relaxed space-y-6">

          {activeTab === 'geral' && (
            <div className="space-y-6 animate-slideUp">
              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c]">1. Compromisso de Confidencialidade</h2>
              <p>
                Esta Política de Privacidade explica como o projeto iNTEGRA-TE recolhe, utiliza e protege as informações de todos os utilizadores que interagem com a nossa caravana itinerante e com a nossa plataforma digital no concelho de Loulé.
              </p>
              <p>
                Garantimos que todas as interações pedagógicas, registos de assiduidade ou dados partilhados por encarregados de educação e técnicos parceiros são tratados no estrito cumprimento do RGPD (Regulamento Geral sobre a Proteção de Dados).
              </p>
              <div className="bg-[#E6F1FB] border-l-4 border-[#3a6bc8] p-4 rounded-r-xl text-sm text-[#1a3a6a]">
                <strong>Nota Importante:</strong> O iNTEGRA-TE nunca irá vender, alugar ou partilhar quaisquer dados pessoais com terceiros para fins comerciais.
              </div>
            </div>
          )}

          {activeTab === 'dados' && (
            <div className="space-y-6 animate-slideUp">
              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c]">2. Como Utilizamos as Informações</h2>
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
            </div>
          )}

          {activeTab === 'direitos' && (
            <div className="space-y-6 animate-slideUp">
              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c]">3. Controlo e Direitos do Utilizador</h2>
              <p>
                Como titular dos dados ou encarregado de educação da criança inscrita, deténs controlo total sobre as tuas informações. Podes exercer a qualquer momento os seguintes direitos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Acesso e Retificação</h4>
                  <p>Consultar as informações guardadas e corrigir qualquer dado desatualizado ou incorreto.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Apagamento e Esquecimento</h4>
                  <p>Solicitar a remoção definitiva dos teus dados e do perfil do aluno do nosso sistema.</p>
                </div>
              </div>
              <p className="text-sm pt-4 border-t border-dashed border-gray-200">
                Para qualquer questão, pedido de remoção ou esclarecimento sobre a segurança dos teus dados, contacta a nossa equipa de proteção de dados diretamente através do e-mail de suporte oficial do projeto.
              </p>
            </div>
          )}

        </div>

        <div className="mt-8 text-center text-xs text-[#6677aa]">
          Última atualização: Junho de 2026 • Projeto iNTEGRA-TE Loulé
        </div>
      </section>
      <Footer />
    </main>
  );
}
