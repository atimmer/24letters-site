import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getCachedBlogPosts, getMDXPosts } from "../utils";
import Container from "@/primitives/Container";
import { ViewTransition } from "react";
import { postTitle, postDate } from "@/functions/view-transitions";
import { LeafletContent } from "../leaflet-renderer";
import { canonicalBlogUrl, SITE_ORIGIN } from "@/lib/site";

// Next.js requires this segment config value to be statically analyzable.
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = getMDXPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function absoluteUrl(url: string): string {
  return new URL(url, SITE_ORIGIN).toString();
}

async function findPost(slug: string) {
  return (await getCachedBlogPosts()).find((post) => post.slug === slug);
}

export async function generateMetadata({
  params: paramsPromise,
}: PageProps): Promise<Metadata> {
  const params = await paramsPromise;

  const post = await findPost(params.slug);
  if (!post) {
    return notFound();
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const canonical = canonicalBlogUrl(post.slug);
  const ogImage = image
    ? absoluteUrl(image)
    : `${SITE_ORIGIN}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: canonical,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;

  const post = await findPost(params.slug);

  if (!post) {
    notFound();
  }

  const canonical = canonicalBlogUrl(post.slug);
  const shareImage = post.metadata.image
    ? absoluteUrl(post.metadata.image)
    : `${SITE_ORIGIN}/og?title=${encodeURIComponent(post.metadata.title)}`;
  const postBody =
    post.source === "mdx" ? (
      <CustomMDX source={post.content} />
    ) : (
      await LeafletContent({ content: post.content })
    );

  return (
    <Container as="section" className="py-12" padMobile>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: shareImage,
            url: canonical,
            author: {
              "@type": "Person",
              name: "My Portfolio",
            },
          }),
        }}
      />
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="title text-2xl font-semibold tracking-tighter">
          <ViewTransition name={postTitle(post.slug)}>
            <span>{post.metadata.title}</span>
          </ViewTransition>
        </h1>
        <div className="mt-2 mb-8 flex items-center justify-between text-sm">
          <ViewTransition name={postDate(post.slug)}>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {post.metadata.publishedAt
                ? formatDate(post.metadata.publishedAt)
                : null}
            </p>
          </ViewTransition>
        </div>
        {post.source === "leaflet" && post.metadata.summary ? (
          <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
            {post.metadata.summary}
          </p>
        ) : null}
        <article className="prose">{postBody}</article>
      </div>
    </Container>
  );
}
