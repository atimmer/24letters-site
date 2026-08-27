export const ATPROTO_TID_PATTERN = /^[2-7a-z]{13}$/;

const SMALL_NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
] as const;

const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
] as const;

const SCALES = [
  [1_000_000_000_000, "trillion"],
  [1_000_000_000, "billion"],
  [1_000_000, "million"],
  [1_000, "thousand"],
] as const;

export function numberToEnglish(value: number): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("Slug suffixes require a non-negative safe integer");
  }
  if (value < 20) return SMALL_NUMBERS[value];
  if (value < 100) {
    const remainder = value % 10;
    return `${TENS[Math.floor(value / 10)]}${remainder === 0 ? "" : `-${SMALL_NUMBERS[remainder]}`}`;
  }
  if (value < 1_000) {
    const remainder = value % 100;
    return `${SMALL_NUMBERS[Math.floor(value / 100)]}-hundred${remainder === 0 ? "" : `-${numberToEnglish(remainder)}`}`;
  }

  const scale = SCALES.find(([size]) => value >= size);
  if (!scale) throw new Error("Unable to create slug suffix");
  const [size, name] = scale;
  const remainder = value % size;
  return `${numberToEnglish(Math.floor(value / size))}-${name}${remainder === 0 ? "" : `-${numberToEnglish(remainder)}`}`;
}

export function slugifyTitle(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled";
}

export function slugCandidate(baseSlug: string, ordinal: number): string {
  return ordinal === 1 ? baseSlug : `${baseSlug}-${numberToEnglish(ordinal)}`;
}
