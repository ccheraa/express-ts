console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n------------------------------------------------------------\n\n');
// import 'source-map-support/register';
import * as express from 'express';
import * as path from 'path';
import { Server, Controller, Route } from '../express-ts';
import { ROUTES } from './routes';

import { testDB } from './test';

import { DB } from '../express-ts/db';

export const server: Server = Server.bootstrap();
DB.connect('mongodb://localhost/db').subscribe(con => {
  console.log('DB connected');
  testDB();
});
server.middleware(function(req, res, next) {
  // console.log(req.method + ': ' + req.url);
  next();
});
server.applyRoutes(ROUTES);
server.static('public', '/');
server.static('/github/express-ts/output/coverage/lcov-report', '/Rjs');
server.static('/github/express-ts/output/coverage/lcov-report-ts', '/Rts');
server.route('/routes/1', function(req, res, next) {
  res.send('<h1 style="text-align:center">Test route 1!</h1>');
});
server.route('/routes/2', function(req, res, next) {
  res.send('<h1 style="text-align:center">Test route 2!</h1>');
});
server.route('/routes', function(req, res, next) {
  res.json(server.routeReport());
});
server.default(function (req, res, next) {
  const err = req.method + ': ' + req.url + ' not found.';
  console.log(err);
  res.send(err);
  next();
});
server.start(() => console.log('server started on ' + server.config.host + ':' + server.config.port));