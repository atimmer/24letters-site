import Container from "@/primitives/Container";

export default function NotFound() {
  return (
    <Container as="section" className="py-20">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        404 - Page Not Found
      </h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
    </Container>
  );
}
