import * as express from 'express';
import { Server, Controller, Route, Handles } from '../../express-ts';
let def: Route = Route.create(
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.send('Yo!!');
	},
);
let menu: Route = new Route('/menu')
	.on(['get', 'post', 'delete'], (req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.json(Server.main.routeReport());
	});
export const ApiRoute = new Controller('/api', [def, menu]);