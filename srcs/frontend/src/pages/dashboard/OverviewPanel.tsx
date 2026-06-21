import corner from '../../assets/corner_c.png';
import { useNightMode } from '../../components/core/NightMode';
import Weight from '../../assets/weight.webp';
import Board from '../../assets/blackboard.png';
import Controller from '../../assets/controller.webp';
import BookImg from '../../assets/blue_book.webp';
import VideoImg from '../../assets/video.webp';
import DownloadImg from '../../assets/download.webp';

interface QuickAction {
    tabId: string;
    label: string;
    icon: string;
    desc: string;
}

const QUICK_ACTIONS: QuickAction[] = [
    { tabId: 'aulas',      label: 'Nova Aula',      icon: Board, desc: 'Começa uma nova aula'       },
    { tabId: 'exercicios', label: 'Novo Exercício',  icon: Weight, desc: 'Cria um novo exercício'      },
    { tabId: 'videos',     label: 'Novo Vídeo',      icon: VideoImg, desc: 'Adiciona um novo vídeo'    },
    { tabId: 'ficheiros',  label: 'Novo Ficheiro',   icon: DownloadImg, desc: 'Adiciona um novo ficheiro' },
    { tabId: 'livros',     label: 'Novo Livro',      icon: BookImg, desc: 'Adiciona um novo livro'     },
    { tabId: 'jogos',      label: 'Novo Jogo',       icon: Controller, desc: 'Adiciona um novo jogo'  },
];

interface OverviewPanelProps {
    onTabSelect: (id: string) => void;
}

const OverviewPanel = ({ onTabSelect }: OverviewPanelProps) => {
    const { isNightMode } = useNightMode();

    return (
        <div className="flex flex-col gap-12">
            <div className="flex items-center gap-14">
                <div>
                    <h2 className="font-['Fredoka',sans-serif] text-2xl font-semibold text-gray-300"
                        style={{
                            textShadow:
                                '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb, 1px -1px #2563eb, -1px 1px #2563eb',
                            }}>Criar rapidamente</h2>
                </div>
            </div>
            <div className="font-['Fredoka',sans-serif] grid grid-cols-2 xl:grid-cols-3 gap-12 gap-y-12 justify-items-center ml-auto mr-auto">
                {QUICK_ACTIONS.map(({ tabId, label, icon, desc }) => (
                    <button
                        key={tabId}
                        type="button"
                        onClick={() => onTabSelect(tabId)}
                        className="relative flex flex-col items-center gap-2 rounded-2xl bg-white/20 border border-white/40 px-4 py-6 text-center shadow-sm hover:border-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-[0.97] w-92 h-56 justify-self-center overflow-hidden"
                    >
                        <img src={corner} alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 w-42 h-42 object-contain opacity-60" />
                        <img src={icon} alt="" className="h-20 w-20 object-contain" />
                        <span className="font-['Fredoka',sans-serif] text-3xl font-black text-white"
                            style={{
                            textShadow:
                                '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb, 1px -1px #2563eb, -1px 1px #2563eb',
                            }}
                        >
                            {label}
                        </span>
                        <p className={`text-sm ${isNightMode ? 'text-gray-300' : 'text-blue-600'}`}>{desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OverviewPanel;
