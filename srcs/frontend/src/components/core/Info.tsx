
import InfoLogo from '../../assets/info.webp'
// BOTÃO = RGPD - /rgpd
// BOTÃO = FAQ - /faq

const Hover = () => {
  return (
    <>
      <div className='px-12 py-4 text-black text-sm'>
        <a href="/faq" target="_blank" className="text-white/90 font-['Fredoka',sans-serif] font-semibold text-2xl no-underline hover:text-blue-300">
          FAQ
        </a>
        <br />
        <a href="/rgpd" target="_blank" className="text-white/90 font-['Fredoka',sans-serif]  font-semibold text-2xl no-underline hover:text-blue-300">
          RGPD
        </a>
      </div>
    </>
  )
}



const Info = () => {
  return (
    <div className="fixed bottom-[0%] right-[5%] z-50">
      <div className="text-center justify-content group round rounded-full h-30 w-30 px-4 py bg-transparent text with rounded">
        <img src={InfoLogo} className='z-40 w-20 h-20 hover:scale-110 transition-transform duration-200'/>
        <div className="bottom-50 right-15 w-50 hidden md:block relative bottom-10 bg-blue-900/90 text-[#1e3a8a] text-[14px] font-extrabold px-6 py-2 rounded-full border-2 border-blue-900 shadow-md whitespace-nowrap z-20 transition-all duration-300 ease-out
                invisible opacity-0 translate-y-2
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
        >
          <Hover />
          {/* ARROW */}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-900 border-blue-900/90"></div>
        </div>
      </div>
    </div>
  );
};

export default Info;
