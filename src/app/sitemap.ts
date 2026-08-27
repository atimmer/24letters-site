import { getBlogPosts } from "@/app/blog/utils";
import { SITE_ORIGIN } from "@/lib/site";

export const baseUrl = SITE_ORIGIN;

export default async function sitemap() {
  const blogs = (await getBlogPosts())
    .filter((post) => post.source === "mdx")
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    }));

  const routes = ["", "/blog", "/tools"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
