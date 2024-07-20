import { test, describe } from "node:test";
import assert from "node:assert";

import * as metrics from '../utils/blog_metrics';
import * as helper from "./test_helper";
import { Blog } from "../types";

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = metrics.totalLikes(helper.listWithOneBlog as Blog[]);
    assert.strictEqual(result, 5);
  });

  test("when there are multiple blogs", () => {
    const result = metrics.totalLikes(helper.initialBlogs as Blog[]);
    assert.strictEqual(result, 36);
  });

  test("when there are no blogs", () => {
    const result = metrics.totalLikes([]);
    assert.strictEqual(result, 0);
  });
});