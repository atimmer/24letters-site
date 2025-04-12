import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import Container from "@/primitives/Container";
import { Fragment } from "react";
import PlaceholderHorizontal from "@/images/PlaceholderHorizontal.png";
import Image from "next/image";
import ForcedPageBreak from "@/primitives/ForcedPageBreak";
import FitteryApp from "@/images/FitteryApp.png";
import FitterySite from "@/images/FitterySite.png";
import Link from "next/link";

const experience = [
  {
    time: "2024 - 2025",
    company: "Quatt",
    title: "Freelance Software Engineer",
    body: (
      <>
        <p>
          Currently helping the Quatt Boss team to improve the overal team &
          software quality.
        </p>
      </>
    ),
  },
  {
    time: "2022 - 2025",
    company: "Fittery",
    title: "Tech lead & co-founder",
    body: (
      <>
        <p>
          At Fittery, we have built a consumer platform to book sports lessons.
          Trainers can sign up and offer the lessons on our platform. Their
          payment is handled using Stripe Connect. My responsibilities included
          everything technical, from the frontend to operations. During my time
          at Fittery, I onboarded & coached two developer interns.
        </p>
        <p>
          The platform is based on Django/Python for the backend. For the
          frontend we used Next.js/React on Vercel. As our styling solution we
          used Tailwind CSS. For the app store app, we used CapacitorJS to
          reduce our time to market. To share similar but different code between
          consumer app, consumer web and trainer web, we used a monorepo.
        </p>
        <p>
          Other technologies/services in use are DigitalOcean, PostgreSQL,
          Sentry, Redux, WagtailCMS.
        </p>
      </>
    ),
    images: (
      <figure className="flex gap-2 overflow-hidden">
        <Image src={FitteryApp} alt="" width={156} height={339} />
        <Image src={FitterySite} alt="" width={156} height={339} />
      </figure>
    ),
    pageBreak: true,
  },
  {
    time: "2021  - 2022",
    company: "Human Made",
    title: "Freelance software engineer",
    body: (
      <>
        <p>
          For Human Made, an international WordPress agency I worked on several
          different projects. Including a high traffic digital media platform
          based in Southeast Asia. As well as building the new Wikimedia website
          in the WordPress block editor. The projects at Human Made are some of
          the most complex WordPress projects I’ve worked on.
        </p>
      </>
    ),
    images: (
      <figure className="flex flex-col gap-2 overflow-hidden">
        {/* <Image src={PlaceholderHorizontal} alt="" width={320} height={200} />
        <Image src={PlaceholderHorizontal} alt="" width={320} height={200} /> */}
      </figure>
    ),
  },
  {
    time: "2020 - 2021",
    company: "Kunststofplatenshop.nl",
    title: "Freelance software engineer",
    body: (
      <>
        <p>
          For kunststofplatenshop.nl I was brought in to implement a way to
          order their products in non-rectangle shapes. The new shapes might
          include the shape of a star, circle or arrow. Later, these were
          expanded to sheet material in the form of text and an “upload your own
          design” feature. I implemented the full solution, included a backend
          that calculates the circumference and surface of these shapes. The
          frontend included two Vue projects, one for ordering the shapes and
          one for the factory where the workers would cut the sheets into the
          correct shapes.
        </p>
      </>
    ),
  },
  {
    time: "2015 - 2020",
    company: "Yoast",
    title: "Software architect",
    body: (
      <>
        <p>
          Responsible for software architecture at Yoast. Working directly with
          the C-level to create new platforms. I&apos;ve also released the Yoast
          SEO plugin to millions of users.
        </p>
        <p>
          My main hard skills here were PHP, React and WordPress. Other relevant
          skills were Software Architecture, Hiring, and Technical Leadership. I
          managed CI (Travis) and tooling (Webpack/Grunt/others).
        </p>
      </>
    ),
    images: (
      <figure className="flex flex-col gap-2 overflow-hidden">
        {/* <Image src={PlaceholderHorizontal} alt="" width={320} height={200} /> */}
        {/*<Image src={PlaceholderHorizontal} alt="" width={320} height={200} />*/}
        {/*<Image src={PlaceholderHorizontal} alt="" width={320} height={200} />*/}
      </figure>
    ),
  },
  {
    time: "2012 - 2015",
    company: "MixCom Media Group - Web developer",
    body: (
      <>
        <p>
          Web development work for diverse clients. I mainly worked to create
          WordPress sites, big and small. I introduced MixCom to the usage of
          Composer PHP for managing dependencies.
        </p>
        <p>
          Skill I used were PHP, JavaScript, WordPress, CSS, HTML, Backbone.js.
        </p>
      </>
    ),
  },
];

export default function Experience() {
  return (
    <BaseBlock>
      <Container className="space-y-10">
        <div className="lg:grid lg:grid-cols-[1fr_800px_1fr]">
          <BaseBlockHeading className="mx-auto max-w-[800px] px-6 lg:col-start-2 lg:mx-0 lg:px-0 print:px-0">
            <span>Experience</span>
          </BaseBlockHeading>
        </div>
        <div className="gap-10 xl:grid xl:grid-cols-[1fr_800px_1fr]">
          {experience.map(
            ({
              time,
              company,
              title,
              body,
              images = null,
              pageBreak = false,
            }) => {
              return (
                <Fragment key={company}>
                  <div className="mx-auto max-w-[800px] px-6 lg:mx-0 lg:max-w-none lg:px-0 print:mt-6 print:px-0 print:first:mt-0">
                    <div className="bg-accent w-[200px] rounded-full px-4 py-2 text-center font-bold print:w-[110px] print:px-2 print:py-0.5 print:text-sm print:font-semibold">
                      {time}
                    </div>
                  </div>
                  <div className="col-span-2 mx-auto flex max-w-[800px] gap-10 px-6 lg:mx-0 lg:max-w-none lg:px-0 print:mt-4 print:px-0">
                    <div className="flex max-w-2xl flex-col gap-2">
                      <h3 className="font-heading text-3xl">{company}</h3>
                      <p className="text-xl font-light">{title}</p>
                      {body}
                    </div>
                    {images && <aside className="print:hidden">{images}</aside>}
                  </div>
                  {pageBreak && <ForcedPageBreak />}
                </Fragment>
              );
            },
          )}
        </div>
        <div className="hidden text-xs print:block">
          A full list of my experience can be found on my LinkedIn profile:
          <Link href="https://www.linkedin.com/in/atimmer/">
            https://www.linkedin.com/in/atimmer/
          </Link>
        </div>
      </Container>
    </BaseBlock>
  );
}
