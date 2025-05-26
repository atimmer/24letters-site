import Link from "next/link";
import Image from "next/image";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { highlight } from "@/lib/shiki";
import React, { ReactNode, useId } from "react";
import { isString } from "radash";
import path from "path";
import { imageSize } from "image-size";
import fs from "fs";

interface TableData {
  headers: string[];
  rows: string[][];
}

function Table({ data }: { data: TableData }) {
  const headers = data.headers.map((header: string, index: number) => (
    <th key={index}>{header}</th>
  ));
  const rows = data.rows.map((row: string[], index: number) => (
    <tr key={index}>
      {row.map((cell: string, cellIndex: number) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

function CustomLink(props: LinkProps) {
  const href = props.href || "";

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

interface ImageProps extends Omit<React.ComponentProps<typeof Image>, "alt"> {
  alt: string;
}

function isLocalImage(src: string) {
  return src.startsWith("/images/");
}

async function RoundedImage({ ...props }: ImageProps) {
  if (!isString(props.src)) {
    return <Image {...props} />;
  }

  let dimensions: { width: number; height: number } = { width: 0, height: 0 };

  if (isLocalImage(props.src)) {
    const imagePath = path.join(process.cwd(), "public", decodeURI(props.src));

    const fileContents = await fs.promises.readFile(imagePath);

    dimensions = imageSize(fileContents);
  } else {
    const imageResponse = await fetch(props.src);
    const imageFile = await imageResponse.arrayBuffer();

    dimensions = imageSize(new Uint8Array(imageFile));
  }

  let width = 0;
  let height = 0;
  if (dimensions.width < 656) {
    width = dimensions.width;
    height = dimensions.height;
  } else {
    width = 656;
    height = (width / dimensions.width) * dimensions.height;
  }

  if (!props.width || !props.height) {
    props.width = width;
    props.height = height;
  }

  return <Image className="rounded-lg" {...props} />;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

async function Code({ children, className, ...props }: CodeProps) {
  if (!isString(children)) {
    return children;
  }

  // If there's no language specified, it's an inline code block
  if (!className) {
    return <code {...props}>{children}</code>;
  }

  const language = className.replace("language-", "") || "text";
  const codeHTML = await highlight(children, language);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface HeadingProps {
  children?: ReactNode;
}

function createHeading(level: number) {
  const Heading = ({ children }: HeadingProps) => {
    const id = useId();
    const slug = isString(children) ? slugify(children) : id;
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children,
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <pre className="not-prose" {...props}>
      {children}
    </pre>
  ),
  Table,
};

interface CustomMDXProps extends Omit<MDXRemoteProps, "components"> {
  components?: MDXRemoteProps["components"];
}

export async function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
