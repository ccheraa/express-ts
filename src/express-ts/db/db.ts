import * as express from 'express';
import { Server, Route } from '../server';
import { Model } from './model';
import { Connection, connect, connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { Observable, Subject, Subscription } from 'rxjs';
// export const mongo = new Mongoose();
mongoose.Promise = global.Promise;
export class DB {
  static observer: any;
  static connection: Subject<Connection> = new Subject();
  static accessController: Subject<[Model, express.Request, express.Response, string, express.NextFunction]> = new Subject();
  static connect(url: string): Subject<Connection> {
    connect(url, function (err) {
      // Standup.find((err, standups) => console.log(err, standups));
      if (err) {
        DB.connection.error(err);
      } else {
        DB.connection.next(connection);
        // observer.complete();
      }
    });
    return DB.connection;
  }
  static access(): Subject<[Model, express.Request, express.Response, string, express.NextFunction]> {
    return DB.accessController;
  }
  static canAccess(model: Model, req: express.Request, res: express.Response, id?: string, cb?: Function) {
    DB.accessController.next([model, req, res, id, () => cb()]);
  }
  static test() {
    let promise = new Promise((resolve, reject) => {
      // Standup.find((err, standups) => {
      //   err ? reject(err) : resolve(standups);
      // });
    });
    return promise;
  }
}
// export const dbReady = function(next?: (value: Connection) => void, error?: (error: any) => void, complete?: () => void): Subscription {
//   return DB.connection.subscribe(next, error, complete);
// };