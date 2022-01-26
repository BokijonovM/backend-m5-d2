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

// ************************ GET ************************
postsRouter.get("/", (req, res, next) => {
  try {
    const fileArray = getPosts();
    res.send(fileArray);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// ************************ POST ************************
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

    res.send(newPost);
  } catch (error) {
    next(createHttpError(400, "Some errors occured in request body!"));
  }
});

// ************************ POST by ID ************************
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

// ************************ EDIT by ID ************************
postsRouter.put("/:postId", (req, res, next) => {
  try {
    const arrayOfPosts = getPosts();
    const authorIndex = arrayOfPosts.findIndex(
      author => author._id === req.params.postId
    );
    if (!authorIndex == -1) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.postId} is not found!` });
    }
    const previousAuthorData = arrayOfPosts[authorIndex];
    const changedAuthor = {
      ...previousAuthorData,
      ...req.body,
      updatedAt: new Date(),
      _id: req.params.postId,
    };
    arrayOfPosts[authorIndex] = changedAuthor;

    writePosts(arrayOfPosts);
    res.send(changedAuthor);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default postsRouter;
