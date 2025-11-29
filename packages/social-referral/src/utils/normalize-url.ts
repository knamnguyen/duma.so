export const normalizeUrl = (inputUrl: string): string => {
  // Use WHATWG URL API to parse; fallback to original if parsing fails
  try {
    const parsed = new URL(inputUrl);
    // Drop query string and fragment
    parsed.search = "";
    parsed.hash = "";
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    // If inputUrl is invalid or cannot be parsed, return as-is
    return inputUrl;
  }
};
