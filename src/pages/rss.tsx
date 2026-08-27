import { getCachedBlogPosts } from "@/app/blog/utils";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { buildRssFeed, RSS_CACHE_CONTROL } = await import("@/lib/rss");
  const rssFeed = await buildRssFeed(await getCachedBlogPosts());

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", RSS_CACHE_CONTROL);
  res.end(rssFeed);

  return { props: {} };
};

export default function Rss() {
  return null;
}
