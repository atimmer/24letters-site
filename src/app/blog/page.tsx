import { getCachedBlogPosts } from "@/app/blog/utils";
import { BlogPostList } from "@/components/posts";
import Container from "@/primitives/Container";

// Network-backed Leaflet/Convex reads use five-minute time-based ISR.
export const revalidate = 300;

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default async function Page() {
  const posts = await getCachedBlogPosts();

  return (
    <Container as="section" className="py-12" padMobile>
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          My Blog
        </h1>
        <BlogPostList posts={posts} />
      </div>
    </Container>
  );
}
