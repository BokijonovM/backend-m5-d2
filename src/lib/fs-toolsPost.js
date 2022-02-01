import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../services/jsonData"
);
const usersPublicFolderPath = join(process.cwd(), "./public/img/posts");

const postsJSONPath = join(dataFolderPath, "posts.json");
const authorsJSONPath = join(dataFolderPath, "data.json");

export const getPosts = () => readJSON(postsJSONPath);
export const writePosts = content => writeJSON(postsJSONPath, content);
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = content => writeJSON(authorsJSONPath, content);

export const saveUsersAvatars = (filename, contentAsABuffer) =>
  writeFile(join(usersPublicFolderPath, filename), contentAsABuffer);

// export const saveUsersAvatars = (filename, contentAsABuffer) =>
//   writeFile(join(usersPublicFolderPath, filename), contentAsABuffer);
