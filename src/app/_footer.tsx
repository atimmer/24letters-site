import Container from "@/primitives/Container";
import Image from "next/image";
import Headshot from "@/images/Headshot.png";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cyprus py-10 text-white">
      <Container className="flex items-center gap-6 lg:gap-20">
        <aside>
          <Image src={Headshot} alt="" width={512} height={612} />
        </aside>
        <div>
          <span className="font-heading text-6xl leading-tight">
            Ready to build something awesome together?
          </span>{" "}
          <br />
          <div className="mt-8 flex gap-4">
            <button className="bg-accent text-dark rounded-full p-6 text-2xl font-bold">
              Schedule a call
            </button>
            <Link
              href="mailto:anton@24letters.com"
              className="text-dark rounded-full bg-white p-6 text-2xl font-bold"
            >
              Shoot me an email
            </Link>
          </div>
        </div>
      </Container>
      <Container className="mt-6">
        <div className="text-center font-heading text-2xl">
          “You’re so busy going from a to z that you forget there are 24 letters
          in between”
        </div>
      </Container>
      <Container className="mt-4 flex justify-center gap-8">
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
