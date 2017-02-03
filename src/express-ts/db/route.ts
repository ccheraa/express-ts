import * as express from 'express';
import { Model } from './model';
import { extend } from '../utils';
import { Server, Controller, Route, Handles } from '../server';

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
      console.log(req.body);
      model.create(req.body.doc).subscribe(
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
      model.list(req.query.doc).subscribe(
        documents => model.count(req.query.doc).subscribe(count => res.json(resultMulti(documents, count))),
        err => res.json(resultError(err))
      );
    })
    .on('put', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      model.update(req.body.cnd, req.body.doc).subscribe(
        result => res.json(resultOne(result)),
        err => res.json(resultError(err))
      );
    })
    .on('delete', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      model.delete(req.body.cnd).subscribe(
        result => res.json(resultOne(result)),
        err => res.json(resultError(err))
      );
    });
  let single: Route = new Route(url + '/:id')
    .on('get', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      model.get(req.params.id, req.query.doc).subscribe(
        document => res.json(resultOne(document)),
        err => res.json(resultError(err))
      );
    })
    .on(['put', 'post'], (req: express.Request, res: express.Response, next: express.NextFunction) => {
      model.set(req.params.id, req.body.doc).subscribe(
        result => res.json(resultOne(result)),
        err => res.json(resultError(err))
      );
    })
    .on('delete', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      model.delete(req.params.id).subscribe(
        result => res.json(resultOne(result)),
        err => res.json(resultError(err))
      );
    });
  return [single, multi];
};
export const ModelController = function (model: Model, baseurl: string = '/', url: string = '/'): Controller {
  return new Controller(baseurl, ModelRoutes(model, url));
};