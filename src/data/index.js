import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const userRouter = express.Router();
const currentFilePath = fileURLToPath(import.meta.url);

const parentFolderPath = dirname(currentFilePath);

const authorsJSONPath = join(parentFolderPath, "data.json");

userRouter.post("/", (req, res) => {
  console.log("REQUEST BODY: ", req.body);
  const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
  console.log(newAuthor);

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  authorsArray.push(newAuthor);

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.status(201).send({ id: newAuthor.id });
});

userRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  console.log("FILE CONTENT: ", JSON.parse(fileContent));

  const authorsArray = JSON.parse(fileContent);
  res.send(authorsArray);
});
userRouter.get("/:authorId", (req, res) => {
  console.log("ID: ", req.params.authorId);

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const foundAuthor = authorsArray.find(
    user => user.id === req.params.authorId
  );

  res.send(foundAuthor);
});
userRouter.put("/:authorId", (req, res) => {});
userRouter.delete("/:authorId", (req, res) => {});

export default userRouter;
