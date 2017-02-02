import { Schema } from 'mongoose';
import { Model } from '../../express-ts/db';
export const PostModel = new Model('Post', {
  title: {type: String},
  author: {type: String},
  body: {type: String},
  user: { type: Schema.Types.ObjectId, ref: 'Post' },
  date: {type: Date, default: 0}
});