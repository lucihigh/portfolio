import { Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

const getRequestOrigin = (req: Request) => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto : req.protocol;
  return `${protocol}://${req.get("host")}`;
};

export const uploadPublicAvatar = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Please choose an image before uploading.", 400);
  }

  const publicPath = `/uploads/avatars/${req.file.filename}`;

  return res.status(201).json({
    message: "Avatar uploaded successfully.",
    data: {
      url: `${getRequestOrigin(req)}${publicPath}`,
      path: publicPath
    }
  });
};
