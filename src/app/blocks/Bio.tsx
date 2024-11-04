import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";

export default function Bio() {
  return (
    <BaseBlock className="max-w-[800px] md:mx-auto">
      <BaseBlockHeading>About</BaseBlockHeading>
      <p className="mt-6">
        Creating software that solves real world problems is what I do.
        Communicating about those solutions is what I love. Humans are more
        important than software.
      </p>
      <p className="mt-4">
        It is my belief that people’s lives can be improved tremendously by
        creating the right software.
      </p>
      <p className="mt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </BaseBlock>
  );
  return <section className="py-10">Bio</section>;
}
