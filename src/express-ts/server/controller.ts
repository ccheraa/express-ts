// import 'source-map-support/register';
import * as express from 'express';
import { Route } from './route';
export class Controller {
	public router: express.Router = express.Router();
	constructor(public base: string = '/', public routes: Route[] = []) {}
	public add(fun: express.RequestHandler, url: string = '/', method: string = 'get') {
		let route = Route.create(fun, url, method);
		this.routes.push(route);
		return route;
	}
	public setup(app: express.Application): void {
		this.routes.forEach((route) => {
			route.handles.forEach((handle, method) => {
				this.router[method](route.url, handle);
			});
		});
		app.use(this.base, this.router);
	}
}