import * as express from 'express';
const HTTP_METHODS: string[] = ['options', 'patch', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'];
export class Handles {
  constructor() {}
  public forEach(fun: Function) {
    HTTP_METHODS
      .filter(key => this[key])
      .forEach(key => fun(this[key], key));
  }
  public map(fun: Function) {
    return HTTP_METHODS
      .filter(key => this[key])
      .map(key => fun(this[key], key));
  }
  public on(method: string | string[], ...functions: (express.RequestHandler | string)[]): Handles {
    if (typeof method === 'object') {
      (method as string[]).forEach(methodRef => this.on(methodRef, ...functions));
    } else {
      (this as any)[method] = (typeof functions[0] === 'string') ? (this as any)[<string>functions[0]] : functions;
    }
    return this;
  }
}
export class Route {
  public handles: Handles = new Handles();
  constructor(public url: string = '/') {}
  static create(fun: express.RequestHandler, url: string = '/', method: string | string[] = 'get') {
    return new Route(url).on(method, fun);
  }
  public on(method: string | string[], ...functions: (express.RequestHandler | string)[]): Route {
    this.handles.on(method, ...functions);
    return this;
  }
}