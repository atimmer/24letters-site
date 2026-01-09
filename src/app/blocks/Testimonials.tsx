import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import BaseBlock from "@/app/blocks/BaseBlock";
import Container from "@/primitives/Container";
import Omar from "@/images/Omar.jpeg";
import Niels from "@/images/Niels.jpeg";
import Image from "next/image";

export default function Testimonials() {
  return (
    <Container>
      <BaseBlock>
        <BaseBlockHeading className="max-w-[900px] md:mx-auto">
          Testimonials
        </BaseBlockHeading>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {[
            {
              image: Omar,
              name: "Omar Reiss",
              title: "CTO at Yoast",
              quote:
                "Anton is a multi-talent, a really smart, enthusiastic and curious person. He is truly full stack as a software engineer and a very fast learner. He’s also proven himself to be a great mentor and teacher to his fellow engineers. I’ve deeply enjoyed working with him and have learned a lot in doing so. Don’t miss out on a chance to work with him!",
            },
            {
              image: Niels,
              name: "Niels de Blauw",
              title: "Lead Developer at Level Level",
              quote:
                "Anton is able to solve very complex problems with creative yet sensible solutions. He picked up multiple roles from building the user interface, adding pricing algorithms and integrating these new features into the production process of the manufacturer. He has extensive knowledge of a lot of aspects in web development. He knows how to clearly communicate his thoughts and when to ask questions to learn more.",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white/90 flex h-full flex-col gap-6 rounded-[2rem] border border-dark/10 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-5">
                <Image
                  src={testimonial.image}
                  alt={`Photo of ${testimonial.name}`}
                  width={96}
                  height={96}
                  className="rounded-2xl border border-dark/10"
                />
                <div>
                  <span className="font-heading text-2xl text-dark">
                    {testimonial.name}
                  </span>
                  <br />
                  <span className="text-base text-dark/70">
                    {testimonial.title}
                  </span>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-dark/80">
                “{testimonial.quote}”
              </p>
            </div>
          ))}
        </div>
      </BaseBlock>
    </Container>
  );
}
