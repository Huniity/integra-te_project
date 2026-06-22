import { useState } from 'react';
import Footer from '../components/core/Footer';

type TabId = 'geral' | 'dados' | 'voz' | 'direitos';

export default function Rgpd() {
  const [activeTab, setActiveTab] = useState<TabId>('geral');

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

        .cloud-1 { animation: cloudDrift1 40s linear infinite; }
        .cloud-2 { animation: cloudDrift2 52s linear infinite 8s; }
        .animate-slideUp { animation: slideUp 0.6s ease both; }
      `}</style>

      {/* Decorative sky background */}
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

        <div className="cloud-2 absolute top-64">
          <svg width="140" height="56" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="56" rx="90" ry="28" fill="white" fillOpacity="0.35"/>
            <ellipse cx="128" cy="44" rx="44" ry="32" fill="white" fillOpacity="0.35"/>
          </svg>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-6 text-center relative z-10">
        <div className="animate-slideUp inline-flex items-center gap-2 bg-[#8bc34a] text-white text-xs font-bold tracking-wider uppercase px-5 py-2 rounded-full mb-6 shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Transparência e Direitos
        </div>

        <h1
          className="animate-slideUp font-['Fredoka_One',cursive] text-4xl md:text-5xl leading-tight mb-4"
          style={{ color: '#0c447c', textShadow: '0 3px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(12,68,124,0.12)' }}
        >
          RGPD — Os teus direitos
        </h1>

        <p className="animate-slideUp text-[#1a3a6a] max-w-xl mx-auto text-base leading-relaxed">
          Informação sobre o tratamento de dados pessoais nesta plataforma, em cumprimento do <strong>Regulamento Geral sobre a Proteção de Dados</strong> (Regulamento (UE) 2016/679) e da Lei n.º 58/2019.
        </p>

        <div className="animate-slideUp mt-8 flex flex-wrap justify-center gap-2.5">
          {[
            { id: 'geral',    label: '📄 Visão Geral',     color: '#3a6bc8' },
            { id: 'dados',    label: '🔐 Dados Tratados',  color: '#f76c6c' },
            { id: 'voz',      label: '🎤 Pesquisa por Voz', color: '#9b59b6' },
            { id: 'direitos', label: '🛡️ Os Teus Direitos', color: '#8bc34a' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
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

      {/* Content card */}
      <section className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 md:p-10 border-2 border-white/60 shadow-xl text-[#4a5a7a] leading-relaxed space-y-6">

          {/* ─── Tab 1 — Visão Geral ─────────────────────────────────────── */}
          {activeTab === 'geral' && (
            <div className="space-y-6 animate-slideUp">
              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c]">
                1. Quem somos e o que faz este aviso
              </h2>
              <p>
                O <strong>iNTEGRA-TE</strong> é uma plataforma educativa desenvolvida no âmbito do projeto da Fundação António Aleixo, cofinanciada pelo Portugal 2030 e pela União Europeia, em parceria com o Concelho de Loulé.
              </p>
              <p>
                Este aviso explica, de forma clara e nos termos do artigo 13.º do RGPD, que dados pessoais são tratados quando utilizas esta plataforma, com que finalidade, durante quanto tempo, e quais os direitos que te assistem.
              </p>

              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c] pt-4">
                2. Responsável pelo tratamento
              </h2>
              <p>
                O responsável pelo tratamento dos dados pessoais é a <strong>Fundação António Aleixo</strong>. Para qualquer questão relativa à proteção de dados — incluindo o exercício dos teus direitos ou eventuais reclamações — podes contactar-nos através do <a href="/contactar" className="text-[#3a6bc8] font-bold hover:underline">formulário de contacto</a>.
              </p>

              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c] pt-4">
                3. Princípios gerais
              </h2>
              <p>
                Esta plataforma foi desenhada com a privacidade como princípio. Em concreto:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Não existe registo de utilizador</strong> nem qualquer conta pessoal. A consulta de conteúdos é totalmente anónima.</li>
                <li><strong>Não utilizamos cookies de rastreio</strong>, ferramentas de análise comportamental, redes publicitárias, nem partilhamos dados com terceiros para fins comerciais.</li>
                <li><strong>Não é necessário consentimento</strong> para navegar e consultar conteúdos. O consentimento explícito é pedido apenas para a função de pesquisa por voz (ver secção dedicada).</li>
                <li>Os dados que recebemos limitam-se ao estritamente necessário para que a plataforma funcione.</li>
              </ul>

              <div className="bg-[#E6F1FB] border-l-4 border-[#3a6bc8] p-4 rounded-r-xl text-sm text-[#1a3a6a]">
                <strong>Nota Importante:</strong> O iNTEGRA-TE nunca vende, aluga, nem partilha dados pessoais com terceiros para fins comerciais.
              </div>
            </div>
          )}

          {/* ─── Tab 2 — Dados Tratados ─────────────────────────────────── */}
          {activeTab === 'dados' && (
            <div className="space-y-6 animate-slideUp">
              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c]">
                4. Que dados tratamos
              </h2>
              <p>
                Apenas tratamos dados pessoais em três contextos delimitados:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-['Fredoka_One',cursive] text-base text-[#0c447c] mb-2">
                    4.1 Formulário de contacto
                  </h4>
                  <p className="text-sm">
                    Quando preenches o formulário em <a href="/contactar" className="text-[#3a6bc8] font-bold hover:underline">/contactar</a>, recolhemos o teu <strong>nome</strong>, <strong>endereço de email</strong> e <strong>mensagem</strong>.
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Finalidade:</strong> responder à tua mensagem.<br/>
                    <strong>Base legal:</strong> consentimento explícito (artigo 6.º n.º 1 alínea a) do RGPD), confirmado pela caixa de aceitação no formulário.<br/>
                    <strong>Encaminhamento:</strong> a mensagem é entregue por correio eletrónico através do serviço <em>Web3Forms</em>, que atua como subcontratante. <strong>Não armazenamos os dados do formulário na base de dados da plataforma.</strong><br/>
                    <strong>Conservação:</strong> a mensagem é conservada apenas na caixa de correio da equipa pelo tempo necessário ao tratamento do pedido.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-['Fredoka_One',cursive] text-base text-[#0c447c] mb-2">
                    4.2 Pesquisa por voz
                  </h4>
                  <p className="text-sm">
                    Quando ativas a pesquisa por voz, é gravado um pequeno ficheiro de áudio com a tua pergunta. Este tratamento tem regras próprias e está descrito em detalhe na secção <button onClick={() => setActiveTab('voz')} className="text-[#9b59b6] font-bold hover:underline">🎤 Pesquisa por Voz</button>.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-['Fredoka_One',cursive] text-base text-[#0c447c] mb-2">
                    4.3 Registos técnicos de acesso
                  </h4>
                  <p className="text-sm">
                    Como qualquer servidor web, o nosso regista de forma agregada o endereço IP, o tipo de navegador, o caminho pedido e o instante do pedido. Estes registos servem apenas para <strong>segurança operacional</strong> e <strong>diagnóstico de erros</strong>, com base no interesse legítimo (artigo 6.º n.º 1 alínea f)).
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Conservação:</strong> os registos são mantidos por um período máximo de 30 dias, após o qual são apagados.
                  </p>
                </div>
              </div>

              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c] pt-4">
                5. O que <em>não</em> fazemos
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Não utilizamos cookies de marketing, publicidade ou perfis comportamentais.</li>
                <li>Não usamos ferramentas de análise como Google Analytics, Meta Pixel, Hotjar ou semelhantes.</li>
                <li>Não realizamos decisões automatizadas, incluindo definição de perfis (artigo 22.º).</li>
                <li>Não transferimos dados pessoais para fora do Espaço Económico Europeu.</li>
              </ul>
            </div>
          )}

          {/* ─── Tab 3 — Pesquisa por Voz ───────────────────────────────── */}
          {activeTab === 'voz' && (
            <div className="space-y-6 animate-slideUp">
              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c]">
                6. Pesquisa por voz — como funciona
              </h2>
              <p>
                A barra de pesquisa permite-te falar em vez de escrever. Esta funcionalidade trata <strong>uma única coisa</strong> — o áudio com a tua pergunta — e segue regras rigorosas que descrevemos aqui em detalhe, porque a voz é um dado pessoal e merece a clareza máxima.
              </p>

              <div className="bg-[#F3E8FB] border-l-4 border-[#9b59b6] p-4 rounded-r-xl text-sm text-[#1a3a6a]">
                <strong>Em resumo:</strong> o áudio é usado apenas para ser convertido em texto, é guardado <em>temporariamente</em> num ficheiro descartável no servidor durante o tempo necessário à transcrição, e é <strong>imediatamente apagado</strong> assim que a transcrição termina. <strong>Nenhum áudio é guardado em base de dados, nunca.</strong>
              </div>

              <h2 className="font-['Fredoka_One',cursive] text-lg text-[#0c447c] pt-2">
                6.1 Quando é que o microfone é ativado
              </h2>
              <p className="text-sm">
                A gravação <strong>só começa</strong> quando carregas explicitamente no ícone do microfone na barra de pesquisa. A primeira vez que o fizeres, o navegador vai pedir a tua autorização para aceder ao microfone — esse pedido vem do próprio navegador, não desta plataforma, e é registado pelo navegador em consentimento explícito (artigo 6.º n.º 1 alínea a)). Podes recusar e continuar a usar a plataforma normalmente; basta usares a pesquisa por texto.
              </p>
              <p className="text-sm">
                A gravação <strong>termina</strong> assim que voltas a carregar no ícone, ou automaticamente quando deixas de falar. Em momento algum o microfone fica ativo sem a tua ação direta.
              </p>

              <h2 className="font-['Fredoka_One',cursive] text-lg text-[#0c447c] pt-2">
                6.2 O que acontece ao áudio gravado
              </h2>
              <p className="text-sm">
                A cadeia técnica é a seguinte, do início ao fim:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>O áudio é capturado pelo teu navegador num formato de áudio comprimido e enviado para o nosso servidor através de uma ligação cifrada (HTTPS).</li>
                <li>No servidor, o ficheiro é guardado num <strong>ficheiro temporário descartável,</strong> <em>nunca</em> numa base de dados nem numa pasta permanente de ficheiros.</li>
                <li>Esse ficheiro temporário é entregue ao modelo de transcrição <strong>Whisper</strong>, que corre no <strong>nosso próprio servidor</strong> — o áudio <strong>não</strong> é enviado para a OpenAI, Google, Microsoft, Amazon nem qualquer outro fornecedor externo.</li>
                <li>O Whisper produz o texto da tua pergunta.</li>
                <li><strong>O ficheiro temporário é imediatamente apagado</strong> — isto garante que o áudio é apagado mesmo que ocorra um erro durante a transcrição.</li>
                <li>O servidor devolve <strong>apenas o texto transcrito</strong> ao teu navegador, que o usa para te redirecionar para os resultados de pesquisa.</li>
              </ol>

              <h2 className="font-['Fredoka_One',cursive] text-lg text-[#0c447c] pt-2">
                6.3 Conservação
              </h2>
              <p className="text-sm">
                A duração da existência do ficheiro de áudio no servidor é de <strong>poucos segundos</strong> — o tempo estrito da transcrição. Não existe qualquer cópia de segurança, qualquer registo de auditoria, qualquer entrada em base de dados, qualquer ficheiro de <em>log</em> que contenha o áudio. <strong>O conteúdo da tua voz não persiste no sistema após a tua pergunta ser respondida.</strong>
              </p>

              <h2 className="font-['Fredoka_One',cursive] text-lg text-[#0c447c] pt-2">
                6.4 Texto transcrito
              </h2>
              <p className="text-sm">
                O texto resultante da transcrição é usado uma única vez, no momento, para encaminhar a pesquisa. Não fica associado a nenhuma identidade, não fica registado em base de dados, e não é partilhado com terceiros.
              </p>

              <h2 className="font-['Fredoka_One',cursive] text-lg text-[#0c447c] pt-2">
                6.5 Como revogar
              </h2>
              <p className="text-sm">
                Como o consentimento é dado ao próprio navegador, retira-se também através dele:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Chrome / Edge:</strong> ícone do cadeado na barra de endereço → Definições do site → Microfone → Bloquear.</li>
                <li><strong>Firefox:</strong> ícone do cadeado → Permissões → Microfone → Limpar.</li>
                <li><strong>Safari:</strong> menu Safari → Definições → Sítios Web → Microfone → Negar.</li>
              </ul>
              <p className="text-sm">
                Depois de revogar, a pesquisa por voz deixa de funcionar; a pesquisa por texto continua disponível.
              </p>
            </div>
          )}

          {/* ─── Tab 4 — Os Teus Direitos ───────────────────────────────── */}
          {activeTab === 'direitos' && (
            <div className="space-y-6 animate-slideUp">
              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c]">
                7. Os teus direitos enquanto titular dos dados
              </h2>
              <p>
                O RGPD reconhece-te um conjunto de direitos que podes exercer em qualquer momento, gratuitamente. Como esta plataforma não conserva conta de utilizador, a maior parte destes direitos aplica-se apenas a dados que nos tenhas enviado (por exemplo, uma mensagem do formulário de contacto).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Direito de acesso (art. 15.º)</h4>
                  <p>Confirmar se tratamos dados teus e obter cópia desses dados.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Direito de retificação (art. 16.º)</h4>
                  <p>Corrigir dados pessoais inexatos ou incompletos.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Direito ao apagamento (art. 17.º)</h4>
                  <p>Solicitar a eliminação dos teus dados — o chamado «direito a ser esquecido».</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Direito à limitação (art. 18.º)</h4>
                  <p>Pedir que o tratamento dos teus dados seja suspenso em circunstâncias específicas.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Direito à portabilidade (art. 20.º)</h4>
                  <p>Receber os teus dados num formato estruturado e legível por máquina.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Direito de oposição (art. 21.º)</h4>
                  <p>Opor-se ao tratamento dos teus dados com base em interesse legítimo.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Retirar consentimento</h4>
                  <p>Quando o tratamento se baseou no teu consentimento, podes retirá-lo a qualquer momento sem afetar a licitude do tratamento prévio.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0c447c] mb-1">Decisões automatizadas (art. 22.º)</h4>
                  <p>Esta plataforma <strong>não toma</strong> decisões automatizadas com efeitos jurídicos sobre ti.</p>
                </div>
              </div>

              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c] pt-4">
                8. Como exercer os teus direitos
              </h2>
              <p className="text-sm">
                Para exercer qualquer destes direitos, envia-nos um pedido através do <a href="/contactar" className="text-[#3a6bc8] font-bold hover:underline">formulário de contacto</a>, identificando claramente qual o direito que pretendes exercer. Responderemos no prazo máximo de 30 dias, nos termos do artigo 12.º n.º 3 do RGPD.
              </p>

              <h2 className="font-['Fredoka_One',cursive] text-xl text-[#0c447c] pt-4">
                9. Reclamação à autoridade de controlo
              </h2>
              <p className="text-sm">
                Se considerares que o tratamento dos teus dados viola a legislação aplicável, tens o direito de apresentar reclamação à autoridade de controlo nacional, a <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong>:
              </p>
              <p className="text-sm pl-4 border-l-2 border-[#dbeeff]">
                Av. D. Carlos I, 134, 1.º — 1200-651 Lisboa<br/>
                Telefone: +351 213 928 400<br/>
                Web: <a href="https://www.cnpd.pt/" target="_blank" rel="noopener noreferrer" className="text-[#3a6bc8] font-bold hover:underline">www.cnpd.pt</a>
              </p>
            </div>
          )}

        </div>

        <div className="animate-slideUp mt-8 flex flex-wrap justify-center gap-2.5">
          {[
            { id: 'geral',    label: '📄 Visão Geral',     color: '#3a6bc8' },
            { id: 'dados',    label: '🔐 Dados Tratados',  color: '#f76c6c' },
            { id: 'voz',      label: '🎤 Pesquisa por Voz', color: '#9b59b6' },
            { id: 'direitos', label: '🛡️ Os Teus Direitos', color: '#8bc34a' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
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

        <div className="mt-8 text-center text-xs text-[#6677aa]">
          Última atualização: Junho de 2026 • Projeto iNTEGRA-TE Loulé
        </div>
      </section>

      <Footer />
    </main>
  );
}