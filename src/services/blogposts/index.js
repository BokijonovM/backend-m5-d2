import express from "express";

const postRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default postRouter;
