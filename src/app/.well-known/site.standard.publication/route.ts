import { PUBLICATION_AT_URI } from "@/app/blog/leaflet";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(PUBLICATION_AT_URI, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
