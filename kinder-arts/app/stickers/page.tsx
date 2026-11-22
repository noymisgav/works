import Navbar from "@/components/Navbar";
import Image from "next/image";
import HeroBg from "@/components/HeroBg";

const STICKERS = [
  "029dd761-2484-49eb-bc36-e3296f9aae3e",
  "053997e1-add3-4b52-9834-00f48ba6daca",
  "208954fb-538a-468c-b379-fff6ee8fdc10",
  "2ac83212-25e3-4ad5-9f7a-5c218bae2a3c",
  "354946da-6631-4675-ad7a-16a816e2d1ad",
  "5283644b-8a84-403a-b96e-549f2d9fd24b",
  "65d93b46-25d0-4dd2-9624-9ba449ce41dd",
  "71976b6d-40cb-4877-8a94-b23848d67ec6",
  "7e659e4e-206a-495a-bfcf-7b39974d69e3",
  "7feaa6e0-8282-4ae0-be67-a31796677795",
  "9fb30a0b-7e41-4e09-b481-73383f2a1072",
  "a49c6f0a-a393-4ecb-abe2-06191bebebe0",
  "afea0540-faec-4b0b-9bd9-0a9500f7696d",
  "c92427e2-cfe9-4651-a662-ad8c8d7fd220",
  "cd7e1c46-b460-49f9-a2ac-6f911b6ddf42",
  "d15b322a-ec1b-4af8-99b1-8b0abe826878",
  "d78a8f76-71af-4155-b900-0c9a4480658a",
  "e7207a9d-a386-485c-b8c5-89889c4ddd81",
  "f2cc512f-d115-4de7-8a57-8b8ddccdb953",
  "f92baca2-2e10-4ccb-9412-64fce800f7a4",
];

// Fixed random-looking rotations and sizes per sticker
const TRANSFORMS = [
  { rotate: -8,  scale: 1.1 },
  { rotate:  5,  scale: 0.9 },
  { rotate: -3,  scale: 1.0 },
  { rotate:  9,  scale: 1.2 },
  { rotate: -6,  scale: 0.95 },
  { rotate:  2,  scale: 1.05 },
  { rotate: -11, scale: 1.0 },
  { rotate:  7,  scale: 0.9 },
  { rotate: -4,  scale: 1.15 },
  { rotate:  12, scale: 1.0 },
  { rotate: -7,  scale: 0.95 },
  { rotate:  3,  scale: 1.1 },
  { rotate: -9,  scale: 1.0 },
  { rotate:  6,  scale: 0.9 },
  { rotate: -2,  scale: 1.05 },
  { rotate:  10, scale: 1.0 },
  { rotate: -5,  scale: 1.2 },
  { rotate:  4,  scale: 0.95 },
  { rotate: -13, scale: 1.0 },
  { rotate:  8,  scale: 1.05 },
];

export default function StickersPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        <HeroBg />
        {/* Hero */}
        <div className="relative py-16 text-center px-6 overflow-hidden" style={{ background: "var(--cream-muted)" }}>
          <div className="relative z-10">
            <p className="text-teal font-bold text-sm tracking-widest uppercase mb-2">
              האוסף המיוחד
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-ink">
              מדבקות של עפרי
            </h1>
            <p className="text-ink-light mt-3 text-lg font-normal">
              {STICKERS.length} מדבקות. כולן אמיתיות.
            </p>
          </div>
        </div>
        <hr className="doodle-hr-dashed w-full" />

        {/* Sticker wall */}
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-6">
            {STICKERS.map((id, i) => {
              const t = TRANSFORMS[i % TRANSFORMS.length];
              return (
                <div
                  key={id}
                  className="break-inside-avoid mb-6 inline-block w-full"
                >
                  <div
                    className="group relative cursor-pointer transition-all duration-300 hover:z-10"
                    style={{
                      transform: `rotate(${t.rotate}deg) scale(${t.scale})`,
                    }}
                  >
                    <div className="hover:scale-110 hover:rotate-0 transition-all duration-300 drop-shadow-lg hover:drop-shadow-2xl">
                      <Image
                        src={`/stickers/${id}.webp`}
                        alt={`מדבקה ${i + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
