import { body } from "express-validator";

export const newPostValidation = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
];

// ****** users validation example

// body("email").exists().withMessage().isEmail().withMessage("Email it is not in the right format!")
