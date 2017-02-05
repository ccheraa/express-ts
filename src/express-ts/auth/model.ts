import { Schema, Model as mgModel, model, SchemaOptions } from 'mongoose';

import { Model } from '../db';
import { Auth } from '../auth';

// interface AuthFunction {
//   (user: any, done: any): void;
// };
// interface AuthenticateFunction {
//   (username, password, done: any): void;
// };

export class AuthModel extends Model {
  // deserializeFunction: AuthFunction;
  // serializeFunction: AuthFunction;
  // authenticateFunction: AuthenticateFunction;
  makeModel(name) {
    Auth.setupSchema(this.schema);
    super.makeModel(name);
  }
  // serialize(fun: AuthFunction) {
  //   this.serializeFunction = fun;
  //   return this;
  // }
  // deserialize(fun: AuthFunction) {
  //   this.deserializeFunction = fun;
  //   return this;
  // }
  // authenticate(fun: AuthenticateFunction) {
  //   this.authenticateFunction = fun;
  //   return this;
  // }
}