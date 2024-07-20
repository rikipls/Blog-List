import { test, describe } from "node:test";
import assert from "node:assert";

import * as metrics from '../utils/blog_metrics';
import * as helper from "./test_helper";
import { Blog } from "../types";

describe('author with the most blogs', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    };
    const result = metrics.mostBlogs(helper.listWithOneBlog as Blog[]);
    assert.deepStrictEqual(result, expected);
  });

  test("when there are multiple blogs", () => {
    const expected = {
      author: "Robert C. Martin",
      blogs: 3
    };
    const result = metrics.mostBlogs(helper.initialBlogs as Blog[]);
    assert.deepStrictEqual(result, expected);
  });

  test("with no blogs", () => {
    const result = metrics.mostBlogs([]);
    assert.deepStrictEqual(result, null);
  });
});