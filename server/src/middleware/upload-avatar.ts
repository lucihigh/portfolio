import multer, { MulterError } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { RequestHandler } from "express";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AppError } from "../utils/app-error.js";

const currentDir = fileURLToPath(new URL(".", import.meta.url));
const uploadDir = resolve(currentDir, "../../uploads/avatars");

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = extname(file.originalname).toLowerCase() || ".jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError("Only JPG, PNG, WEBP, or GIF images are allowed.", 400));
      return;
    }

    cb(null, true);
  }
});

export const uploadAvatar: RequestHandler = (req, res, next) => {
  upload.single("avatar")(req, res, (error) => {
    if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
      next(new AppError("Image is too large. Maximum size is 5MB.", 400));
      return;
    }

    if (error) {
      next(error);
      return;
    }

    next();
  });
};
