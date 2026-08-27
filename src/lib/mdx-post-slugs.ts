import fs from "fs";
import path from "path";

export function getReservedMDXSlugs(): string[] {
  return fs
    .readdirSync(path.join(process.cwd(), "posts"))
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => path.basename(file, path.extname(file)))
    .sort();
}
