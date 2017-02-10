import * as express from 'express';
import { DB } from './db';
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

export const ModelRoutes = function (model: Model, url: string = '/', format?: express.RequestHandler): Route[] {
  console.log(url + '/find');
  let find: Route = new Route(url + '/find')
    .on('post', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      DB.canAccess(model, req, res, null, () => {
        model.list(req.body.doc, req.body.fields, req.body.config).subscribe(
          documents => model.count(req.body.doc).subscribe(count => {
            if (format) {
              req.body.data = documents;
              format(req, res, () => res.json(res.json(resultMulti(req.body.data, count))));
            } else {
              res.json(resultMulti(documents, count));
            }
          }),
          err => res.json(resultError(err))
        );
      });
    });
  let multi: Route = new Route(url)
    .on('post', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      DB.canAccess(model, req, res, null, () => {
        let docs = [];
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
      });
    })
    .on('get', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      DB.canAccess(model, req, res, null, () => {
        model.list(req.query.doc).subscribe(
          documents => model.count(req.query.doc).subscribe(count => {
            if (format) {
              req.body.data = documents;
              format(req, res, () => res.json(res.json(resultMulti(req.body.data, count))));
            } else {
              res.json(resultMulti(documents, count));
            }
          }),
          err => res.json(resultError(err))
        );
      });
    })
    .on('put', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      DB.canAccess(model, req, res, null, () => {
        model.update(req.body.cnd, req.body.doc).subscribe(
          result => res.json(resultOne(result)),
          err => res.json(resultError(err))
        );
      });
    })
    .on('delete', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      DB.canAccess(model, req, res, null, () => {
        model.delete(req.body.cnd).subscribe(
          result => res.json(resultOne(result)),
          err => res.json(resultError(err))
        );
      });
    });
  let single: Route = new Route(url + '/:id([0-9a-f]+)')
    .on('get', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      DB.canAccess(model, req, res, null, () => {
        model.get(req.params.id, req.query.doc).subscribe(
          document => {
            if (format) {
              req.body.data = document;
              format(req, res, () => res.json(resultOne(req.body.data)));
            } else {
              res.json(resultOne(document));
            }
          },
          err => res.json(resultError(err))
        );
      });
    })
    .on(['put', 'post'], (req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(req.body.doc);
      DB.canAccess(model, req, res, null, () => {
        model.set(req.params.id, req.body.doc).subscribe(
          result => res.json(resultOne(result)),
          err => res.json(resultError(err))
        );
      });
    })
    .on('delete', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      DB.canAccess(model, req, res, null, () => {
        model.delete(req.params.id).subscribe(
          result => res.json(resultOne(result)),
          err => res.json(resultError(err))
        );
      });
    });
  return [single, multi, find];
};
export const ModelController = function (model: Model, baseurl: string = '/', url: string = '/', format?: express.RequestHandler): Controller {
  return new Controller(baseurl, ModelRoutes(model, url, format));
};