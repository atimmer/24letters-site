import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LeafletContent } from "./leaflet-renderer";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} {...props} />
  ),
}));

function facet(plaintext: string, word: string, feature: object) {
  const characterStart = plaintext.indexOf(word);
  const encoder = new TextEncoder();
  return {
    index: {
      byteStart: encoder.encode(plaintext.slice(0, characterStart)).length,
      byteEnd: encoder.encode(plaintext.slice(0, characterStart + word.length))
        .length,
    },
    features: [feature],
  };
}

const image = {
  $type: "blob",
  ref: { $link: "bafkreigalleryfixture" },
  mimeType: "image/webp",
  size: 123,
};

describe("Leaflet editorial block renderer", () => {
  it("renders every selected block and facet from the pinned lexicons", async () => {
    const plaintext = "é bold italic under strike code mark link";
    const content = {
      $type: "pub.leaflet.content",
      pages: [
        {
          $type: "pub.leaflet.pages.linearDocument",
          blocks: [
            {
              block: {
                $type: "pub.leaflet.blocks.text",
                plaintext,
                facets: [
                  facet(plaintext, "bold", {
                    $type: "pub.leaflet.richtext.facet#bold",
                  }),
                  facet(plaintext, "italic", {
                    $type: "pub.leaflet.richtext.facet#italic",
                  }),
                  facet(plaintext, "under", {
                    $type: "pub.leaflet.richtext.facet#underline",
                  }),
                  facet(plaintext, "strike", {
                    $type: "pub.leaflet.richtext.facet#strikethrough",
                  }),
                  facet(plaintext, "code", {
                    $type: "pub.leaflet.richtext.facet#code",
                  }),
                  facet(plaintext, "mark", {
                    $type: "pub.leaflet.richtext.facet#highlight",
                    color: { r: 10, g: 20, b: 30, a: 50 },
                  }),
                  facet(plaintext, "link", {
                    $type: "pub.leaflet.richtext.facet#link",
                    uri: "https://24letters.com/blog",
                  }),
                ],
              },
            },
            {
              block: {
                $type: "pub.leaflet.blocks.header",
                level: 3,
                plaintext: "Header",
              },
            },
            {
              block: {
                $type: "pub.leaflet.blocks.blockquote",
                plaintext: "Quotation",
              },
            },
            {
              block: {
                $type: "pub.leaflet.blocks.orderedList",
                startIndex: 3,
                children: [
                  {
                    content: {
                      $type: "pub.leaflet.blocks.text",
                      plaintext: "Ordered item",
                    },
                  },
                ],
              },
            },
            {
              block: {
                $type: "pub.leaflet.blocks.unorderedList",
                children: [
                  {
                    checked: true,
                    content: {
                      $type: "pub.leaflet.blocks.text",
                      plaintext: "Checked item",
                    },
                  },
                ],
              },
            },
            {
              block: {
                $type: "pub.leaflet.blocks.code",
                plaintext: "const answer = 42;",
                language: "typescript",
              },
            },
            { block: { $type: "pub.leaflet.blocks.horizontalRule" } },
            {
              block: {
                $type: "pub.leaflet.blocks.imageGallery",
                format: "grid",
                gap: 8,
                images: [
                  {
                    image,
                    aspectRatio: { width: 400, height: 300 },
                    alt: "Gallery image",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const html = renderToStaticMarkup(await LeafletContent({ content }));

    expect(html).toContain("é <strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<u>under</u>");
    expect(html).toContain("<s>strike</s>");
    expect(html).toContain("<code>code</code>");
    expect(html).toContain("<mark");
    expect(html).toContain("rgb(10 20 30 / 0.5)");
    expect(html).toContain('href="https://24letters.com/blog"');
    expect(html).toContain("<h3>Header</h3>");
    expect(html).toContain("<blockquote>Quotation</blockquote>");
    expect(html).toContain('<ol start="3">');
    expect(html).toContain("Ordered item");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked=""');
    expect(html).toContain("Checked item");
    expect(html).toContain("const");
    expect(html).toContain("<hr/>");
    expect(html).toContain('alt="Gallery image"');
    expect(html).toContain('width="400"');
    expect(html).toContain('height="300"');
  });
});
