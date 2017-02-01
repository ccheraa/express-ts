import { Model } from './model';
import { extend } from '../utils';
import * as express from 'express';
import { Server, Controller, Route, Handles } from '..//server';

function resultBase(data: Object, ok: boolean = true): any {
	return extend({ok: ok}, data);
}
function resultError(...errs: any[]): any {
	return resultBase({errs: errs}, false);
}
function resultOne(data): any {
	return resultBase({doc: data});
}
function resultMulti(data, count): any {
	return resultBase({docs: data, total: count});
}

export const ModelRoutes = function (model: Model, url: string = '/'): Route[] {
	let multi: Route = new Route(url)
		.on('post', (req: express.Request, res: express.Response, next: express.NextFunction) => {
			let docs = [];
			model.new(req.body.doc).subscribe(
				doc => {
					if (typeof (req.body.doc as Object[]).forEach === 'function') {
						docs.push(doc);
					} else {
						res.json(resultOne(doc));
					}
				},
				err => res.json(resultError(err)),
				() => (typeof (req.body.doc as Object[]).forEach === 'function') && res.json(resultMulti(docs, docs.length))
			);
		})
		.on('get', (req: express.Request, res: express.Response, next: express.NextFunction) => {
			model.list(req.body.doc).subscribe(
				doc => res.json(resultOne(doc)),
				err => res.json(resultError(err))
			);
		});
	return [multi];
}
export const ModelController = function (model: Model, baseurl: string = '/', url: string = '/'): Controller {
	return new Controller(baseurl, ModelRoutes(model, url));
}