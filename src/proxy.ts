import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCachedBlogPosts } from "@/app/blog/utils";

export async function proxy(request: NextRequest): Promise<Response> {
  const requestedPath = request.nextUrl.pathname.slice("/blog/".length);
  const posts = await getCachedBlogPosts();

  if (posts.some((post) => post.slug === requestedPath)) {
    return NextResponse.next();
  }

  const leafletPost = posts.find(
    (post) =>
      post.source === "leaflet" && post.recordKey === requestedPath,
  );

  if (!leafletPost) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 301,
    headers: {
      Location: new URL(
        `/blog/${encodeURIComponent(leafletPost.slug)}`,
        request.url,
      ).toString(),
    },
  });
}

export const config = {
  matcher: "/blog/:path+",
};
