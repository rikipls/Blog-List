import { Schema, model } from 'mongoose';

import { User } from '../types';

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

export const UserModel = model('User', userSchema);