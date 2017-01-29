// import 'source-map-support/register';
import * as express from 'express';
import * as path from 'path';
import { Server, Controller, Route } from '../express-ts';
import { HomeRoute, ApiRoute, TestRoute } from './routes';
export const server: Server = Server.bootstrap();
server.middleware(function(req, res, next) {
	// console.log(req.method + ': ' + req.url);
	next();
});
server.applyRoutes([HomeRoute, ApiRoute, TestRoute]);
server.static('output/coverage/lcov-report', '/Rjs');
server.static('output/coverage/lcov-report-ts', '/Rts');
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
server.start(() => console.log('server started'));