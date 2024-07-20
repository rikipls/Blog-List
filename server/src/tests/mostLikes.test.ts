import { test, describe } from "node:test";
import assert from "node:assert";

import * as metrics from '../utils/blog_metrics';
import * as helper from "./test_helper";
import { Blog } from "../types";

describe('most liked blogger', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    };
    const result = metrics.mostLikes(helper.listWithOneBlog as Blog[]);
    assert.deepStrictEqual(result, expected);
  });

  test("when there are multiple blogs", () => {
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    };
    const result = metrics.mostLikes(helper.initialBlogs as Blog[]);
    assert.deepStrictEqual(result, expected);
  });

  test("with no blogs", () => {
    const result = metrics.mostLikes([]);
    assert.deepStrictEqual(result, null);
  });
});