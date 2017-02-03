import * as express from 'express';
import * as http from 'http';
import { Controller } from './controller';
import { isPortFree } from './tools';
import * as bodyParser from 'body-parser';
export const serverDefaultConfig = {
  port: 8001,
  host: '0.0.0.0'
};
export class Server {
  static main: Server = null;
  static servers: http.Server[] = [];

  public config = serverDefaultConfig;
  public app: express.Express;
  public controllers: Controller[] = [];
  public statics: any[] = [];
  public routes: any[] = [];
  public middlewares: any[] = [];
  public server: http.Server;
  public static bootstrap(config: any = {}): Server {
    return Server.main = new Server(config);
  }
  constructor(config: any = {}) {
    if (config) {
      if (config.port) {
        this.config.port = config.port;
      }
      if (config.host) {
        this.config.host = config.host;
      }
    }
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }
  public applyRoutes(controllers: Controller[]): void {
    controllers.forEach(controller => (this.controllers.indexOf(controller) > -1) || this.controllers.push(controller));
  }
  public static(dir: string, url?: string): void {
    url = url || '/' + dir;
    let route = {
      url: url,
      dir,
      handle: express.static(dir)
    };
    this.statics.push(route);
    this.app.use(url, route.handle);
  }
  public default(fun: express.RequestHandler): void {
    this.app.use((err, req, res, next) => err && fun(req, res, next));
  }
  public route(url: string, fun: express.RequestHandler): void {
    this.routes.push({
      url: url,
      handle: fun
    });
    this.app.use(url, fun);
  }
  public middleware(fun: express.RequestHandler): void {
    this.middlewares.push(fun);
    this.app.use(fun);
  }
  public ip(): string {
    return this.config.host + ':' + this.config.port;
  }
  public start(callback?: Function): void {
    this.controllers.forEach(controller => controller.setup(this.app));
    this.server = this.app.listen(this.config.port, this.config.host, () => {
      callback();
    });
    Server.servers.push(this.server);
    process.on('exit', Server.stop);
    process.on('uncaughtException', Server.stop);
    process.on('SIGTERM', Server.stop);
  }
  // TODO Server.stop not working?
  static stop(callback?: Function): void {
    let closedServers: number = 0;
    let closedServer = function(server: http.Server) {
      if (++closedServers === Server.servers.length) {
        callback && callback();
      }
    };
    Server.servers.forEach(server => server && server.close(() => {
      closedServer(server);
    }));
  }
  public stop(callback?: Function): void {
    this.server && this.server.close(callback);
    Server.servers = Server.servers.filter(server => server !== this.server);
  }
  public routeReport(): any {
    return {
      static: this.statics.map(route => route.url + ': ' + route.dir),
      route: this.routes.map(route => route.url),
      controllers: this.controllers.map(controller => {
        return {
          url: controller.base,
          urls: controller.routes.map((route) => {
            return {
              url: route.url,
              fullUrl: controller.base + route.url,
              methods: route.handles.map((handle, method) => method)
            };
          })
        };
      })
    };
  }
}