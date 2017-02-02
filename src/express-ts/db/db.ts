import { Mongoose, Connection } from 'mongoose';
import { Observable, Subject, Subscription } from 'rxjs';
export const mongo = new Mongoose();
export class DB {
	static observer: any;
	static connection: Subject<Connection> = new Subject();
	static connect (url: string): Subject<Connection> {
		mongo.connect(url, function (err) {
			// Standup.find((err, standups) => console.log(err, standups));
			if (err) {
				DB.connection.error(err);
			} else {
				DB.connection.next(mongo.connection);
				// observer.complete();
			}
		});
		return DB.connection;
	}
	static test() {
		let promise = new Promise((resolve, reject) => {
			// Standup.find((err, standups) => {
			// 	err ? reject(err) : resolve(standups);
			// });
		});
		return promise;
	}
}
// export const dbReady = function(next?: (value: Connection) => void, error?: (error: any) => void, complete?: () => void): Subscription {
// 	return DB.connection.subscribe(next, error, complete);
// };