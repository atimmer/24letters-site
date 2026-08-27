import Link from "next/link";
import { formatDate, getBlogPosts, type BlogPost } from "@/app/blog/utils";
import { ViewTransition } from "react";
import { postTitle, postDate } from "@/functions/view-transitions";

type BlogPostsProps = {
  posts?: BlogPost[];
};

export async function BlogPosts({ posts }: BlogPostsProps = {}) {
  const allBlogs = posts ?? (await getBlogPosts());

  return <BlogPostList posts={allBlogs} />;
}

export function BlogPostList({ posts }: { posts: BlogPost[] }) {
  return (
    <div>
      {posts.map((post) => (
        <Link
          key={post.slug}
          className="mb-4 flex flex-col space-y-1"
          href={`/blog/${post.slug}`}
        >
          <div className="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
            {post.metadata.publishedAt ? (
              <ViewTransition name={postDate(post.slug)}>
                <p className="w-[100px] text-neutral-600 tabular-nums dark:text-neutral-400">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
              </ViewTransition>
            ) : null}
            <p className="tracking-tight text-neutral-900 dark:text-neutral-100">
              <ViewTransition name={postTitle(post.slug)}>
                <span>{post.metadata.title}</span>
              </ViewTransition>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
