import Link from "next/link";
import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { ViewTransition } from "react";
import { postTitle, postDate } from "@/functions/view-transitions";

export function BlogPosts() {
  const allBlogs = getBlogPosts();

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="mb-4 flex flex-col space-y-1"
            href={`/blog/${post.slug}`}
          >
            <div className="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
              <ViewTransition name={postDate(post.slug)}>
                <p className="w-[100px] text-neutral-600 tabular-nums dark:text-neutral-400">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
              </ViewTransition>
              <ViewTransition name={postTitle(post.slug)}>
                <p className="tracking-tight text-neutral-900 dark:text-neutral-100">
                  {post.metadata.title}
                </p>
              </ViewTransition>
            </div>
          </Link>
        ))}
    </div>
  );
}
