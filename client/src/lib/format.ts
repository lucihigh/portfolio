import { format } from "date-fns";

export const formatDate = (value?: string | null) => {
  if (!value) return "Present";
  return format(new Date(value), "MMM yyyy");
};

export const toInputDate = (value?: string | null) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export const splitComma = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const extractGoogleDriveId = (value: string) => {
  const patterns = [
    /\/file\/d\/([^/]+)/i,
    /[?&]id=([^&]+)/i,
    /\/thumbnail\?id=([^&]+)/i,
    /\/uc\?(?:.*&)?id=([^&]+)/i
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
};

export const normalizeMediaUrl = (value?: string | null) => {
  if (!value) return "";

  const trimmed = value.trim();

  if (
    trimmed.includes("drive.google.com") ||
    trimmed.includes("docs.google.com") ||
    trimmed.includes("googleusercontent.com")
  ) {
    const fileId = extractGoogleDriveId(trimmed);
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }

  if (trimmed.includes("dropbox.com")) {
    return trimmed.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
  }

  return trimmed;
};

export const DEFAULT_TESTIMONIAL_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Default profile avatar">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#9ca3af" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg)" />
      <circle cx="60" cy="43" r="22" fill="#ffffff" />
      <path d="M23 103c4-22 21-34 37-34s33 12 37 34" fill="#ffffff" />
    </svg>
  `);
