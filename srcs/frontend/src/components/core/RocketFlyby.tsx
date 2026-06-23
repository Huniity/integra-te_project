export default function RocketFlyby() {
  return (
    <>
      <style>{`
        @keyframes rocketFlyby {
          0%   { transform: translateY(0)     scale(1);    opacity: 0; }
          4%   { transform: translateY(0)     scale(1);    opacity: 1; }
          70%  { transform: translateY(-82vh) scale(0.18); opacity: 0.6; }
          78%  { transform: translateY(-88vh) scale(0.12); opacity: 0; }
          79%, 100% { transform: translateY(0) scale(1);  opacity: 0; }
        }
        .rocket-flyby {
          animation: rocketFlyby 6s linear infinite;
          animation-delay: 2s;
        }

        @keyframes flameOuter {
          0%   { transform: translateX(-50%) scaleX(0.8)  scaleY(1.05); opacity: 0.75; }
          33%  { transform: translateX(-50%) scaleX(1.15) scaleY(0.9);  opacity: 0.6;  }
          66%  { transform: translateX(-50%) scaleX(0.9)  scaleY(1.1);  opacity: 0.8;  }
          100% { transform: translateX(-50%) scaleX(0.75) scaleY(0.95); opacity: 0.65; }
        }
        @keyframes flameInner {
          0%   { transform: translateX(-50%) scaleX(0.9)  scaleY(1);    opacity: 1;    }
          50%  { transform: translateX(-50%) scaleX(0.65) scaleY(1.15); opacity: 0.85; }
          100% { transform: translateX(-50%) scaleX(1.05) scaleY(0.88); opacity: 0.95; }
        }

        .flame-center-outer {
          position: absolute; bottom: -34px; left: 49%;
          transform: translateX(-50%);
          width: 16px; height: 34px;
          background: linear-gradient(to bottom, #ff9500 0%, #ff4500 45%, #ff1a00 75%, transparent 100%);
          border-radius: 40% 40% 60% 60%;
          filter: blur(5px);
          animation: flameOuter 0.18s ease-in-out infinite alternate;
        }
        .flame-center-inner {
          position: absolute; bottom: -22px; left: 49%;
          transform: translateX(-50%);
          width: 8px; height: 19px;
          background: linear-gradient(to bottom, #fff7a0 0%, #ffe033 40%, #ff8c00 80%, transparent 100%);
          border-radius: 40% 40% 55% 55%;
          filter: blur(2px);
          animation: flameInner 0.11s ease-in-out infinite alternate;
        }

        .flame-left-outer {
          position: absolute; bottom: -28px; left: 25%;
          transform: translateX(-50%);
          width: 10px; height: 22px;
          background: linear-gradient(to bottom, #ff9500 0%, #ff4500 45%, #ff1a00 75%, transparent 100%);
          border-radius: 40% 40% 60% 60%;
          filter: blur(4px);
          animation: flameOuter 0.21s ease-in-out infinite alternate;
          animation-delay: 0.05s;
        }
        .flame-left-inner {
          position: absolute; bottom: -19px; left: 25%;
          transform: translateX(-50%);
          width: 5px; height: 12px;
          background: linear-gradient(to bottom, #fff7a0 0%, #ffe033 40%, #ff8c00 80%, transparent 100%);
          border-radius: 40% 40% 55% 55%;
          filter: blur(1.5px);
          animation: flameInner 0.14s ease-in-out infinite alternate;
          animation-delay: 0.05s;
        }

        .flame-right-outer {
          position: absolute; bottom: -28px; left: 73%;
          transform: translateX(-50%);
          width: 10px; height: 22px;
          background: linear-gradient(to bottom, #ff9500 0%, #ff4500 45%, #ff1a00 75%, transparent 100%);
          border-radius: 40% 40% 60% 60%;
          filter: blur(4px);
          animation: flameOuter 0.16s ease-in-out infinite alternate;
          animation-delay: 0.09s;
        }
        .flame-right-inner {
          position: absolute; bottom: -19px; left: 73%;
          transform: translateX(-50%);
          width: 5px; height: 12px;
          background: linear-gradient(to bottom, #fff7a0 0%, #ffe033 40%, #ff8c00 80%, transparent 100%);
          border-radius: 40% 40% 55% 55%;
          filter: blur(1.5px);
          animation: flameInner 0.13s ease-in-out infinite alternate;
          animation-delay: 0.09s;
        }
      `}</style>

      <div
        aria-hidden="true"
        className="rocket-flyby pointer-events-none fixed bottom-[-5%] left-[3%] z-3"
        style={{ width: '5rem', height: '5rem' }}
      >
        <div className="flame-left-outer" />
        <div className="flame-left-inner" />
        <div className="flame-center-outer" />
        <div className="flame-center-inner" />
        <div className="flame-right-outer" />
        <div className="flame-right-inner" />
        <img
          src="./src/assets/rocket.webp"
          alt=""
          className="w-25 h-25 object-contain relative z-3 rotate-[-25deg] drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]"
        />
      </div>
    </>
  );
}
