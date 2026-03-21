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
