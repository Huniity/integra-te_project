import { useState } from 'react';
import { motion } from 'framer-motion';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';

type TabId = 'geral' | 'dados' | 'voz' | 'direitos';

export default function Rgpd() {
    return <RgpdContent />;
}

function RgpdContent() {
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
    const linkColor = isNightMode ? '#93c5fd' : '#3a6bc8';

    const tabs = [
        { id: 'geral', label: 'Visão Geral', color: '#3a6bc8' },
        { id: 'dados', label: 'Dados Tratados', color: '#f76c6c' },
        { id: 'voz', label: 'Pesquisa por Voz', color: '#9b59b6' },
        { id: 'direitos', label: 'Os Teus Direitos', color: '#8bc34a' },
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

            <motion.div
              className="max-w-3xl w-full mx-auto flex flex-col mt-40 pb-40 relative z-10 px-1"
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
                            RGPD — <span className="text-[#ffdf6d]">Os teus direitos</span>
                        </h1>
                        <div className="mx-auto w-24 h-1.5 bg-[#ffdf6d] rounded-full mt-2 shadow-md shrink-0" />
                        <p className="mt-4 text-sm md:text-base font-semibold text-white/90 max-w-xl mx-auto leading-relaxed">
                            Informação sobre o tratamento de dados pessoais nesta plataforma, em cumprimento do <strong>Regulamento Geral sobre a Proteção de Dados</strong> (Regulamento (UE) 2016/679) e da Lei n.º 58/2019.
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

                        {/* ─── Tab 1 — Visão Geral ─────────────────────────────────────── */}
                        {activeTab === 'geral' && (
                            <div className="space-y-6">
                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl pt-0" style={{ color: headingColor }}>
                                    1. Quem somos e o que faz este aviso
                                </h2>
                                <p>
                                    O <strong>iNTEGRA-TE</strong> é uma plataforma educativa desenvolvida no âmbito do projeto da Fundação António Aleixo, cofinanciada pelo Portugal 2030 e pela União Europeia, em parceria com o Concelho de Loulé.
                                </p>
                                <p>
                                    Este aviso explica, de forma clara e nos termos do artigo 13.º do RGPD, que dados pessoais são tratados quando utilizas esta plataforma, com que finalidade, durante quanto tempo, e quais os direitos que te assistem.
                                </p>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl pt-4" style={{ color: headingColor }}>
                                    2. Responsável pelo tratamento
                                </h2>
                                <p>
                                    O responsável pelo tratamento dos dados pessoais é a <strong>Fundação António Aleixo</strong>. Para qualquer questão relativa à proteção de dados — incluindo o exercício dos teus direitos ou eventuais reclamações — podes contactar-nos através do <a href="/contactar" className="font-bold hover:underline" style={{ color: linkColor }}>formulário de contacto</a>.
                                </p>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl pt-4" style={{ color: headingColor }}>
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

                                <div className={`border-l-4 border-[#3a6bc8] p-4 rounded-r-xl text-sm ${isNightMode ? 'bg-blue-900/30 text-blue-200' : 'bg-[#E6F1FB] text-[#1a3a6a]'}`}>
                                    <strong>Nota Importante:</strong> O iNTEGRA-TE nunca vende, aluga, nem partilha dados pessoais com terceiros para fins comerciais.
                                </div>
                            </div>
                        )}

                        {/* ─── Tab 2 — Dados Tratados ─────────────────────────────────── */}
                        {activeTab === 'dados' && (
                            <div className="space-y-6">
                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                                    4. Que dados tratamos
                                </h2>
                                <p>
                                    Apenas tratamos dados pessoais em três contextos delimitados:
                                </p>

                                <div className="space-y-4">
                                    <div className={`p-4 rounded-xl ${innerCardBg}`}>
                                        <h4 className="font-['Fredoka',sans-serif] font-bold text-base mb-2" style={{ color: headingColor }}>
                                            4.1 Formulário de contacto
                                        </h4>
                                        <p className="text-sm">
                                            Quando preenches o formulário em <a href="/contactar" className="font-bold hover:underline" style={{ color: linkColor }}>/contactar</a>, recolhemos o teu <strong>nome</strong>, <strong>endereço de email</strong> e <strong>mensagem</strong>.
                                        </p>
                                        <p className="text-sm mt-2">
                                            <strong>Finalidade:</strong> responder à tua mensagem.<br />
                                            <strong>Base legal:</strong> consentimento explícito (artigo 6.º n.º 1 alínea a) do RGPD), confirmado pela caixa de aceitação no formulário.<br />
                                            <strong>Encaminhamento:</strong> a mensagem é entregue por correio eletrónico através do serviço <em>Web3Forms</em>, que atua como subcontratante. <strong>Não armazenamos os dados do formulário na base de dados da plataforma.</strong><br />
                                            <strong>Conservação:</strong> a mensagem é conservada apenas na caixa de correio da equipa pelo tempo necessário ao tratamento do pedido.
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-xl ${innerCardBg}`}>
                                        <h4 className="font-['Fredoka',sans-serif] font-bold text-base mb-2" style={{ color: headingColor }}>
                                            4.2 Pesquisa por voz
                                        </h4>
                                        <p className="text-sm">
                                            Quando ativas a pesquisa por voz, é gravado um pequeno ficheiro de áudio com a tua pergunta. Este tratamento tem regras próprias e está descrito em detalhe na secção <button onClick={() => setActiveTab('voz')} className="font-bold hover:underline" style={{ color: '#9b59b6' }}>🎤 Pesquisa por Voz</button>.
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-xl ${innerCardBg}`}>
                                        <h4 className="font-['Fredoka',sans-serif] font-bold text-base mb-2" style={{ color: headingColor }}>
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

                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl pt-4" style={{ color: headingColor }}>
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
                            <div className="space-y-6">
                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                                    6. Pesquisa por voz — como funciona
                                </h2>
                                <p>
                                    A barra de pesquisa permite-te falar em vez de escrever. Esta funcionalidade trata <strong>uma única coisa</strong> — o áudio com a tua pergunta — e segue regras rigorosas que descrevemos aqui em detalhe, porque a voz é um dado pessoal e merece a clareza máxima.
                                </p>

                                <div className={`border-l-4 border-[#9b59b6] p-4 rounded-r-xl text-sm ${isNightMode ? 'bg-purple-900/30 text-purple-200' : 'bg-[#F3E8FB] text-[#1a3a6a]'}`}>
                                    <strong>Em resumo:</strong> o áudio é usado apenas para ser convertido em texto, é guardado <em>temporariamente</em> num ficheiro descartável no servidor durante o tempo necessário à transcrição, e é <strong>imediatamente apagado</strong> assim que a transcrição termina. <strong>Nenhum áudio é guardado em base de dados, nunca.</strong>
                                </div>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-lg pt-2" style={{ color: headingColor }}>
                                    6.1 Quando é que o microfone é ativado
                                </h2>
                                <p className="text-sm">
                                    A gravação <strong>só começa</strong> quando carregas explicitamente no ícone do microfone na barra de pesquisa. A primeira vez que o fizeres, o navegador vai pedir a tua autorização para aceder ao microfone — esse pedido vem do próprio navegador, não desta plataforma, e é registado pelo navegador em consentimento explícito (artigo 6.º n.º 1 alínea a)). Podes recusar e continuar a usar a plataforma normalmente; basta usares a pesquisa por texto.
                                </p>
                                <p className="text-sm">
                                    A gravação <strong>termina</strong> assim que voltas a carregar no ícone, ou automaticamente quando deixas de falar. Em momento algum o microfone fica ativo sem a tua ação direta.
                                </p>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-lg pt-2" style={{ color: headingColor }}>
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

                                <h2 className="font-['Fredoka',sans-serif] font-black text-lg pt-2" style={{ color: headingColor }}>
                                    6.3 Conservação
                                </h2>
                                <p className="text-sm">
                                    A duração da existência do ficheiro de áudio no servidor é de <strong>poucos segundos</strong> — o tempo estrito da transcrição. Não existe qualquer cópia de segurança, qualquer registo de auditoria, qualquer entrada em base de dados, qualquer ficheiro de <em>log</em> que contenha o áudio. <strong>O conteúdo da tua voz não persiste no sistema após a tua pergunta ser respondida.</strong>
                                </p>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-lg pt-2" style={{ color: headingColor }}>
                                    6.4 Texto transcrito
                                </h2>
                                <p className="text-sm">
                                    O texto resultante da transcrição é usado uma única vez, no momento, para encaminhar a pesquisa. Não fica associado a nenhuma identidade, não fica registado em base de dados, e não é partilhado com terceiros.
                                </p>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-lg pt-2" style={{ color: headingColor }}>
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
                            <div className="space-y-6">
                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl" style={{ color: headingColor }}>
                                    7. Os teus direitos enquanto titular dos dados
                                </h2>
                                <p>
                                    O RGPD reconhece-te um conjunto de direitos que podes exercer em qualquer momento, gratuitamente. Como esta plataforma não conserva conta de utilizador, a maior parte destes direitos aplica-se apenas a dados que nos tenhas enviado (por exemplo, uma mensagem do formulário de contacto).
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                                    {[
                                        { title: 'Direito de acesso (art. 15.º)', desc: 'Confirmar se tratamos dados teus e obter cópia desses dados.' },
                                        { title: 'Direito de retificação (art. 16.º)', desc: 'Corrigir dados pessoais inexatos ou incompletos.' },
                                        { title: 'Direito ao apagamento (art. 17.º)', desc: 'Solicitar a eliminação dos teus dados — o chamado «direito a ser esquecido».' },
                                        { title: 'Direito à limitação (art. 18.º)', desc: 'Pedir que o tratamento dos teus dados seja suspenso em circunstâncias específicas.' },
                                        { title: 'Direito à portabilidade (art. 20.º)', desc: 'Receber os teus dados num formato estruturado e legível por máquina.' },
                                        { title: 'Direito de oposição (art. 21.º)', desc: 'Opor-se ao tratamento dos teus dados com base em interesse legítimo.' },
                                        { title: 'Retirar consentimento', desc: 'Quando o tratamento se baseou no teu consentimento, podes retirá-lo a qualquer momento sem afetar a licitude do tratamento prévio.' },
                                        { title: 'Decisões automatizadas (art. 22.º)', desc: 'Esta plataforma não toma decisões automatizadas com efeitos jurídicos sobre ti.' },
                                    ].map(item => (
                                        <div key={item.title} className={`p-4 rounded-xl ${innerCardBg}`}>
                                            <h4 className="font-bold mb-1" style={{ color: headingColor }}>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl pt-4" style={{ color: headingColor }}>
                                    8. Como exercer os teus direitos
                                </h2>
                                <p className="text-sm">
                                    Para exercer qualquer destes direitos, envia-nos um pedido através do <a href="/contactar" className="font-bold hover:underline" style={{ color: linkColor }}>formulário de contacto</a>, identificando claramente qual o direito que pretendes exercer. Responderemos no prazo máximo de 30 dias, nos termos do artigo 12.º n.º 3 do RGPD.
                                </p>

                                <h2 className="font-['Fredoka',sans-serif] font-black text-xl pt-4" style={{ color: headingColor }}>
                                    9. Reclamação à autoridade de controlo
                                </h2>
                                <p className="text-sm">
                                    Se considerares que o tratamento dos teus dados viola a legislação aplicável, tens o direito de apresentar reclamação à autoridade de controlo nacional, a <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong>:
                                </p>
                                <p className="text-sm pl-4 border-l-2" style={{ borderColor: isNightMode ? 'rgba(255,255,255,0.2)' : '#dbeeff' }}>
                                    Av. D. Carlos I, 134, 1.º — 1200-651 Lisboa<br />
                                    Telefone: +351 213 928 400<br />
                                    Web: <a href="https://www.cnpd.pt/" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: linkColor }}>www.cnpd.pt</a>
                                </p>
                            </div>
                        )}

                    </div>
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

                    <p className="text-center text-xs mt-2" style={{ color: isNightMode ? '#64748b' : 'rgba(255,255,255,0.6)' }}>
                        Última atualização: Junho de 2026 • Projeto iNTEGRA-TE Loulé
                    </p>
                </section>
            </motion.div>
            <Footer />
            <div className="mb-50"></div>

        </main>
    );
}
