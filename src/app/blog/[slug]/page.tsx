import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts } from "../utils";
import { baseUrl } from "@/app/sitemap";
import Container from "@/primitives/Container";
import { ViewTransition } from "react";
import { postTitle, postDate } from "@/functions/view-transitions";

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;

  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return notFound();
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
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

  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

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
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
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
              {formatDate(post.metadata.publishedAt)}
            </p>
          </ViewTransition>
        </div>
        <article className="prose">
          <CustomMDX source={post.content} />
        </article>
      </div>
    </Container>
  );
}
