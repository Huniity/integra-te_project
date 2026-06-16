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
      id: 'resolver',
      label: 'Resolver',
      hint: 'Treina e diverte-te',
      bgImg: './src/assets/purple_dot.webp',
      iconImg: './src/assets/weight.webp',
      path: '/resolver'
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
      path: '/aprender'
    },
    {
      id: 'ler',
      label: 'Ler',
      hint: 'Descobre livros',
      bgImg: './src/assets/salmon_dot.webp',
      iconImg: './src/assets/gallery.webp',
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
      id: 'descarregar',
      label: 'Descarregar',
      hint: 'Descarrega recursos',
      bgImg: './src/assets/darkb_dot.webp',
      iconImg: './src/assets/download.webp',
      path: '/descarregar'
    },
    {
      id: 'contactos',
      label: 'Contactos',
      hint: 'Contacta-nos ou envia-nos uma mensagem',
      bgImg: './src/assets/yellow_dot.webp',
      iconImg: './src/assets/user.webp',
      path: '/contactos'
    },
    {
      id: 'sobre',
      label: 'Sobre',
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
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed px-3 md:px-6 py-3 md:py-4 font-['Nunito',sans-serif] overflow-hidden flex flex-col"
      style={{ backgroundImage: 'url(./src/assets/content2.png)' }}
    >
      <header className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3 mb-2 md:mb-3 relative z-30 shrink-0">
        <div className="bg-white/95 px-5 md:px-8 py-2 md:py-3 rounded-full shadow-lg border-2 border-white transform hover:scale-[1.02] transition-transform">
          <span className="font-['Fredoka',sans-serif] text-xl md:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#005bb7] to-[#3b82f6]">
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

      <section className="max-w-6xl w-full mx-auto flex-1 min-h-0 relative z-10 flex items-center py-1">
        <div className="grid w-full h-full grid-cols-4 gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6 justify-items-center content-center items-end">
          {menuButtons.map((btn) => (
            <div key={btn.id} className="flex flex-col items-center relative w-full group">


                <div className="hidden md:block absolute -top-14 bg-white/95 text-[#1e3a8a] text-[11px] font-extrabold px-4 py-2 rounded-full border-2 border-white shadow-md whitespace-nowrap z-20 pointer-events-none transition-all duration-300 ease-out
                invisible opacity-0 translate-y-2
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
                >
                {btn.hint}

                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/95"></div>
                </div>


              <button
                onClick={() => handleNavigation(btn)}
                className="w-[clamp(4.2rem,10vw,8.6rem)] h-[clamp(4.2rem,10vw,8.6rem)] flex items-center justify-center relative drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] transform transition-all active:scale-95 duration-200 group-hover:-translate-y-2 md:group-hover:-translate-y-3 cursor-pointer"
              >

                <img
                  src={btn.bgImg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain select-none scale-110"
                />


                <img
                  src={btn.iconImg}
                  alt={btn.label}
                  className="absolute w-[62%] h-[62%] object-contain select-none z-10 transform group-hover:scale-110 transition-transform duration-200"
                />
              </button>


                <div className="mt-[-20%] relative w-[clamp(6.6rem,16vw,12.8rem)] h-[clamp(4rem,10vw,7.4rem)] flex items-center justify-center transform group-hover:scale-105 transition-transform z-10">
                <img
                    src="./src/assets/under_cloud.webp"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain select-none drop-shadow-md max-w-none scale-170"
                />


                <span className="relative z-10 font-['Fredoka',sans-serif] text-[clamp(0.62rem,1.9vw,1.15rem)] text-[#1e3a8a] font-black tracking-wide pb-2 sm:pb-3 text-center px-1">
                    {btn.label}
                </span>
                </div>

            </div>
          ))}
        </div>
      </section>



      <footer className="w-full mt-2 md:mt-3 flex justify-center relative z-20 shrink-0">
        <div className="bg-white/95 rounded-3xl sm:rounded-full px-3 sm:px-5 md:px-8 py-1.5 sm:py-2.5 shadow-lg border-2 border-white flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:border-r border-gray-200 sm:pr-4 md:pr-6 last:border-0">
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Cofinanciado pela<br/>União Europeia</span>
          </div>
          <div className="text-xs sm:text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            ALGARVE <span className="text-orange-500">2030</span>
          </div>
          <div className="text-xs sm:text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
            PORTUGAL <span className="text-amber-500">2030</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Loulé<br/>concelho</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
