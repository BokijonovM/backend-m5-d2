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
// import filesRouter from "./services/files/index.js";
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

server.use(
  cors({
    origin: function (origin, next) {
      console.log("ORIGIN: ", origin);
      // CORS is a global middleware --> for each and every request we are going to be able to read the origin value
      if (!origin || whiteListedOrigins.indexOf(origin) !== -1) {
        // indexOf returns -1 if element is NOT in the array
        console.log("YAY!");
        next(null, true);
      } else {
        // if the origin is NOT in the whitelist I should trigger an error
        next(new Error("CORS ERROR!"));
      }
    },
  })
);

server.use(loggerMiddleware);
server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use("/authors", userRouter);
server.use("/posts", postsRouter);
// server.use("/uploadAvatar", filesRouter);
// server.use("/uploadCover", uploadPostsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
