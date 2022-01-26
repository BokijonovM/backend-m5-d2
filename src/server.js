import express from "express";
import listEndpoints from "express-list-endpoints";
import userRouter from "./services/data/index.js";
import postRouter from "./services/blogposts/index.js";

import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();

const port = 3001;
server.use(express.json());

server.use("/authors", userRouter);
server.use("/posts", postRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
