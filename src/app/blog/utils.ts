import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";
import {
  assignFrozenSlug,
  blobUrl,
  type AssignSlug,
  type FetchRecords,
  listPublicationDocuments,
} from "./leaflet";

export type BlogMetadata = {
  title: string;
  modifiedAt?: string;
  publishedAt?: string;
  isDraft?: boolean;
  summary?: string;
  image?: string;
};

export type BlogPost =
  | {
      content: string;
      metadata: BlogMetadata & { publishedAt: string };
      slug: string;
      source: "mdx";
    }
  | {
      content: unknown;
      metadata: BlogMetadata;
      recordKey: string;
      slug: string;
      source: "leaflet";
    };

function parseFrontmatter(fileContent: string) {
  const parsed = matter(fileContent);

  return {
    metadata: parsed.data as BlogMetadata & { publishedAt: string },
    content: parsed.content,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
      source: "mdx" as const,
    };
  });
}

export function getMDXPosts(): BlogPost[] {
  let posts = getMDXData(path.join(process.cwd(), "posts"));

  if (process.env.NODE_ENV !== "development") {
    posts = posts.filter((post) => {
      const isDraft = post.metadata.isDraft ?? false;

      return !isDraft;
    });
  }

  return posts;
}

export function sortBlogPosts(posts: BlogPost[]): BlogPost[] {
  return posts.toSorted((left, right) => {
    const leftTime = left.metadata.publishedAt
      ? Date.parse(left.metadata.publishedAt)
      : Number.NEGATIVE_INFINITY;
    const rightTime = right.metadata.publishedAt
      ? Date.parse(right.metadata.publishedAt)
      : Number.NEGATIVE_INFINITY;
    const dateDifference = rightTime - leftTime;

    return dateDifference || left.slug.localeCompare(right.slug);
  });
}

export async function getLeafletPosts(
  fetchRecords: FetchRecords = fetch,
  assignSlug: AssignSlug = assignFrozenSlug,
): Promise<BlogPost[]> {
  const documents = await listPublicationDocuments(fetchRecords);

  return Promise.all(
    documents.map(async (document) => ({
      content: document.value.content,
      metadata: {
        image: document.value.coverImage
          ? blobUrl(document.value.coverImage)
          : undefined,
        modifiedAt: document.value.modifiedAt ?? document.value.publishedAt,
        title: document.value.title,
        publishedAt: document.value.publishedAt,
        summary: document.value.description || undefined,
      },
      recordKey: document.recordKey,
      slug: await assignSlug(document.recordKey, document.value.title),
      source: "leaflet" as const,
    })),
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const mdxPosts = getMDXPosts();
  let leafletPosts: BlogPost[];

  try {
    leafletPosts = await getLeafletPosts();
  } catch (error) {
    console.error(
      "Unable to load Leaflet posts; continuing with MDX posts only.",
      error,
    );
    leafletPosts = [];
  }

  return sortBlogPosts([...mdxPosts, ...leafletPosts]);
}

export const getCachedBlogPosts = unstable_cache(getBlogPosts, ["blog-posts"], {
  revalidate: 300,
});

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
