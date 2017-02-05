import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import chai = require('chai');
let expect = chai.expect;
import { Controller, Route, Server } from '.';
@suite('Controller test') class ControllerSpec {
  handler = (req, res, next) => 'ok';
  obj: Controller;
  before() {
    this.obj = new Controller();
  }
  after() {
    delete(this.obj);
    this.obj = null;
  }
  @test 'should have a router for default Controller'() {
    expect(this.obj.router).to.be.ok;
  };
  @test 'should have a router at: \'/\''() {
    this.obj = new Controller('/root');
    expect(this.obj.base).to.equals('/root');
  };
  @test 'should create a Controller with a route GET: \'/routes/home\''() {
    let route = new Route('/home');
    route.on('get', this.handler);
    this.obj = new Controller('/routes', [route]);
    expect(this.obj.base).to.equals('/routes');
    expect(this.obj.routes[0].url).to.equals('/home');
    expect(this.obj.routes[0].handles['get']).to.equals(this.handler);
    expect(this.obj.routes[0].handles['get']()).to.equals('ok');
  };
  @test 'should have a route GET: \'/\''() {
    this.obj.add(this.handler);
    expect(this.obj.routes[0].url).to.equals('/');
    expect(this.obj.routes[0].handles['get']).to.equals(this.handler);
    expect(this.obj.routes[0].handles['get']()).to.equals('ok');
  };
  @test 'should have a route POST: \'/upload\''() {
    this.obj.add(this.handler, '/upload', 'post');
    expect(this.obj.routes[0].url).to.equals('/upload');
    expect(this.obj.routes[0].handles['post']).to.equals(this.handler);
    expect(this.obj.routes[0].handles['post']()).to.equals('ok');
  };
  @test 'should setup a server with one controller'(done) {
    this.obj.add(this.handler, '/upload', 'post');
    let server: Server = new Server();
    server.applyRoutes([this.obj]);
    server.start(() => {
      server.stop();
      expect(this.obj.router.stack).length(1);
      done();
    });
  };
};