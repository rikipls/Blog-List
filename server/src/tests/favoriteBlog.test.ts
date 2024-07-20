import { test, describe } from "node:test";
import assert from "node:assert";

import * as listHelper from '../utils/blog_metrics';
import * as helper from "./test_helper";
import { Blog } from "../types";

describe('favorite blog', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const expected =   {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    };
    const result = listHelper.favoriteBlog(helper.listWithOneBlog as Blog[]);
    assert.deepStrictEqual(result, expected);
  });

  test("when there are multiple blogs", () => {
    const expected = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    };
    const result = listHelper.favoriteBlog(helper.initialBlogs as Blog[]);
    assert.deepStrictEqual(result, expected);
  });

  test("with no blogs", () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, null);
  });
});