import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import BaseBlock from "@/app/blocks/BaseBlock";
import Container from "@/primitives/Container";
import Omar from "@/images/Omar.jpeg";
import Niels from "@/images/Niels.jpeg";
import Image from "next/image";
import Link from "next/link";

export default function Testimonials() {
  const rotatingTestimonials = [
    Math.random() < 0.5
      ? {
          name: "Omar Reiss",
          title: "CTO at Yoast",
          image: Omar,
          alt: "Photo of Omar Reiss",
          linkedin: "https://www.linkedin.com/in/omarreiss/",
          quote:
            "Anton is a multi-talent, a really smart, enthusiastic and curious person. He is truly full stack as a software engineer and a very fast learner. He’s also proven himself to be a great mentor and teacher to his fellow engineers. I’ve deeply enjoyed working with him and have learned a lot in doing so. Don’t miss out on a chance to work with him!",
        }
      : {
          name: "Niels de Blauw",
          title: "Lead Developer at Level Level",
          image: Niels,
          alt: "Photo of Niels de Blauw",
          linkedin: "https://www.linkedin.com/in/nielsdeblaauw/",
          quote:
            "Anton is able to solve very complex problems with creative yet sensible solutions. He picked up multiple roles from building the user interface, adding pricing algorithms and integrating these new features into the production process of the manufacturer. He has extensive knowledge of a lot of aspects in web development. He knows how to clearly communicate his thoughts and when to ask questions to learn more.",
        },
  ];

  return (
    <Container>
      <BaseBlock className="bg-gray-100 py-8 md:py-10 lg:py-14">
        <BaseBlockHeading className="max-w-[800px] xl:px-6">
          Testimonials
        </BaseBlockHeading>
        <p className="mt-2 max-w-[800px] text-sm text-gray-600 xl:px-6">
          Titles reflect roles at the time we worked together.
        </p>
        <div className="mt-8 md:grid md:grid-cols-2 md:gap-8 xl:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <div
                role="img"
                aria-label="Craig Smith"
                className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-3xl font-heading text-gray-700"
              >
                CS
              </div>
              <div>
                <span className="font-heading text-3xl">Craig Smith</span>
                <br />
                <span className="text-xl font-light">
                  Senior Full Stack Engineer at Quatt
                </span>
                <br />
                <Link
                  href="https://www.linkedin.com/in/craigtsdev/"
                  aria-label="Go to LinkedIn of Craig Smith"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-800"
                >
                  Go to their LinkedIn
                </Link>
              </div>
            </div>
            <p>
              “Anton combines sharp technical ability with genuine people
              skills, a rare combination that elevates everyone around him. His
              communication and mentoring skills come naturally, whether he’s
              steering complex engineering decisions or explaining concepts to
              non-technical stakeholders and junior developers. Always the first
              to ask ‘why?’, Anton championed best practices across our entire
              development lifecycle and consistently pushed us to solve the
              right problems, not just build impressive solutions. I thoroughly
              enjoyed working with him as both a peer and collaborator, and hope
              to do so again.”
            </p>
          </div>
          {rotatingTestimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="mt-10 flex flex-col gap-4 md:mt-0"
            >
              <div className="flex items-center gap-6">
                <Image
                  src={testimonial.image}
                  alt={testimonial.alt}
                  width={128}
                  height={128}
                  className="rounded-full"
                />
                <div>
                  <span className="font-heading text-3xl">
                    {testimonial.name}
                  </span>
                  <br />
                  <span className="text-xl font-light">
                    {testimonial.title}
                  </span>
                  <br />
                  <Link
                    href={testimonial.linkedin}
                    aria-label={`Go to LinkedIn of ${testimonial.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-800"
                  >
                    Go to their LinkedIn
                  </Link>
                </div>
              </div>
              <p>“{testimonial.quote}”</p>
            </div>
          ))}
        </div>
      </BaseBlock>
    </Container>
  );
}
