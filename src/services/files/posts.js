import express from "express";
import multer from "multer";
import { saveUsersAvatars } from "../../lib/fs-toolsPost.js";

const uploadPostsRouter = express.Router();

uploadPostsRouter.post(
  "/uploadSingle",
  multer().single("avatar"),
  async (req, res, next) => {
    // "avatar" does need to match exactly to the name used in FormData field in the frontend, otherwise Multer is not going to be able to find the file in the req.body
    try {
      console.log("FILE: ", req.file);
      await saveUsersAvatars(req.file.originalname, req.file.buffer);
      res.send("Single file uploaded");
    } catch (error) {
      next(error);
    }
  }
);

export default uploadPostsRouter;
