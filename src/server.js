import express from "express";
import listEndpoints from "express-list-endpoints";
import userRouter from "./services/data/index.js";
import postsRouter from "./services/blogposts/index.js";
import createHttpError from "http-errors";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import cors from "cors";
import filesRouter from "./services/files/index.js";

const server = express();

const port = 3001;

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method: ${req.method} --- URL ${req.url} --- ${new Date()}`
  );
  req.name = "Diego";
  next();
};

const fakeAuthMiddleware = (req, res, next) => {
  if (req.name !== "Diego")
    next(createHttpError(401, "Non Diego users are not allowed!"));
  else next();
};

server.use(loggerMiddleware);

server.use(cors());
server.use(express.json());

server.use("/authors", userRouter);
server.use("/posts", loggerMiddleware, postsRouter);
server.use("/files", filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
