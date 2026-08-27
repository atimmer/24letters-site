import { fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export const BLOG_REVALIDATE_SECONDS = 300;
export const PDS_HOST = "https://shiitake.us-east.host.bsky.network";
export const REPOSITORY_DID = "did:plc:ucgyl53umtlpjplm5vugutbi";
export const PUBLICATION_AT_URI =
  "at://did:plc:ucgyl53umtlpjplm5vugutbi/site.standard.publication/3mt26vqnmes2f";

const DOCUMENT_COLLECTION = "site.standard.document";

export type LeafletDocument = {
  cid: string;
  recordKey: string;
  uri: string;
  value: {
    content?: unknown;
    description?: string;
    publishedAt?: string;
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

function parseDocument(value: unknown): LeafletDocument | null {
  if (!isRecord(value) || typeof value.uri !== "string") return null;
  if (typeof value.cid !== "string" || !isRecord(value.value)) return null;

  const document = value.value;
  if (typeof document.site !== "string" || typeof document.title !== "string") {
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
      description:
        typeof document.description === "string"
          ? document.description
          : undefined,
      publishedAt:
        typeof document.publishedAt === "string"
          ? document.publishedAt
          : undefined,
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

export type AssignSlug = (recordKey: string, title: string) => Promise<string>;

export const assignFrozenSlug: AssignSlug = (recordKey, title) =>
  fetchMutation(api.postSlugs.getOrCreate, { recordKey, title });
