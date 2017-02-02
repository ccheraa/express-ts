import { Model } from '../../express-ts/db';
export const PostModel = new Model('Room', {
	title: {type: String},
	author: {type: String},
	body: {type: String},
	user: {type: Number, default: 0},
	date: {type: Date, default: 0}
});