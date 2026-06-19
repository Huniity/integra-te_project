export default function Footer() {
  const placeholderUrl = "./src/assets/placeholder_600x400.svg";

  return (
    <footer className="w-full mt-2 md:mt-3 flex justify-center relative z-20 shrink-0">
      <div className="bg-white/95 rounded-3xl sm:rounded-full px-4 sm:px-6 md:px-8 py-1.5 sm:py-2.5 shadow-lg border-2 border-white flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 md:gap-5">
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
        </div>


        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-4 md:gap-5">
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
          <div className="border-r border-gray-200 pr-3 last:border-0">
            <img src={placeholderUrl} alt="Logo Placeholder" className="h-12 w-auto object-contain" />
          </div>
        </div>

      </div>
    </footer>
  );
}
