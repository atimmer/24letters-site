import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getFrozenSlugByRecordKey } from "@/app/blog/leaflet";
import { RESERVED_MDX_SLUGS } from "../convex/slugRules";

export async function proxy(request: NextRequest): Promise<Response> {
  const requestedPath = request.nextUrl.pathname.slice("/blog/".length);

  if (RESERVED_MDX_SLUGS.has(requestedPath)) {
    return NextResponse.next();
  }

  try {
    const slug = await getFrozenSlugByRecordKey(requestedPath);

    if (!slug || slug === requestedPath) {
      return NextResponse.next();
    }

    return new Response(null, {
      status: 301,
      headers: {
        Location: new URL(
          `/blog/${encodeURIComponent(slug)}`,
          request.url,
        ).toString(),
      },
    });
  } catch (error) {
    console.error(
      "Unable to resolve a Leaflet record key; failing open.",
      error,
    );
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/blog/:path+",
};
