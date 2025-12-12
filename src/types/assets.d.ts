declare module "*.png" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.jpg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.jpeg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.webp" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.avif" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.gif" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.svg" {
  // Treat SVGs as a URL string unless SVGR is configured.
  const src: string;
  export default src;
}
