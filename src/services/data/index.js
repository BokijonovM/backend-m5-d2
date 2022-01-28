import express from "express";

import fs from "fs";

import uniqid from "uniqid";

import path, { dirname } from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const authorsFilePath = path.join(__dirname, "../jsonData/data.json");

import { parseFile, uploadFile } from "../files/index.js";

import { getPosts, getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const userRouter = express.Router();

// get all authors
userRouter.get("/", async (req, res, next) => {
  try {
    const fileAsJSON = await getAuthors();
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// create  author
userRouter.post("/", async (req, res, next) => {
  try {
    const { name, surname, email, dateOfBirth } = req.body;

    const author = {
      id: uniqid(),
      name,
      surname,
      email,
      dateOfBirth,
      avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fileAsJSONArray = await getAuthors();

    fileAsJSONArray.push(author);

    fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));

    res.send(author);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// get single authors
userRouter.get("/:id", async (req, res, next) => {
  try {
    const fileAsJSONArray = await getAuthors();

    const author = fileAsJSONArray.find(author => author.id === req.params.id);
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    res.send(author);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// delete  author
userRouter.delete("/:id", async (req, res, next) => {
  try {
    let fileAsJSONArray = await getAuthors();

    const author = fileAsJSONArray.find(author => author.id === req.params.id);
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      author => author.id !== req.params.id
    );
    await writeAuthors(fileAsJSONArray);
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  update author
userRouter.put("/:id", async (req, res, next) => {
  try {
    let fileAsJSONArray = await getAuthors();

    const authorIndex = fileAsJSONArray.findIndex(
      author => author.id === req.params.id
    );
    if (!authorIndex == -1) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    const previousAuthorData = fileAsJSONArray[authorIndex];
    const changedAuthor = {
      ...previousAuthorData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[authorIndex] = changedAuthor;

    await writeAuthors(fileAsJSONArray);
    res.send(changedAuthor);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

userRouter.put(
  "/:id/cover",
  parseFile.single("cover"),
  uploadFile,
  async (req, res, next) => {
    try {
      const fileAsJSONArray = await getAuthors();

      const blogIndex = fileAsJSONArray.findIndex(
        blog => blog._id === req.params.id
      );
      if (!blogIndex == -1) {
        res
          .status(404)
          .send({ message: `blog with ${req.params.id} is not found!` });
      }
      const previousblogData = fileAsJSONArray[blogIndex];
      const changedblog = {
        ...previousblogData,
        cover: req.file,
        updatedAt: new Date(),
        _id: req.params.id,
      };
      fileAsJSONArray[blogIndex] = changedblog;

      await writeAuthors(fileAsJSONArray);
      res.send(changedblog);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
