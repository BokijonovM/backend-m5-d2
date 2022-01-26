import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs from "fs";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newPostValidation } from "./validation.js";

const postsRouter = express.Router();

const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);

const getPosts = () => JSON.parse(fs.readFileSync(postsJSONPath));
const writePosts = content =>
  fs.writeFileSync(postsJSONPath, JSON.stringify(content));
postsRouter.get("/", (req, res, next) => {
  try {
    const fileArray = getPosts();
    res.send(fileArray);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});
postsRouter.post("/", newPostValidation, (req, res, next) => {
  try {
    const { title, category, firstName, lastName, value, unit, content } =
      req.body;
    const newPost = {
      //   ...req.body,
      title,
      category,
      cover: `https://ui-avatars.com/api/?name=${title}+${category}`,
      author: {
        firstName,
        lastName,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
      },
      readTime: {
        value,
        unit,
      },
      content,
      createdAt: new Date(),
      _id: uniqid(),
    };

    const postsArray = getPosts();

    postsArray.push(newPost);

    writePosts(postsArray);

    res.send(201).send({ _id: newPost._id });
  } catch (error) {
    next(createHttpError(400, "Some errors occured in request body!"));
  }
});

postsRouter.get("/:postId", (req, res, next) => {
  try {
    const fileAsJSONArray = getPosts();
    const singlePost = fileAsJSONArray.find(
      singlePost => singlePost._id === req.params.postId
    );
    if (!singlePost) {
      res
        .status(404)
        .send({ message: `Post with ${req.params.postId} is not found!` });
    }
    res.send(singlePost);
    res.send(fileArray);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default postsRouter;
