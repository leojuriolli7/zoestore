import slugify from "slugify";

export function generateSlug(name: string) {
  const randomBytes = crypto.getRandomValues(new Uint8Array(3));

  const hexDigits = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return slugify(`${name}-${hexDigits.substring(0, 5)}`);
}
