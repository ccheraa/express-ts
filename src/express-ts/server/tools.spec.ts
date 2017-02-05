import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import chai = require('chai');
let expect = chai.expect;
declare var describe;
import { isPortFree } from './tools';
const usedPort = 445;
const usedHost = '0.0.0.0';
const freePort = 9000;
const freeHost = '127.0.0.1';
@suite('Tools test') class ToolsSpec {
  @test 'should return an object'() {
    let obj = isPortFree(8000);
    expect(obj).to.not.be.undefined;
    expect(obj.then).to.not.be.undefined;
    expect(obj.not).to.not.be.undefined;
    expect(obj.notFree).to.not.be.undefined;
    expect(obj.free).to.not.be.undefined;
    expect(obj.callback).to.not.be.undefined;
    expect(obj._onFree).to.not.be.undefined;
    expect(obj._onNotFree).to.not.be.undefined;
    expect(obj._callback).to.not.be.undefined;
  };
  @test 'port should not be free (using callback)' (done: Function) {
    let obj = isPortFree(usedPort, usedHost);
    obj.callback((free) => {
      expect(free).to.be.false;
      done();
    });
    expect(obj._callback).to.not.be.null;
  };
  @test 'port should     be free (using callback)' (done: Function) {
    let obj = isPortFree(freePort, freeHost);
    obj.callback((free) => {
      expect(free).to.be.true;
      done();
    });
    expect(obj._callback).to.not.be.null;
  };
  @test 'port should not be free (using then)' (done: Function) {
    let obj = isPortFree(usedPort, usedHost);
    obj.then(null, () => {
      expect(true).to.be.true;
      done();
    });
    expect(obj._onNotFree).to.not.be.null;
  };
  @test 'port should     be free (using then)' (done: Function) {
    let obj = isPortFree(freePort, freeHost);
    obj.then(() => {
      expect(true).to.be.true;
      done();
    });
    expect(obj._onFree).to.not.be.null;
  };
  @test 'port should not be free (using not)' (done: Function) {
    let obj = isPortFree(usedPort, usedHost);
    obj.not(() => {
      expect(true).to.be.true;
      done();
    });
    expect(obj._onNotFree).to.not.be.null;
  };
  @test 'port should not be free (using notFree)' (done: Function) {
    let obj = isPortFree(usedPort, usedHost);
    obj.notFree(() => {
      expect(true).to.be.true;
      done();
    });
    expect(obj._onNotFree).to.not.be.null;
  };
  @test 'port should     be free (using free)' (done: Function) {
    let obj = isPortFree(freePort, freeHost);
    obj.free(() => {
      expect(true).to.be.true;
      done();
    });
    expect(obj._onFree).to.not.be.null;
  };
};