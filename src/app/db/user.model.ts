import { AuthModel } from '../../express-ts';
export const UserModel = new AuthModel('User', {
  name: {type: String},
  username: {type: String},
  password: {type: String}
})
// .serialize((user, done) => {
//   done(null, user._id);
// }).deserialize((id, done) => {
//   UserModel.get(id).subscribe(res => done(null, res.doc));
// }).authenticate((username, password, done) => {
//   UserModel.list({username}).subscribe(res => {
//     if (res.length) {
//       if (password === res[0].password) {
//         done(null, res[0]);
//       } else {
//         console.error('wrong password');
//         done(null, false);
//       }
//     } else {
//       console.error('user not found');
//       done(null, false);
//     }
//   });
// })
;
