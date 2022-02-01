import path, { dirname, extname } from "path";
import express from "express";
import { fileURLToPath } from "url";

import fs from "fs";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  getPosts,
  writePosts,
  saveUsersAvatars,
} from "../../lib/fs-toolsPost.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const publicDirectory = path.join(__dirname, "../../../public/img/posts");

export const parseFile = multer();

const postsRouterFile = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "oct21",
    },
  }),
}).single("cover");

const cloudinaryUploaderAuthor = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "oct21",
    },
  }),
}).single("avatar");

postsRouterFile.post(
  "/:postId/cover",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log(req.file);
      const posts = await getPosts();

      const index = posts.findIndex(post => post._id === req.params.postId);

      const oldPost = posts[index];

      const updatedPost = { ...oldPost, cover: req.file.path };

      posts[index] = updatedPost;

      await writePosts(posts);
      res.send("Uploaded on Cloudinary!");
    } catch (error) {
      next(error);
    }
  }
);

postsRouterFile.post(
  "/:postId/avatar",
  cloudinaryUploaderAuthor,
  async (req, res, next) => {
    try {
      console.log(req.file);
      const posts = await getPosts();

      const index = posts.findIndex(post => post._id === req.params.postId);

      const oldPost = posts[index];

      const updatedPost = {
        ...oldPost,
        author: {
          name: oldPost.author.name,
          surname: oldPost.author.surname,
          avatar: req.file.path,
        },
      };

      posts[index] = updatedPost;

      await writePosts(posts);
      res.send("Uploaded on Cloudinary!");
    } catch (error) {
      next(error);
    }
  }
);

export const uploadFile = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    const fileName = `${req.params.postId}${extension}`;
    const pathToFile = path.join(publicDirectory, fileName);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/public/img/posts/${fileName}`;
    req.file = link;
    next();
  } catch (error) {
    next(error);
  }
};

export default postsRouterFile;
