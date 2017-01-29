import * as express from 'express';
import { Controller, Route } from '../../express-ts';
let def: Route = Route.create(
	(req, res, next) => {
		res.send('test');
	},
);
let something: Route = new Route('/something')
	.on(['get', 'post', 'delete'], (req, res, next) => {
		res.send('<b>stuff</b>');
	});
let somethingelse: Route = new Route('/somethingelse')
	.on(['options', 'patch', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'], (req, res, next) => {
		res.send('stuff');
	});
export const TestRoute = new Controller('/test', [def, something, somethingelse]);