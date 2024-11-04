import Container from "@/primitives/Container";
import Image from "next/image";
import Headshot from "@/images/Headshot.png";

export function HeadshotHeader() {
  return (
    <header className="bg-cyprus">
      <Container className="flex flex-col items-center gap-4 px-6 pb-6 font-heading text-white sm:grid sm:grid-cols-2 lg:gap-20 lg:pb-10">
        <div className="flex w-full max-w-sm flex-col justify-center md:max-w-none">
          <div>
            <span className="text-2xl md:text-3xl lg:text-[5rem]">I’m </span>
            <span className="text-5xl md:text-6xl lg:text-9xl lg:leading-tight">
              Anton,
            </span>
          </div>
          <div className="md:text-xl lg:text-6xl lg:leading-tight">
            Creative full-stack software engineer
          </div>
        </div>
        <aside className="max-w-sm md:max-w-none">
          <Image
            src={Headshot}
            alt="Avatar of Anton Timmermans"
            width={640}
            height={640}
            priority
          />
        </aside>
      </Container>
    </header>
  );
}