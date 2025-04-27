import Container from "@/primitives/Container";

const skills = [
  "Lead Engineer",
  "React",
  "Next.js",
  "Coaching",
  "Tailwind CSS",
  "TypeScript",
  "WordPress",
];

export default function SkillsBanner() {
  return (
    <aside className="bg-dark font-heading relative overflow-x-scroll px-4 pr-8 text-3xl text-white lg:overflow-x-auto xl:px-0 print:text-lg">
      <Container className="flex justify-between gap-6 py-6 text-nowrap print:py-2">
        {skills.map((skill) => (
          <span key={skill} className="print:last:hidden">
            {skill}
          </span>
        ))}
      </Container>
    </aside>
  );
}
