import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs, { write } from "fs";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newPostValidation } from "./validation.js";
import { getPosts, getAuthors, writePosts } from "../../lib/fs-toolsPost.js";
import { parseFile, uploadFile } from "../files/posts.js";

const postsRouter = express.Router();

const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../jsonData/posts.json"
);

// const getPosts = () => JSON.parse(fs.readFileSync(postsJSONPath));
// const writePosts = content =>
//   fs.writeFileSync(postsJSONPath, JSON.stringify(content));

// ************************ GET ************************
postsRouter.get("/", async (req, res, next) => {
  try {
    const fileArray = await getPosts();
    const authorArray = await getAuthors();
    if (req.query && req.query.category) {
      const filteredPosts = fileArray.filter(
        post => post.category === req.query.category
      );
      res.send(filteredPosts);
    } else {
      res.send({ authorArray, fileArray });
    }
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// ************************ POST ************************
postsRouter.post("/", newPostValidation, async (req, res, next) => {
  try {
    const blog = {
      _id: uniqid(),
      ...req.body,
      createdAt: new Date(),
    };
    const postsArray = await getPosts();

    postsArray.push(blog);
    await writePosts(postsArray);
    res.send(blog);
  } catch (error) {
    next(createHttpError(400, "Some errors occurred in request body!"));
  }
});

// ************************ POST by ID ************************
postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const fileAsJSONArray = await getPosts();
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
    next(error);
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
postsRouter.put("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const postArray = await getPosts();

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
    await writePosts(postArray);

    res.send(changedPost);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const postsArray = await getPosts();

    const remainingPosts = postsArray.filter(post => post._id !== postId);

    await writePosts(remainingPosts);

    res.send({ message: `Post with ${postId} is successfully deleted` });
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// upload poster

postsRouter.put(
  "/:postId/cover",
  parseFile.single("cover"),
  uploadFile,
  async (req, res, next) => {
    try {
      const fileAsJSONArray = await getPosts();

      const blogIndex = fileAsJSONArray.findIndex(
        blog => blog._id === req.params.postId
      );
      if (!blogIndex == -1) {
        res
          .status(404)
          .send({ message: `blog with ${req.params.postId} is not found!` });
      }
      const previousblogData = fileAsJSONArray[blogIndex];
      const changedblog = {
        ...previousblogData,
        cover: req.file,
        updatedAt: new Date(),
        _id: req.params.postId,
      };
      fileAsJSONArray[blogIndex] = changedblog;

      await writePosts(fileAsJSONArray);
      res.send(changedblog);
    } catch (error) {
      next(error);
    }
  }
);
export default postsRouter;
