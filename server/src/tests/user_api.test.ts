import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';

import mongoose from 'mongoose';
import supertest from 'supertest';

import { app} from '../app';
import { UserModel } from "../models/user";
import * as helper from "./test_helper";
import { User, UserData } from '../types';

type UserUnion = User & UserData;

const api = supertest(app);

describe("User api", () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
    const promiseArray = helper.initialUsers.map(user => new UserModel(user).save());
    await Promise.all(promiseArray);
  });

  test("unique identifier 'id' is defined", async () => {
    const response = await api.get("/api/users");

    response.body.forEach((user: UserUnion) => {
      assert.notStrictEqual(user.id, undefined);

      assert.strictEqual(user._id, undefined);
      assert.strictEqual(user.__v, undefined);

      // PasswordHash is removed
      assert.strictEqual(user.passwordHash, undefined);
    });
  });

  test("create a new user", async () => {
    const newUser = {
      username: "aaa",
      name: "ayy",
      password: "bbb"
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const addedUser = response.body;

    assert.strictEqual(addedUser.username, newUser.username);
    assert.strictEqual(addedUser.name, newUser.name);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1);
  });

  // Change utils/middleware.js/errorHandler to use console.error instead of
  // logger.error to stop silencing errors in test mode
  test("'username' and 'password' are required with length both >= 3", async () => {
    // both username and password are undefined
    const userPassUndef = {
      name: "hellas"
    };

    await api
      .post("/api/users")
      .send(userPassUndef)
      .expect(400);
    
    let usersInMiddle = await helper.usersInDb();
    assert.strictEqual(usersInMiddle.length, helper.initialUsers.length);

    // password is undefined
    const passUndef = {
      username: "aaa",
      name: "ayy",
    };

    await api
      .post("/api/users")
      .send(passUndef)
      .expect(400);
    
    usersInMiddle = await helper.usersInDb();
    assert.strictEqual(usersInMiddle.length, helper.initialUsers.length);

    // username is undefined
    const userUndef = {
      name: "ayy",
      password: "bbb"
    };

    await api
      .post("/api/users")
      .send(userUndef)
      .expect(400);
    
    usersInMiddle = await helper.usersInDb();
    assert.strictEqual(usersInMiddle.length, helper.initialUsers.length);

    // username too short
    const userNameShort = {
      username: "a",
      name: "ayy",
      password: "bbb"
    };

    await api
      .post("/api/users")
      .send(userNameShort)
      .expect(400);

    // password too short
    const passShort = {
      username: "aaa",
      name: "ayy",
      password: "b"
    };

    await api
      .post("/api/users")
      .send(passShort)
      .expect(400);

    // Both username and password are defined and are a valid length
    const newUser = {
      username: "aaa",
      name: "ayy",
      password: "bbb"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1);
  });

  test("duplicate usernames may not be added", async () => {
    // username "hellas" is taken, see ./test_helper.js
    const alreadyExistingUser = {
      username: "hellas",
      name: "foo",
      password: "bar"
    };

    await api
      .post("/api/users")
      .send(alreadyExistingUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
