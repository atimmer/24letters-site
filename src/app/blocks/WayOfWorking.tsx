import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import Container from "@/primitives/Container";

export default function WayOfWorking() {
  return (
    <Container className="bg-dark print:hidden">
      <BaseBlock className="max-w-[800px] text-white md:mx-auto">
        <BaseBlockHeading>How I work</BaseBlockHeading>
        <p className="mt-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </BaseBlock>
    </Container>
  );
}
