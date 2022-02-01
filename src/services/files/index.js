import path, { dirname, extname } from "path";

import { fileURLToPath } from "url";

import fs from "fs";

import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const publicDirectory = path.join(__dirname, "../../../public/img/authors");

export const parseFile = multer();

export const uploadFile = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    const fileName = `${req.params.id}${extension}`;
    const pathToFile = path.join(publicDirectory, fileName);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/public/img/authors/${fileName}`;
    req.file = link;
    next();
  } catch (error) {
    next(error);
  }
};
