import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NightModeBackground, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';
import RocketFlyby from '../components/core/RocketFlyby';

interface MenuButton {
  id: string;
  label: string;
  hint: string;
  bgImg: string;
  iconImg: string;
  path: string;
  cloudImg?: string;
}

export default function Home () {
  return <HomeContent />;
}

function HomeContent() {
  const { isNightMode } = useNightMode();
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
      iconImg: './src/assets/blackboard.webp',
      path: '/aprender'
    },
    {
      id: 'ler',
      label: 'Ler',
      hint: 'Descobre livros',
      bgImg: './src/assets/salmon_dot.webp',
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
      id: 'descarregar',
      label: 'Descarregar',
      hint: 'Descarrega recursos',
      bgImg: './src/assets/darkb_dot.webp',
      iconImg: './src/assets/download.webp',
      path: '/descarregar'
    },
    {
      id: 'contactar',
      label: 'Contactos',
      hint: 'Contacta-nos ou envia-nos uma mensagem',
      bgImg: './src/assets/yellow_dot.webp',
      iconImg: './src/assets/user.webp',
      path: '/contactar'
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
      className="relative h-screen w-full px-3 md:px-6 pt-3 md:pt-14 pb-2 font-['Nunito',sans-serif] overflow-hidden flex flex-col"
    >

      <NightModeBackground dayImage='./src/assets/bg_day.webp' nightImage='./src/assets/bg_night.webp' />

      <img src="/src/assets/bottom_cloud.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-10 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bottom_cloud2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-10 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />

      <div className="hidden lg:block">
        <NightModeToggle />
      </div>
      <RocketFlyby />
      <section className="max-w-6xl w-full mx-auto flex-1 min-h-0 relative z-10 flex items-center py-1">
        <motion.div
          className="w-full relative z-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 sm:gap-y-12 justify-items-center content-center items-start md:flex md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-12 lg:grid lg:grid-cols-4 lg:gap-x-20 lg:gap-y-24 lg:items-end"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {menuButtons.map((btn) => (
            <motion.div
              key={btn.id}
              className="flex flex-col items-center relative w-full md:w-[28%] lg:w-full group"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } }
              }}
            >

              <div className="hidden md:block absolute -top-14 bg-white/95 text-[#1e3a8a] text-[14px] font-extrabold px-4 py-2 rounded-full border-2 border-white shadow-md whitespace-nowrap z-20 pointer-events-none transition-all duration-300 ease-out
                invisible opacity-0 translate-y-2
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
              >
                {btn.hint}
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/95"></div>
              </div>

              <button
                onClick={() => handleNavigation(btn)}
                className="flex flex-col items-center h-auto w-full relative transform transition-all active:scale-95 duration-200 group-hover:-translate-y-5 md:group-hover:-translate-y-6 cursor-pointer focus:outline-none select-none"
              >
                {/* Imagem da Esfera */}
                <div className="w-[clamp(4.2rem,10vw,8.6rem)] h-[clamp(4.2rem,10vw,8.6rem)] flex items-center justify-center relative drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]">
                  <img
                    src={btn.bgImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain scale-140"
                  />
                  <img
                    src={btn.iconImg}
                    alt={btn.label}
                    className="absolute w-[70%] h-[70%] object-contain z-10 transform group-hover:scale-110 transition-transform duration-200"
                  />
                </div>

                {/* Imagem da Nuvem */}
                <div className="mt-[-8%] lg:mt-[-20%] relative w-[clamp(6.6rem,16vw,12.8rem)] h-[clamp(4rem,10vw,7.4rem)] flex items-center justify-center z-10">
                  <img
                    src="./src/assets/under_cloud.webp"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-md max-w-none scale-200"
                  />
                  <span className="relative z-10 font-['Fredoka',sans-serif] text-sm sm:text-base lg:text-[1.7rem] text-[#1e3a8a] font-black tracking-wide pb-2 sm:pb-3 text-center px-1">
                    {btn.label}
                  </span>
                </div>
              </button>

            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
