// import 'source-map-support/register';
import * as express from 'express';
import * as path from 'path';
import { Server, Controller, Route } from '../express-ts';
import { ApiRoute, TestRoute } from './routes';

import { DB } from '../express-ts/db';
import { PostModel } from './db';

export const server: Server = Server.bootstrap();
DB.connect('mongodb://localhost/db').subscribe(con => {
	console.log('DB connected');
	// DB.test().then((su: any[]) => console.log(su.length));
	// con.db.collectionNames(function (err, names) {
	// 	console.log(names); // [{ name: 'dbname.myCollection' }]
	// });
	console.log(con.collections);
	PostModel.list().subscribe(posts => console.log(posts));
});
server.middleware(function(req, res, next) {
	// console.log(req.method + ': ' + req.url);
	next();
});
server.applyRoutes([ApiRoute, TestRoute]);
server.static('public', '/');
server.static('W:/github/express-ts/output/coverage/lcov-report', '/Rjs');
server.static('W:/github/express-ts/output/coverage/lcov-report-ts', '/Rts');
server.route('/routes/1', function(req, res, next) {
	res.send('<h1 style="text-align:center">Test route 1!</h1>');
});
server.route('/routes/2', function(req, res, next) {
	res.send('<h1 style="text-align:center">Test route 2!</h1>');
});
server.default(function (req, res, next) {
	const err = req.method + ': ' + req.url + ' not found.';
	console.log(err);
	res.send(err);
	next();
});
server.start(() => console.log('server started on ' + server.config.host + ':' + server.config.port));