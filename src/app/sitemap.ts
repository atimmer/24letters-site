import { getCachedBlogPosts } from "@/app/blog/utils";
import { SITE_ORIGIN } from "@/lib/site";
import type { MetadataRoute } from "next";

export const baseUrl = SITE_ORIGIN;
export const dynamic = "force-static";
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = (await getCachedBlogPosts()).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.modifiedAt ?? post.metadata.publishedAt,
  }));

  const routes = ["", "/blog", "/tools"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
