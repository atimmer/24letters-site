import Image from "next/image";
import React, { type CSSProperties, type ReactNode } from "react";
import { highlight } from "@/lib/shiki";
import { blobUrl, isAtprotoBlob, type AtprotoBlob } from "./leaflet";

// These shapes mirror Leaflet's lexicons at commit e3a01bd. Network values
// remain unknown until the field-by-field parsers below validate them.
type ByteSlice = { byteStart: number; byteEnd: number };
type RgbColor = { r: number; g: number; b: number; a?: number };

type RichTextFeature =
  | { $type: "pub.leaflet.richtext.facet#bold" }
  | { $type: "pub.leaflet.richtext.facet#italic" }
  | { $type: "pub.leaflet.richtext.facet#underline" }
  | { $type: "pub.leaflet.richtext.facet#strikethrough" }
  | { $type: "pub.leaflet.richtext.facet#code" }
  | { $type: "pub.leaflet.richtext.facet#highlight"; color?: RgbColor }
  | { $type: "pub.leaflet.richtext.facet#link"; uri: string };

type RichTextFacet = { index: ByteSlice; features: RichTextFeature[] };
type RichTextBlock = { plaintext: string; facets?: RichTextFacet[] };
type AspectRatio = { width: number; height: number };
type ImageBlock = {
  $type: "pub.leaflet.blocks.image";
  image: AtprotoBlob;
  aspectRatio: AspectRatio;
  alt?: string;
  fullBleed?: boolean;
  width?: number;
};
type GalleryImage = {
  image: AtprotoBlob;
  aspectRatio: AspectRatio;
  alt?: string;
};
type ListItem = {
  content: unknown;
  checked?: boolean;
  children?: ListItem[];
  orderedListChildren?: OrderedListBlock;
  unorderedListChildren?: UnorderedListBlock;
};
type OrderedListBlock = {
  $type: "pub.leaflet.blocks.orderedList";
  children: ListItem[];
  startIndex?: number;
};
type UnorderedListBlock = {
  $type: "pub.leaflet.blocks.unorderedList";
  children: ListItem[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function positiveInteger(value: unknown): value is number {
  return finiteNumber(value) && Number.isInteger(value) && value > 0;
}

function parseColor(value: unknown): RgbColor | undefined {
  if (!isRecord(value)) return undefined;
  const { r, g, b, a } = value;
  if (!finiteNumber(r) || !finiteNumber(g) || !finiteNumber(b)) {
    return undefined;
  }
  if (a !== undefined && !finiteNumber(a)) return undefined;
  if (
    ![r, g, b].every(
      (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255,
    ) ||
    (a !== undefined && (!Number.isInteger(a) || a < 0 || a > 100))
  ) {
    return undefined;
  }
  return {
    r,
    g,
    b,
    ...(finiteNumber(a) ? { a } : {}),
  };
}

function parseFeature(value: unknown): RichTextFeature | null {
  if (!isRecord(value) || typeof value.$type !== "string") return null;
  switch (value.$type) {
    case "pub.leaflet.richtext.facet#bold":
    case "pub.leaflet.richtext.facet#italic":
    case "pub.leaflet.richtext.facet#underline":
    case "pub.leaflet.richtext.facet#strikethrough":
    case "pub.leaflet.richtext.facet#code":
      return { $type: value.$type };
    case "pub.leaflet.richtext.facet#highlight":
      const color = parseColor(value.color);
      return {
        $type: value.$type,
        ...(color ? { color } : {}),
      };
    case "pub.leaflet.richtext.facet#link":
      return typeof value.uri === "string"
        ? { $type: value.$type, uri: value.uri }
        : null;
    default:
      return null;
  }
}

function parseFacets(value: unknown): RichTextFacet[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const facets: RichTextFacet[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate) || !isRecord(candidate.index)) continue;
    const { byteStart, byteEnd } = candidate.index;
    if (
      typeof byteStart !== "number" ||
      typeof byteEnd !== "number" ||
      !Number.isInteger(byteStart) ||
      !Number.isInteger(byteEnd)
    ) {
      continue;
    }
    if (!Array.isArray(candidate.features)) continue;
    const features = candidate.features
      .map(parseFeature)
      .filter((feature): feature is RichTextFeature => feature !== null);
    if (features.length > 0 && byteStart >= 0 && byteEnd > byteStart) {
      facets.push({ index: { byteStart, byteEnd }, features });
    }
  }
  return facets;
}

function parseRichText(value: Record<string, unknown>): RichTextBlock | null {
  if (typeof value.plaintext !== "string") return null;
  const facets = parseFacets(value.facets);
  return { plaintext: value.plaintext, ...(facets ? { facets } : {}) };
}

function safeHref(uri: string): string | undefined {
  if (uri.startsWith("/") || uri.startsWith("#")) return uri;
  try {
    const url = new URL(uri);
    return ["http:", "https:", "mailto:"].includes(url.protocol)
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function highlightStyle(color?: RgbColor): CSSProperties | undefined {
  if (!color) return undefined;
  const alpha = color.a === undefined ? 1 : color.a / 100;
  return {
    backgroundColor: `rgb(${color.r} ${color.g} ${color.b} / ${alpha})`,
  };
}

function wrapFeature(node: ReactNode, feature: RichTextFeature, key: string) {
  switch (feature.$type) {
    case "pub.leaflet.richtext.facet#bold":
      return <strong key={key}>{node}</strong>;
    case "pub.leaflet.richtext.facet#italic":
      return <em key={key}>{node}</em>;
    case "pub.leaflet.richtext.facet#underline":
      return <u key={key}>{node}</u>;
    case "pub.leaflet.richtext.facet#strikethrough":
      return <s key={key}>{node}</s>;
    case "pub.leaflet.richtext.facet#code":
      return <code key={key}>{node}</code>;
    case "pub.leaflet.richtext.facet#highlight":
      return (
        <mark key={key} style={highlightStyle(feature.color)}>
          {node}
        </mark>
      );
    case "pub.leaflet.richtext.facet#link": {
      const href = safeHref(feature.uri);
      return href ? (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {node}
        </a>
      ) : (
        node
      );
    }
  }
}

export function RichText({ plaintext, facets = [] }: RichTextBlock) {
  const bytes = new TextEncoder().encode(plaintext);
  const validFacets = facets.filter(
    ({ index }) => index.byteStart >= 0 && index.byteEnd <= bytes.length,
  );
  const boundaries = new Set([0, bytes.length]);
  validFacets.forEach(({ index }) => {
    boundaries.add(index.byteStart);
    boundaries.add(index.byteEnd);
  });
  const offsets = [...boundaries].toSorted((left, right) => left - right);
  const decoder = new TextDecoder();

  return offsets.slice(0, -1).map((start, segmentIndex) => {
    const end = offsets[segmentIndex + 1];
    let node: ReactNode = decoder.decode(bytes.slice(start, end));
    const features = validFacets.flatMap((facet) =>
      facet.index.byteStart <= start && facet.index.byteEnd >= end
        ? facet.features
        : [],
    );
    features.forEach((feature, featureIndex) => {
      node = wrapFeature(node, feature, `${segmentIndex}-${featureIndex}`);
    });
    return <React.Fragment key={`${start}-${end}`}>{node}</React.Fragment>;
  });
}

function parseAspectRatio(value: unknown): AspectRatio | null {
  if (!isRecord(value)) return null;
  return positiveInteger(value.width) && positiveInteger(value.height)
    ? { width: value.width, height: value.height }
    : null;
}

function parseImage(value: Record<string, unknown>): ImageBlock | null {
  const aspectRatio = parseAspectRatio(value.aspectRatio);
  if (!isAtprotoBlob(value.image) || !aspectRatio) return null;
  return {
    $type: "pub.leaflet.blocks.image",
    image: value.image,
    aspectRatio,
    ...(typeof value.alt === "string" ? { alt: value.alt } : {}),
    ...(typeof value.fullBleed === "boolean"
      ? { fullBleed: value.fullBleed }
      : {}),
    ...(positiveInteger(value.width) ? { width: value.width } : {}),
  };
}

function parseGalleryImage(value: unknown): GalleryImage | null {
  if (!isRecord(value)) return null;
  const aspectRatio = parseAspectRatio(value.aspectRatio);
  if (!isAtprotoBlob(value.image) || !aspectRatio) return null;
  return {
    image: value.image,
    aspectRatio,
    ...(typeof value.alt === "string" ? { alt: value.alt } : {}),
  };
}

function LeafletImage({ image }: { image: ImageBlock | GalleryImage }) {
  return (
    <Image
      src={blobUrl(image.image)}
      alt={image.alt ?? ""}
      width={image.aspectRatio.width}
      height={image.aspectRatio.height}
      className="h-auto rounded-lg"
      sizes="(max-width: 768px) 100vw, 656px"
      style={"width" in image && image.width ? { maxWidth: image.width } : {}}
    />
  );
}

function parseListItems(value: unknown): ListItem[] | null {
  if (!Array.isArray(value)) return null;
  const items: ListItem[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate) || candidate.content === undefined) return null;
    const children = parseListItems(candidate.children);
    const orderedListChildren = parseOrderedList(candidate.orderedListChildren);
    const unorderedListChildren = parseUnorderedList(
      candidate.unorderedListChildren,
    );
    items.push({
      content: candidate.content,
      ...(typeof candidate.checked === "boolean"
        ? { checked: candidate.checked }
        : {}),
      ...(children ? { children } : {}),
      ...(orderedListChildren ? { orderedListChildren } : {}),
      ...(unorderedListChildren ? { unorderedListChildren } : {}),
    });
  }
  return items;
}

function parseOrderedList(value: unknown): OrderedListBlock | null {
  if (!isRecord(value) || value.$type !== "pub.leaflet.blocks.orderedList") {
    return null;
  }
  const children = parseListItems(value.children);
  if (!children) return null;
  return {
    $type: value.$type,
    children,
    ...(positiveInteger(value.startIndex)
      ? { startIndex: value.startIndex }
      : {}),
  };
}

function parseUnorderedList(value: unknown): UnorderedListBlock | null {
  if (!isRecord(value) || value.$type !== "pub.leaflet.blocks.unorderedList") {
    return null;
  }
  const children = parseListItems(value.children);
  return children ? { $type: value.$type, children } : null;
}

function InlineListContent({ value }: { value: unknown }) {
  if (!isRecord(value) || typeof value.$type !== "string") {
    return <UnsupportedBlock type="invalid list item" />;
  }
  if (
    value.$type === "pub.leaflet.blocks.text" ||
    value.$type === "pub.leaflet.blocks.header"
  ) {
    const richText = parseRichText(value);
    return richText ? (
      <RichText {...richText} />
    ) : (
      <UnsupportedBlock type={value.$type} />
    );
  }
  if (value.$type === "pub.leaflet.blocks.image") {
    const image = parseImage(value);
    return image ? (
      <LeafletImage image={image} />
    ) : (
      <UnsupportedBlock type={value.$type} />
    );
  }
  return <UnsupportedBlock type={value.$type} />;
}

function ListChildren({
  items,
  ordered,
}: {
  items: ListItem[];
  ordered: boolean;
}) {
  return items.map((item, index) => (
    <li key={index}>
      {item.checked === undefined ? null : (
        <input
          type="checkbox"
          checked={item.checked}
          readOnly
          aria-label="Checklist item"
        />
      )}{" "}
      <InlineListContent value={item.content} />
      {item.children ? (
        <ListItems items={item.children} ordered={ordered} />
      ) : null}
      {!item.children && item.orderedListChildren ? (
        <ListItems items={item.orderedListChildren.children} ordered />
      ) : null}
      {!item.children && item.unorderedListChildren ? (
        <ListItems
          items={item.unorderedListChildren.children}
          ordered={false}
        />
      ) : null}
    </li>
  ));
}

function ListItems({
  items,
  ordered,
  start,
}: {
  items: ListItem[];
  ordered: boolean;
  start?: number;
}) {
  const content = <ListChildren items={items} ordered={ordered} />;
  return ordered ? <ol start={start}>{content}</ol> : <ul>{content}</ul>;
}

export function UnsupportedBlock({ type }: { type: string }) {
  return (
    <aside className="not-prose my-6 rounded-lg border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
      Unsupported Leaflet block: <code>{type}</code>
    </aside>
  );
}

function blockType(value: unknown): string {
  return isRecord(value) && typeof value.$type === "string"
    ? value.$type
    : "unknown";
}

async function renderBlock(value: unknown, key: string): Promise<ReactNode> {
  if (!isRecord(value) || typeof value.$type !== "string") {
    return <UnsupportedBlock key={key} type="unknown" />;
  }
  const richText = parseRichText(value);
  switch (value.$type) {
    case "pub.leaflet.blocks.text":
      return richText ? (
        <p key={key} className="whitespace-pre-wrap">
          <RichText {...richText} />
        </p>
      ) : (
        <UnsupportedBlock key={key} type={value.$type} />
      );
    case "pub.leaflet.blocks.header": {
      if (!richText) return <UnsupportedBlock key={key} type={value.$type} />;
      const level =
        positiveInteger(value.level) && value.level <= 6 ? value.level : 2;
      return React.createElement(
        `h${level}`,
        { key },
        <RichText {...richText} />,
      );
    }
    case "pub.leaflet.blocks.blockquote":
      return richText ? (
        <blockquote key={key}>
          <RichText {...richText} />
        </blockquote>
      ) : (
        <UnsupportedBlock key={key} type={value.$type} />
      );
    case "pub.leaflet.blocks.orderedList": {
      const list = parseOrderedList(value);
      return list ? (
        <ListItems
          key={key}
          items={list.children}
          ordered
          start={list.startIndex}
        />
      ) : (
        <UnsupportedBlock key={key} type={value.$type} />
      );
    }
    case "pub.leaflet.blocks.unorderedList": {
      const list = parseUnorderedList(value);
      return list ? (
        <ListItems key={key} items={list.children} ordered={false} />
      ) : (
        <UnsupportedBlock key={key} type={value.$type} />
      );
    }
    case "pub.leaflet.blocks.code": {
      if (typeof value.plaintext !== "string")
        return <UnsupportedBlock key={key} type={value.$type} />;
      const language =
        typeof value.language === "string" && value.language
          ? value.language
          : "text";
      let html: string;
      try {
        html = await highlight(value.plaintext, language);
      } catch {
        html = await highlight(value.plaintext, "text");
      }
      return (
        <div
          key={key}
          className="not-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    case "pub.leaflet.blocks.horizontalRule":
      return <hr key={key} />;
    case "pub.leaflet.blocks.image": {
      const image = parseImage(value);
      return image ? (
        <figure key={key} className={image.fullBleed ? "not-prose" : undefined}>
          <LeafletImage image={image} />
        </figure>
      ) : (
        <UnsupportedBlock key={key} type={value.$type} />
      );
    }
    case "pub.leaflet.blocks.imageGallery": {
      if (!Array.isArray(value.images))
        return <UnsupportedBlock key={key} type={value.$type} />;
      const images = value.images.map(parseGalleryImage);
      if (images.some((image) => image === null))
        return <UnsupportedBlock key={key} type={value.$type} />;
      const gap = finiteNumber(value.gap) && value.gap >= 0 ? value.gap : 12;
      return (
        <div
          key={key}
          className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2"
          style={{ gap }}
        >
          {images.map((image, index) =>
            image ? <LeafletImage key={index} image={image} /> : null,
          )}
        </div>
      );
    }
    default:
      return <UnsupportedBlock key={key} type={value.$type} />;
  }
}

export async function LeafletContent({ content }: { content: unknown }) {
  if (
    !isRecord(content) ||
    content.$type !== "pub.leaflet.content" ||
    !Array.isArray(content.pages)
  ) {
    return <UnsupportedBlock type={blockType(content)} />;
  }
  const rendered: ReactNode[] = [];
  for (const [pageIndex, page] of content.pages.entries()) {
    if (
      !isRecord(page) ||
      page.$type !== "pub.leaflet.pages.linearDocument" ||
      !Array.isArray(page.blocks)
    ) {
      rendered.push(
        <UnsupportedBlock key={`page-${pageIndex}`} type={blockType(page)} />,
      );
      continue;
    }
    for (const [blockIndex, wrapper] of page.blocks.entries()) {
      const block = isRecord(wrapper) ? wrapper.block : undefined;
      rendered.push(await renderBlock(block, `${pageIndex}-${blockIndex}`));
    }
  }
  return <>{rendered}</>;
}
