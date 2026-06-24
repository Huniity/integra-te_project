
import Fundacao from "../../assets/logos_officiais/Fundacao-aleixo.webp";
import BandeiraUe from "../../assets/logos_officiais/Bandeira_UE_FSE.webp";
import Algarve30 from "../../assets/logos_officiais/Barras_de_Assinaturas_Algarve2030_Cores.webp";
import CMLoule from "../../assets/logos_officiais/CMLoule.webp";
import LogoUe from "../../assets/logos_officiais/Logo-UE-FSE.webp";
import PISLogo from "../../assets/logos_officiais/PIS_Logo_Cor.webp";
import Integrate from "../../assets/logos_officiais/integrate_of.webp"

export default function Footer() {

  return (
    <footer className="w-full mt-2 md:mt-3 flex justify-center relative z-20 shrink-0">
      <div className="bg-white/45 backdrop-blur-md rounded-3xl sm:rounded-full px-4 sm:px-6 md:px-8 py-1.5 sm:py-2.5 shadow-[0_8px_32px_rgba(31,38,135,0.18)] border border-white/40 ring-1 ring-white/20 flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 md:gap-5">
          <div className="border-r border-white/0 pr-3 last:border-0">
            <img src={PISLogo} alt="Logo Placeholder" className="h-10 xs:h-12 sm:h-10 md:h-8 lg:h-11 xl:h-10 w-auto object-contain" />
          </div>
          <div className="border-r border-white/0 pr-3 last:border-0">
            <img src={Algarve30} alt="Logo Placeholder" className="h-10 xs:h-12 sm:h-10 md:h-8 lg:h-11 xl:h-12 w-auto object-contain" />
          </div>
        </div>


        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-4 md:gap-5">
          <div className="border-r border-white/0 pr-3 last:border-0">
            <img src={CMLoule} alt="Logo Placeholder" className="h-10 xs:h-12 sm:h-10 md:h-8 lg:h-11 xl:h-16 w-auto object-contain" />
          </div>
          <div className="border-r border-white/0 pr-3 last:border-0">
            <img src={Fundacao} alt="Logo Placeholder" className="h-10 xs:h-12 sm:h-10 md:h-8 lg:h-11 xl:h-16 w-auto object-contain" />
          </div>
          <div className="border-r border-white/0 pr-3 last:border-0">
            <img src={Integrate} alt="Logo Placeholder" className="h-10 xs:h-12 sm:h-10 md:h-8 lg:h-11 xl:h-18 w-auto object-contain" />
          </div>
        </div>

      </div>
    </footer>
  );
}
