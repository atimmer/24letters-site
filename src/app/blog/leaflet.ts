import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export const BLOG_REVALIDATE_SECONDS = 300;
export const PDS_HOST =
  process.env.LEAFLET_PDS_HOST ?? "https://shiitake.us-east.host.bsky.network";
export const REPOSITORY_DID = "did:plc:ucgyl53umtlpjplm5vugutbi";
export const PUBLICATION_AT_URI =
  "at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.publication/3mt26vqnmes2f";

const DOCUMENT_COLLECTION = "site.standard.document";

export type AtprotoBlob = {
  $type: "blob";
  mimeType: string;
  ref: { $link: string };
  size: number;
};

export type LeafletDocument = {
  cid: string;
  recordKey: string;
  uri: string;
  value: {
    content?: unknown;
    coverImage?: AtprotoBlob;
    description?: string;
    modifiedAt?: string;
    publishedAt: string;
    site: string;
    title: string;
  };
};

export type FetchRecords = (
  input: string | URL | Request,
  init?: RequestInit & {
    next?: { revalidate: number };
  },
) => Promise<Response>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isAtprotoBlob(value: unknown): value is AtprotoBlob {
  if (!isRecord(value) || value.$type !== "blob") return false;
  if (!isRecord(value.ref) || typeof value.ref.$link !== "string") {
    return false;
  }

  return (
    typeof value.mimeType === "string" &&
    typeof value.size === "number" &&
    Number.isInteger(value.size) &&
    value.size >= 0
  );
}

export function blobUrl(blob: AtprotoBlob): string {
  const url = new URL("/xrpc/com.atproto.sync.getBlob", PDS_HOST);
  url.searchParams.set("did", REPOSITORY_DID);
  url.searchParams.set("cid", blob.ref.$link);
  return url.toString();
}

function parseDocument(value: unknown): LeafletDocument | null {
  if (!isRecord(value) || typeof value.uri !== "string") return null;
  if (typeof value.cid !== "string" || !isRecord(value.value)) return null;

  const document = value.value;
  if (
    typeof document.site !== "string" ||
    typeof document.title !== "string" ||
    typeof document.publishedAt !== "string"
  ) {
    return null;
  }

  const recordKey = value.uri.split("/").at(-1);
  if (!recordKey) return null;

  return {
    cid: value.cid,
    recordKey,
    uri: value.uri,
    value: {
      content: document.content,
      coverImage: isAtprotoBlob(document.coverImage)
        ? document.coverImage
        : undefined,
      description:
        typeof document.description === "string"
          ? document.description
          : undefined,
      modifiedAt:
        typeof document.updatedAt === "string"
          ? document.updatedAt
          : typeof document.modifiedAt === "string"
            ? document.modifiedAt
            : undefined,
      publishedAt: document.publishedAt,
      site: document.site,
      title: document.title,
    },
  };
}

function parsePage(value: unknown): {
  cursor?: string;
  records: LeafletDocument[];
} {
  if (!isRecord(value) || !Array.isArray(value.records)) {
    throw new Error("The PDS returned an invalid listRecords response");
  }

  return {
    cursor: typeof value.cursor === "string" ? value.cursor : undefined,
    records: value.records
      .map(parseDocument)
      .filter((record): record is LeafletDocument => record !== null),
  };
}

export async function listPublicationDocuments(
  fetchRecords: FetchRecords = fetch,
): Promise<LeafletDocument[]> {
  const documents: LeafletDocument[] = [];
  let cursor: string | undefined;
  const seenCursors = new Set<string>();

  do {
    const url = new URL("/xrpc/com.atproto.repo.listRecords", PDS_HOST);
    url.searchParams.set("repo", REPOSITORY_DID);
    url.searchParams.set("collection", DOCUMENT_COLLECTION);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await fetchRecords(url, {
      next: { revalidate: BLOG_REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      throw new Error(
        `The PDS listRecords request failed (${response.status})`,
      );
    }

    const page = parsePage(await response.json());
    documents.push(
      ...page.records.filter(
        (document) => document.value.site === PUBLICATION_AT_URI,
      ),
    );

    cursor = page.cursor;
    if (cursor && seenCursors.has(cursor)) {
      throw new Error("The PDS returned the same pagination cursor twice");
    }
    if (cursor) seenCursors.add(cursor);
  } while (cursor);

  return documents;
}

export type AssignSlug = (
  recordKey: string,
  title: string,
  reservedSlugs: string[],
) => Promise<string>;

function postSlugSecret(): string {
  const secret = process.env.POST_SLUG_SECRET;
  if (!secret) throw new Error("POST_SLUG_SECRET is not configured");
  return secret;
}

export const assignFrozenSlug: AssignSlug = (recordKey, title, reservedSlugs) =>
  fetchMutation(api.postSlugs.getOrCreate, {
    recordKey,
    reservedSlugs,
    secret: postSlugSecret(),
    title,
  });

export function getFrozenSlugByRecordKey(
  recordKey: string,
): Promise<string | null> {
  return fetchQuery(api.postSlugs.getByRecordKey, { recordKey });
}
