import { Blog } from "../../types";

import * as parsing from "./parse";

export const toBlog = (object: unknown): Blog => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!("title" in object && "url" in object && "user" in object)) {
    throw new Error("Incorrect data: required field(s) are missing");
  }

  const blogFields: any = {
    title: parsing.parseString(object.title),
    url: parsing.parseString(object.url),
    user: parsing.parseObjectId(object.user),
  };

  if ("author" in object && object.author !== undefined) {
    blogFields.author = parsing.parseString(object.author);
  }

  if ("likes" in object && object.likes !== undefined) {
    blogFields.likes = parsing.parseNumber(object.likes);
  }

  return blogFields;
};