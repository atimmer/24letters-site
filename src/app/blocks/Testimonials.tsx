import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import BaseBlock from "@/app/blocks/BaseBlock";
import Container from "@/primitives/Container";
import Omar from "@/images/Omar.jpeg";
import Niels from "@/images/Niels.jpeg";
import Image from "next/image";

export default function Testimonials() {
  return (
    <Container>
      <BaseBlock className="bg-gray-100">
        <BaseBlockHeading className="max-w-[800px] md:mx-auto">
          Testimonials
        </BaseBlockHeading>
        <div className="mt-6 md:grid md:grid-cols-2 md:gap-8 xl:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <Image
                src={Omar}
                alt="Photo of Omar Reiss"
                width={128}
                height={128}
                className="rounded-full"
              />
              <div>
                <span className="font-heading text-3xl">Omar Reiss</span>
                <br />
                <span className="text-xl font-light">CTO at Yoast</span>
              </div>
            </div>
            <p>
              “Anton is a multi-talent, a really smart, enthusiastic and curious
              person. He is truly full stack as a software engineer and a very
              fast learner. He’s also proven himself to be a great mentor and
              teacher to his fellow engineers. I’ve deeply enjoyed working with
              him and have learned a lot in doing so. Don’t miss out on a chance
              to work with him!”
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-4 md:mt-0">
            <div className="flex items-center gap-6">
              <Image
                src={Niels}
                alt="Photo of Niels de Blauw"
                width={128}
                height={128}
                className="rounded-full"
              />
              <div>
                <span className="font-heading text-3xl">Niels de Blauw</span>
                <br />
                <span className="text-xl font-light">
                  Lead Developer at Level Level
                </span>
              </div>
            </div>
            <p>
              “Anton is able to solve very complex problems with creative yet
              sensible solutions. He picked up multiple roles from building the
              user interface, adding pricing algorithms and integrating these
              new features into the production process of the manufacturer. He
              has extensive knowledge of a lot of aspects in web development. He
              knows how to clearly communicate his thoughts and when to ask
              questions to learn more.”
            </p>
          </div>
        </div>
      </BaseBlock>
    </Container>
  );
}
