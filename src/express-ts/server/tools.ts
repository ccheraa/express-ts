import { createServer, Socket } from 'net';
export function isPortFree(port: number, host: string = '0.0.0.0') {
  let callback = {
    _onFree: null,
    _onNotFree: null,
    _callback: null,
    then: function(ifFree, ifNotFree?) {
      this._onFree = ifFree;
      this._onNotFree = ifNotFree;
    },
    free: function(callback) {
      this._onFree = callback;
    },
    not: function(callback) {
      this._onNotFree = callback;
    },
    notFree: function(callback) {
      this.not(callback);
    },
    callback: function(callback) {
      this._callback = callback;
    }
  };
  let server = createServer();
  server.listen(port, host);
  server.on('error', function (e) {
    callback._onNotFree && (<any>callback._onNotFree)();
    callback._callback && (<any>callback._callback)(false);
  });
  server.on('listening', function (e) {
    server.close();
    callback._onFree && (<any>callback._onFree)();
    callback._callback && (<any>callback._callback)(true);
  });
  return callback;
}