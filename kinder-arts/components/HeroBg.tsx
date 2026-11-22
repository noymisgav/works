"use client";

export default function HeroBg() {
  return (
    <>
      <style>{`
        @keyframes move {
          100% {
            transform: translate3d(0, 0, 1px) rotate(360deg);
          }
        }
        .hero-ball {
          position: absolute;
          width: 20vmin;
          height: 20vmin;
          border-radius: 50%;
          backface-visibility: hidden;
          animation: move linear infinite;
        }
        .hero-ball:nth-child(1)  { color: var(--teal); }
        .hero-ball:nth-child(2)  { color: var(--yellow); }
        .hero-ball:nth-child(3)  { color: #88b8a2; }
        .hero-ball:nth-child(4)  { color: var(--coral); }
        .hero-ball:nth-child(5)  { color: #899ccf; }
        .hero-ball:nth-child(6)  { color: var(--yellow); }
        .hero-ball:nth-child(7)  { color: #88b8a2; }
        .hero-ball:nth-child(8)  { color: var(--coral); }
        .hero-ball:nth-child(9)  { color: #899ccf; }
        .hero-ball:nth-child(10) { color: var(--teal); }

        .hero-ball:nth-child(1)  { top:77%; left:88%; animation-duration:40s; animation-delay:-3s;  transform-origin: 16vw  -2vh; box-shadow: 40vmin 0 5.7vmin currentColor; }
        .hero-ball:nth-child(2)  { top:42%; left:2%;  animation-duration:53s; animation-delay:-29s; transform-origin:-19vw  21vh; box-shadow:-40vmin 0 5.2vmin currentColor; }
        .hero-ball:nth-child(3)  { top:28%; left:18%; animation-duration:49s; animation-delay:-8s;  transform-origin:-22vw   3vh; box-shadow: 40vmin 0 5.2vmin currentColor; }
        .hero-ball:nth-child(4)  { top:50%; left:79%; animation-duration:26s; animation-delay:-21s; transform-origin:-17vw  -6vh; box-shadow: 40vmin 0 5.3vmin currentColor; }
        .hero-ball:nth-child(5)  { top:46%; left:15%; animation-duration:36s; animation-delay:-40s; transform-origin:  4vw   0vh; box-shadow:-40vmin 0 6.0vmin currentColor; }
        .hero-ball:nth-child(6)  { top:77%; left:16%; animation-duration:31s; animation-delay:-10s; transform-origin: 18vw   4vh; box-shadow: 40vmin 0 5.2vmin currentColor; }
        .hero-ball:nth-child(7)  { top:10%; left:55%; animation-duration:44s; animation-delay:-15s; transform-origin: -8vw  12vh; box-shadow:-40vmin 0 5.5vmin currentColor; }
        .hero-ball:nth-child(8)  { top:65%; left:40%; animation-duration:38s; animation-delay:-22s; transform-origin: 20vw  -8vh; box-shadow: 40vmin 0 5.4vmin currentColor; }
        .hero-ball:nth-child(9)  { top:20%; left:70%; animation-duration:57s; animation-delay:-35s; transform-origin:-14vw   5vh; box-shadow:-40vmin 0 5.8vmin currentColor; }
        .hero-ball:nth-child(10) { top:85%; left:50%; animation-duration:33s; animation-delay:-12s; transform-origin: 10vw  15vh; box-shadow: 40vmin 0 5.1vmin currentColor; }
      `}</style>

      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden -z-10"
        style={{ background: "var(--cream)" }}
      >
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
        <span className="hero-ball" />
      </div>
    </>
  );
}
