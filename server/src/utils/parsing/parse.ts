import { Types } from "mongoose";

const isString = (str: unknown): str is string => {
  return typeof str === "string" || str instanceof String;
};

const isNumber = (num: unknown): num is number => {
  return typeof num === "number" || num instanceof Number;
};

const isObjectId = (id: any): id is Types.ObjectId => {
  return Types.ObjectId.isValid(id);
};

export const parseString = (str: unknown): string => {
  if (!isString(str)) {
    throw new Error(`Invalid string: ${str}`);
  }
  return str;
};

export const parseNumber = (num: unknown): number => {
  if (!isNumber(num)) {
    throw new Error(`Invalid number: ${num}`);
  }
  return num;
};

export const parseObjectId = (id: any): Types.ObjectId => {
  if (!isObjectId(id)) {
    throw new Error(`Invalid object id: ${id}`);
  }
  return id;
};
