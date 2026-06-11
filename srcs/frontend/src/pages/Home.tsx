import { useNavigate } from 'react-router-dom';

interface MenuButton {
  id: string;
  label: string;
  hint: string;
  bgImg: string;
  iconImg: string;
  path: string;
  cloudImg?: string;
}

export default function Home() {
  const navigate = useNavigate();

  const menuButtons: MenuButton[] = [
    {
      id: 'perfil',
      label: 'Perfil',
      hint: 'Acede ao teu perfil',
      bgImg: './src/assets/yellow_dot.webp',
      iconImg: './src/assets/user.webp',
      path: '/perfil'
    },
    {
      id: 'exercicios',
      label: 'Exercícios',
      hint: 'Treina e diverte-te',
      bgImg: './src/assets/purple_dot.webp',
      iconImg: './src/assets/weight.webp',
      path: '/exercicios'
    },
    {
      id: 'jogos',
      label: 'Jogos',
      hint: 'Joga e aprende novas coisas',
      bgImg: './src/assets/green_dot.webp',
      iconImg: './src/assets/controller.webp',
      path: '/jogos'
    },
    {
      id: 'aprender',
      label: 'Aprender',
      hint: 'Explora os temas',
      bgImg: './src/assets/red_dot.webp',
      iconImg: './src/assets/blue_book.webp',
      path: '/ler'
    },
    {
      id: 'videos',
      label: 'Vídeos',
      hint: 'Vê vídeos educativos',
      bgImg: './src/assets/blue_dot.webp',
      iconImg: './src/assets/video.webp',
      path: '/videos'
    },
    {
      id: 'galeria',
      label: 'Galeria',
      hint: 'Descobre imagees e trabalhos',
      bgImg: './src/assets/salmon_dot.webp',
      iconImg: './src/assets/gallery.webp',
      path: '/galeria'
    },
    {
      id: 'descarregar',
      label: 'Descarregar',
      hint: 'Descarrega recursos',
      bgImg: './src/assets/darkb_dot.webp',
      iconImg: './src/assets/download.webp',
      path: '/descarregar'
    },
    {
      id: 'informacoes',
      label: 'Informações',
      hint: 'Sabe mais sobre nós',
      bgImg: './src/assets/pink_dot.webp',
      iconImg: './src/assets/info.webp',
      cloudImg: './src/assets/info_cloud.webp',
      path: '/sobre'
    }
  ];

  const handleNavigation = (btn: MenuButton) => {
    if (btn.path) {
      navigate(btn.path);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed pt-6 pb-20 px-4 md:px-8 font-['Nunito',sans-serif] overflow-x-hidden flex flex-col justify-between"
      style={{ backgroundImage: 'url(./src/assets/homepage.webp)' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800;900&display=swap');
        .font-fredoka { font-family: 'Fredoka', sans-serif; }
        .button-shadow { filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2)); }
      `}</style>

      <header className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 relative z-30">
        <div className="bg-white/95 px-8 py-3 rounded-full shadow-lg border-2 border-white transform hover:scale-102 transition-transform">
          <span className="font-fredoka text-2xl md:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#005bb7] to-[#3b82f6]">
            iNTEGRA-TE
          </span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="O que procuras?"
              className="w-full bg-[#005bb7]/90 text-white placeholder-white/80 pl-12 pr-4 py-2.5 rounded-full font-bold text-sm outline-none border-2 border-white/20 focus:border-white shadow-md backdrop-blur-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-base">🔍</span>
          </div>
        </div>
      </header>

      <section className="max-w-5xl w-full mx-auto my-auto relative z-10 py-8 mt-7">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-16 justify-items-center items-end">
          {menuButtons.map((btn) => (
            <div key={btn.id} className="flex flex-col items-center relative w-full group">


                <div className="absolute -top-16 bg-white/95 text-[#1e3a8a] text-[11px] font-extrabold px-5 py-2.5 rounded-full border-2 border-white shadow-md whitespace-nowrap z-20 pointer-events-none transition-all duration-300 ease-out
                invisible opacity-0 translate-y-2
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
                >
                {btn.hint}

                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/95"></div>
                </div>


              <button
                onClick={() => handleNavigation(btn)}
                className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center relative button-shadow transform transition-all active:scale-95 duration-200 group-hover:-translate-y-4 cursor-pointer"
              >

                <img
                  src={btn.bgImg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain select-none"
                />


                <img
                  src={btn.iconImg}
                  alt={btn.label}
                  className="absolute w-[52%] h-[52%] object-contain select-none z-10 transform group-hover:scale-110 transition-transform duration-200"
                />
              </button>


                <div className="mt-[-80px] relative w-[300px] h-[200px] flex items-center justify-center transform group-hover:scale-105 transition-transform z-10">
                <img
                    src="./src/assets/under_cloud.webp"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain select-none drop-shadow-md max-w-none scale-110"
                />


                <span className="relative z-10 font-fredoka text-base sm:text-lg text-[#1e3a8a] font-black tracking-wide pb-4">
                    {btn.label}
                </span>
                </div>

            </div>
          ))}
        </div>
      </section>



      <footer className="w-full mt-12 flex justify-center relative z-20">
        <div className="bg-white/95 rounded-full px-8 py-3 shadow-lg border-2 border-white flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-6 last:border-0">
            <div className="w-8 h-5 bg-blue-800 flex items-center justify-center text-[6px] text-yellow-400 font-bold rounded-sm">EU</div>
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Cofinanciado pela<br/>União Europeia</span>
          </div>
          <div className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            ALGARVE <span className="text-orange-500">2030</span>
          </div>
          <div className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
            PORTUGAL <span className="text-amber-500">2030</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl">🏰</div>
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Loulé<br/>concelho</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
