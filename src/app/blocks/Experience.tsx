import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import Container from "@/primitives/Container";
import { Fragment } from "react";
import PlaceholderVertical from "@/images/PlaceholderVertical.png";
import PlaceholderHorizontal from "@/images/PlaceholderHorizontal.png";
import Image from "next/image";

const experience = [
  {
    time: "2021 - 2024",
    company: "Fittery",
    body: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </>
    ),
    images: (
      <figure className="flex gap-2 overflow-hidden">
        <Image src={PlaceholderVertical} alt="" width={156} height={256} />
        <Image src={PlaceholderVertical} alt="" width={156} height={256} />
      </figure>
    ),
  },
  {
    time: "2020",
    company: "Onzehuisstijl",
    body: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </>
    ),
    images: (
      <figure className="flex flex-col gap-2 overflow-hidden">
        <Image src={PlaceholderHorizontal} alt="" width={320} height={200} />
        <Image src={PlaceholderHorizontal} alt="" width={320} height={200} />
      </figure>
    ),
  },
  {
    time: "2015 - 2020",
    company: "Yoast",
    body: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </>
    ),
    images: (
      <figure className="flex flex-col gap-2 overflow-hidden">
        <Image src={PlaceholderHorizontal} alt="" width={320} height={200} />
        <Image src={PlaceholderHorizontal} alt="" width={320} height={200} />
        <Image src={PlaceholderHorizontal} alt="" width={320} height={200} />
      </figure>
    ),
  },
];

export default function Experience() {
  return (
    <BaseBlock>
      <Container className="space-y-10">
        <div className="lg:grid lg:grid-cols-[1fr_800px_1fr]">
          <BaseBlockHeading className="mx-auto max-w-[800px] px-6 lg:col-start-2 lg:mx-0 lg:px-0">
            Experience
          </BaseBlockHeading>
        </div>
        <div className="gap-10 xl:grid xl:grid-cols-[1fr_800px_1fr]">
          {experience.map(({ time, company, body, images = null }) => {
            return (
              <Fragment key={company}>
                <div className="mx-auto max-w-[800px] px-6 lg:mx-0 lg:max-w-none lg:px-0">
                  <div className="bg-accent w-[200px] rounded-full px-4 py-2 text-center font-bold">
                    {time}
                  </div>
                </div>
                <div className="col-span-2 mx-auto flex max-w-[800px] gap-10 px-6 lg:mx-0 lg:max-w-none lg:px-0">
                  <div className="flex max-w-2xl flex-col gap-4">
                    <h3 className="font-heading text-3xl">{company}</h3>
                    {body}
                  </div>
                  {images && <aside>{images}</aside>}
                </div>
              </Fragment>
            );
          })}
        </div>
      </Container>
    </BaseBlock>
  );
}
