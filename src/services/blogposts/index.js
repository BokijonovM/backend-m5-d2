import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs, { write } from "fs";
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
    next(createHttpError(400, "Some errors occurred in request body!"));
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
// postsRouter.put("/:postId", (req, res, next) => {
//   try {
//     const postId = req.params.postId;

//     const postArray = getPosts();

//     const index = postArray.findIndex(post => post._id === postId);

//     const oldPost = postArray[index];

//     const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() };

//     postArray[index] = updatedPost;

//     writePosts(postArray);

//     res.send(updatedPost);
//   } catch (error) {
//     res.send(500).send({ message: error.message });
//   }
// });
postsRouter.put("/:postId", (req, res, next) => {
  try {
    const postId = req.params.postId;

    const postArray = getPosts();

    const blogIndex = postArray.findIndex(post => post._id === postId);

    if (!blogIndex == -1) {
      res.status(404).send({ message: `Blog post ${postId}  is not found!` });
    }

    const previousPost = postArray[blogIndex];
    const changedPost = {
      ...previousPost,
      ...req.body,
      updatedAt: new Date(),
      _id: postId,
    };
    postArray[blogIndex] = changedPost;
    writePosts(postArray);

    res.send(changedPost);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

postsRouter.delete("/:postId", (req, res, next) => {
  try {
    const postId = req.params.postId;

    const postsArray = getPosts();

    const remainingPosts = postsArray.filter(post => post._id !== postId);

    writePosts(remainingPosts);

    res.send({ message: `Post with ${postId} is successfully deleted` });
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default postsRouter;
