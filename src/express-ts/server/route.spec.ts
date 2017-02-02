// import 'source-map-support/register';
import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import chai = require('chai');
let expect = chai.expect;
import { Route } from '.';
@suite('Route test') class RouteSpec {
  handler = (req, res, next) => 'ok';
  @test 'should create a default Route at \'/\''() {
    expect(new Route().url).to.equals('/');
  };
  @test 'should create a Route at \'/\' (alias)'() {
    expect(new Route('/').url).to.equals('/');
  };
  @test 'should create a Route at: \'/api\''() {
    expect(new Route('/api').url).to.equals('/api');
  };
  @test 'should create a route GET/POST: \'/user\''() {
    let route = Route.create(this.handler, '/user', ['get', 'post']);
    expect(route.url).to.equals('/user');
    expect(route.handles['get']).to.equals(this.handler);
    expect(route.handles['get']()).to.equals('ok');
    expect(route.handles['post']).to.equals(this.handler);
    expect(route.handles['post']()).to.equals('ok');
  };
  @test 'should create a default route GET: \'/\''() {
    let route = Route.create(this.handler);
    expect(route.url).to.equals('/');
    expect(route.handles['get']).to.equals(this.handler);
    expect(route.handles['get']()).to.equals('ok');
  };
  @test 'should create a route POST: \'/user\' and link GET to it'() {
    let route = Route.create(this.handler, '/user', 'post');
    expect(route.url).to.equals('/user');
    expect(route.handles['post']).to.equals(this.handler);
    expect(route.handles['post']()).to.equals('ok');
    route.on('get', 'post');
    expect(route.handles['get']).to.equals(this.handler);
    expect(route.handles['get']()).to.equals('ok');
  };
  @test 'should loop through a route\'s handles'() {
    let route = Route.create(this.handler, '/user', ['get', 'post']);
    let count = 0;
    route.handles.forEach((handle) => {
      expect(handle()).to.equals('ok');
      count++;
    });
    expect(count).to.equals(2);
  };
  // @test 'should have a route GET: \'/\''() {
  //
  //   this.obj.add('/', handler);
  //   expect(this.obj.routes[0].url).to.equals('/');
  //   expect(this.obj.routes[0].handles['get']).to.equals(handler);
  //   expect(this.obj.routes[0].handles['get']()).to.equals('ok');
  // };
  // @test 'should have a route POST: \'/upload\''() {
  //
  //   this.obj.add('/upload', handler, 'post');
  //   expect(this.obj.routes[0].url).to.equals('/upload');
  //   expect(this.obj.routes[0].handles['post']).to.equals(handler);
  //   expect(this.obj.routes[0].handles['post']()).to.equals('ok');
  // };
};