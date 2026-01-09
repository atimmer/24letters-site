import Container from "@/primitives/Container";
import Image from "next/image";
import Headshot from "@/images/Headshot.png";

export function HeadshotHeader() {
  return (
    <header className="bg-cyprus relative overflow-hidden">
      <div className="bg-brand/20 pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"></div>
      <div className="bg-dark/40 pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full blur-3xl"></div>
      <Container className="flex flex-col items-center gap-6 px-6 pb-10 pt-12 text-white sm:grid sm:grid-cols-2 sm:pb-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 print:grid-cols-6 print:pb-0">
        <h1 className="flex w-full max-w-sm flex-col justify-center gap-4 md:max-w-none print:col-span-5">
          <div className="font-heading leading-none tracking-tight">
            <span className="text-2xl md:text-3xl lg:text-[4.5rem]">I’m </span>
            <span className="text-5xl md:text-6xl lg:text-8xl">Anton</span>
          </div>
          <div className="text-lg leading-snug text-white/85 md:text-xl lg:text-4xl">
            Human focused software engineer
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
            <span className="bg-brand/20 rounded-full px-4 py-2 text-white">
              Product focus
            </span>
            <span className="bg-white/10 rounded-full px-4 py-2">
              Calm delivery
            </span>
          </div>
        </h1>
        <aside className="relative max-w-sm md:max-w-none">
          <div className="bg-brand/30 absolute -right-6 -top-6 h-24 w-24 rounded-3xl blur-2xl"></div>
          <Image
            src={Headshot}
            alt="Avatar of Anton Timmermans"
            width={576}
            height={576}
            priority
            className="relative rounded-[2.5rem] border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          />
        </aside>
      </Container>
    </header>
  );
}
