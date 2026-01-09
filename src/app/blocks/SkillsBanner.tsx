import Container from "@/primitives/Container";

const skills = [
  "Mentoring",
  "React",
  "Next.js",
  "Lead Engineer",
  "Tailwind CSS",
  "TypeScript",
  "WordPress",
];

export default function SkillsBanner() {
  return (
    <aside className="bg-dark font-heading relative overflow-x-scroll border-y border-white/10 px-4 pr-8 text-2xl text-white lg:overflow-x-auto xl:px-0 print:text-lg">
      <Container className="flex items-center justify-between gap-6 py-5 text-nowrap print:py-2">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-6 text-white/85"
          >
            <span className="bg-brand/20 rounded-full px-4 py-2 text-base tracking-[0.18em] text-white uppercase">
              {skill}
            </span>
            <span className="bg-white/20 h-2 w-2 rounded-full"></span>
          </div>
        ))}
      </Container>
    </aside>
  );
}
