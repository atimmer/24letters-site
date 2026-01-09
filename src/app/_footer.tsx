import Container from "@/primitives/Container";
import Image from "next/image";
import Headshot from "@/images/Headshot.png";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cyprus relative overflow-hidden py-12 text-white">
      <div className="bg-brand/20 pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full blur-3xl"></div>
      <Container className="flex flex-col items-center gap-10 px-6 lg:flex-row lg:gap-20 lg:px-0">
        <aside className="hidden lg:block">
          <Image
            src={Headshot}
            alt=""
            width={420}
            height={520}
            className="rounded-[2rem] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          />
        </aside>
        <div className="bg-dark/40 w-full rounded-[2rem] border border-white/10 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur lg:p-10">
          <span className="font-heading text-3xl leading-tight lg:text-5xl">
            Ready to build something awesome together?
          </span>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="mailto:anton@24letters.com"
              className="text-dark bg-brand inline-flex items-center justify-center rounded-full px-6 py-3 text-lg font-bold shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
            >
              Shoot me an email
            </Link>
          </div>
        </div>
      </Container>
      <Container className="mt-10 px-6 lg:px-0">
        <div className="font-heading text-center text-2xl text-white/90">
          “You’re so busy going from a to z that you forget there are 24 letters
          in between”
        </div>
      </Container>
      <Container className="mt-6 flex flex-wrap justify-center gap-6 px-6 text-sm text-white/80 lg:px-0">
        <div>&copy; 2020 - {new Date().getFullYear()}</div>
        <div>
          <Link href="https://timhengeveld.com">
            Designed by <strong>Hedgefield</strong>
          </Link>
        </div>
        <div>
          <Link href="https://www.linkedin.com/in/atimmer/">LinkedIn</Link>
        </div>
      </Container>
    </footer>
  );
}
