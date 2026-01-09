import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import Container from "@/primitives/Container";

export default function WayOfWorking() {
  return (
    <Container className="bg-dark text-white print:hidden">
      <BaseBlock className="max-w-[1100px] md:mx-auto">
        <BaseBlockHeading>Services for hire</BaseBlockHeading>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            {
              number: "01",
              title: "Project Lead",
              body: "Lead your product team, both on a human and technical level",
            },
            {
              number: "02",
              title: "Coaching & Teaching",
              body: "Level up your team, through one on one sessions or team workshops",
            },
            {
              number: "03",
              title: "Software Engineering",
              body: "Build a product from scratch, or modernize an existing codebase",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="bg-cyprus/80 flex h-full flex-col gap-4 rounded-3xl border border-white/10 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-brand text-sm font-semibold uppercase tracking-[0.3em]">
                  {service.number}
                </span>
                <span className="bg-brand/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Available
                </span>
              </div>
              <h3 className="font-heading text-3xl">{service.title}</h3>
              <p className="text-lg text-white/80">{service.body}</p>
            </div>
          ))}
        </div>
      </BaseBlock>
    </Container>
  );
}
