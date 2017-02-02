// import 'source-map-support/register';
import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import chai = require('chai');
let expect = chai.expect;
declare var describe;
import { Controller, Route, Server, serverDefaultConfig } from '.';
import { isPortFree } from './tools';
describe('Server test', () => {
  @suite('Creation test') class ServerSpec {
    @test 'should have a default Server'() {
      let app = new Server();
      expect(app.app).to.not.be.an('undefined');
      expect(app.config.port).to.equal(8001);
    };
    @test 'should have an Server with config'() {
      let config = {
        port: 9999
      };
      let app = new Server(config);
      expect(app.config).to.not.be.an('undefined');
      expect(app.config.port).to.equal(config.port);
      expect(app.config.host).to.equal(serverDefaultConfig.host);
    };
    @test 'should bootstrap a default Server'() {
      let app = Server.bootstrap();
      expect(app.app).to.not.be.an('undefined');
      expect(app.config).to.equal(serverDefaultConfig);
    };
    @test 'should bootstrap an Server with config'() {
      let config = {
        host: '127.0.0.1'
      };
      let app = Server.bootstrap(config);
      expect(app.config).to.not.be.an('undefined');
      expect(app.config.port).to.equal(serverDefaultConfig.port);
      expect(app.config.host).to.equal(config.host);
    };
  };
  @suite('Routing test') class ServerRoutingSpec {
    app: Server;
    handler = (req, res, next) => 'ok';
    before() {
      this.app = new Server();
    };
    @test 'should have static routes to default directories'() {
      const directories = ['dir1', 'dir2', 'dir3'];
      directories.forEach(route => this.app.static(route));
      this.app.app._router.stack
        .filter(layer => layer.name === 'serveStatic')
        .map((layer, index) => {
          expect('/' + directories[index]).to.match(layer.regexp);
        });
    };
    @test 'should have static routes to preset directories'() {
      const directories = ['dir1', 'dir2', 'dir3'];
      const urls = ['test1', 'test2', 'test3'];
      urls.forEach((url, index) => this.app.static(directories[index], url));
      this.app.app._router.stack
        .filter(layer => layer.name === 'serveStatic')
        .forEach((layer, index) => {
          expect(urls[index]).to.match(layer.regexp);
        });
    };
    @skip @test 'should have default route'() {
      this.app.default(this.handler);
      this.app.app._router.stack
        .filter(layer => (layer.name !== 'query') && (layer.name !== 'expressInit'))
        .forEach((layer, index) => {
          expect('/').to.match(layer.regexp);
          expect('/level1').to.match(layer.regexp);
          expect('/level1/level2').to.match(layer.regexp);
          expect('/level1/level2/level3').to.match(layer.regexp);
          expect(layer.handle()).to.equal('ok');
        });
    };
    @test 'should have custom route'() {
      this.app.route('/test/2', this.handler);
      this.app.app._router.stack
        .filter(layer => (layer.name !== 'query') && (layer.name !== 'expressInit'))
        .forEach((layer, index) => {
          expect('/test/1').to.not.match(layer.regexp);
          expect('/test/2').to.match(layer.regexp);
        });
    };
    @test 'should have custom middleware'() {
      this.app.middleware(this.handler);
      this.app.app._router.stack
        .filter(layer => (layer.name !== 'query') && (layer.name !== 'expressInit'))
        .forEach((layer, index) => {
          expect(layer.handle).to.equal(this.handler);
        });
    };
    @test 'should give a routing report'() {
      let controller = new Controller();
      controller.add(this.handler, '/upload', 'post');
      const directories = ['dir1', 'dir2', 'dir3'];
      directories.forEach(route => this.app.static(route));
      this.app.middleware(this.handler);
      this.app.route('/test/2', this.handler);
      this.app.applyRoutes([controller]);
      let report = this.app.routeReport();
      expect(report.static).to.have.length(directories.length);
      expect(report.route).to.have.length(1);
      expect(report.controllers).to.have.length(1);
    };
  };
  @suite('Config test') class ServerConfigSpec {
    app: Server;
    after() {
      this.app && this.app.stop();
    }
    static after() {
      Server.stop();
    }
    @test 'should listen on default port'(done: Function) {
      this.app = new Server({
        port: 8001,
        host: '0.0.0.0'
      });
      this.app.start(() => {
        isPortFree(8001, '0.0.0.0').callback(free => {
          expect(free).to.be.false;
          done();
        });
      });
    };
    // TODO servers using last config (8005)
    @skip @test 'should stop all running servers'(done) {
      let servers: Server[] = [
        new Server({port: 8001, host: '0.0.0.0'}),
        new Server({port: 8002, host: '0.0.0.0'}),
        new Server({port: 8003, host: '0.0.0.0'}),
        new Server({port: 8004, host: '0.0.0.0'}),
        new Server({port: 8005, host: '0.0.0.0'}),
      ];
      let startedServers: number = 0;
      let assertions: number = 0;
      let serverStarted = function(server: Server) {
        startedServers++;
        if (startedServers === servers.length) {
          Server.stop(() => {
            servers.forEach(server => {
              isPortFree(server.config.port, server.config.host).free(() => {
                assertions++;
                serverStopped(server);
              });
            });
          });
        }
      };
      let serverStopped = function(server: Server) {
        startedServers--;
        if (startedServers === 0) {
          expect(assertions).to.equal(servers.length * 2);
          done();
        }
      };
      servers.forEach(server => server.start(() => {
        isPortFree(server.config.port, server.config.host).not(() => {
          assertions++;
          serverStarted(server);
        });
      }));
    };
  };
});