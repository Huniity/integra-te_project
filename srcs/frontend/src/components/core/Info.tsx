// BOTÃO = RGPD - /rgpd
// BOTÃO = FAQ - /faq

const Info = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="/faq"
        className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg transition duration-200 hover:bg-blue-700"
      >
        INFO
        </a>
        <div className="hidden md:block absolute -top-14 bg-white/95 text-[#1e3a8a] text-[14px] font-extrabold px-4 py-2 rounded-full border-2 border-white shadow-md whitespace-nowrap z-20 pointer-events-none transition-all duration-300 ease-out
                invisible opacity-0 translate-y-2
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
              ></div>
    </div>
  );
};

export default Info;
