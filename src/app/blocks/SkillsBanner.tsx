import Container from "@/primitives/Container";

const skills = [
  "Tech lead",
  "React",
  "Next.js",
  "Coaching",
  "Tailwind CSS",
  "PHP",
  "WordPress",
  "Project lead",
];

export default function SkillsBanner() {
  return (
    <aside className="bg-dark relative overflow-x-scroll px-4 pr-8 font-heading text-3xl text-white lg:overflow-x-auto lg:px-0">
      <Container className="flex justify-between gap-6 text-nowrap py-6">
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </Container>
    </aside>
  );
}
