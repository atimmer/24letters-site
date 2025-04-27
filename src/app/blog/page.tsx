import { BlogPosts } from "@/components/posts";
import Container from "@/primitives/Container";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  return (
    <Container as="section" className="py-12" padMobile>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">My Blog</h1>
      <BlogPosts />
    </Container>
  );
}
