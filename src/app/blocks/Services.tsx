import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import Container from "@/primitives/Container";

export default function WayOfWorking() {
  return (
    <Container className="bg-dark pb-10 text-white print:hidden">
      <BaseBlock className="max-w-[800px] md:mx-auto">
        <BaseBlockHeading>Services for hire</BaseBlockHeading>
        <div className="mt-8 space-y-8">
          <div className="flex items-center gap-8">
            <div className="bg-brand flex h-12 w-12 items-center justify-center rounded-full p-4 text-center font-bold">
              1
            </div>
            <div className="mt-4">
              <h3 className="font-heading text-3xl">Project Lead</h3>
              <p className="mt-2 text-xl font-light tracking-tight">
                Lead your product team, both on a human and technical level
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="bg-brand flex h-12 w-12 items-center justify-center rounded-full p-4 text-center font-bold">
              2
            </div>
            <div className="mt-4">
              <h3 className="font-heading text-3xl">Coaching & Teaching</h3>
              <p className="mt-2 text-xl font-light tracking-tight">
                Level up your team, through one on one sessions or team
                workshops
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="bg-brand flex h-12 w-12 items-center justify-center rounded-full p-4 text-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-heading text-3xl">Software Engineering</h3>
              <p className="mt-2 text-xl font-light tracking-tight">
                Build a product from scratch, or modernize an existing codebase
              </p>
            </div>
          </div>
        </div>
      </BaseBlock>
    </Container>
  );
}
