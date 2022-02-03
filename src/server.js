import express from "express";
import listEndpoints from "express-list-endpoints";
import userRouter from "./services/data/index.js";
import postsRouter from "./services/blogposts/index.js";
import createHttpError from "http-errors";
import { join } from "path";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import cors from "cors";
import postsRouterFile from "./services/files/posts.js";
// import usersRouterFile from "./services/data/index.js";
// import uploadPostsRouter from "./services/files/posts.js";

const server = express();

const port = process.env.PORT || 3001;

const publicFolderPath = join(process.cwd(), "./public");

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method: ${req.method} --- URL ${req.url} --- ${new Date()}`
  );
  next();
};

const whiteListedOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

console.log("Permitted origins:");
console.table(whiteListedOrigins);

server.use(cors());

server.use(loggerMiddleware);
server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use("/authors", userRouter);
server.use("/posts", postsRouter);
server.use("/files", postsRouterFile);
// server.use("/avatars", usersRouterFile);
// server.use("/uploadCover", uploadPostsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
