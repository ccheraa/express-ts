import * as express from 'express';
import { Controller, Route, Server, Auth } from '../../express-ts';
import { UserModel } from '../db';
// Auth.setup(UserModel);
let def: Route = new Route()
  .on('get', Auth.isSignedIn(), (req, res, next) => {
    res.send(`
      <h1 style="text-align:center">Members area</h1>
      <pre>${req.body.user}</pre>
    `);
  });
let signout: Route = new Route('/logout')
  .on('get', Auth.signOut(), (req, res, next) => {
    res.send(`
      <h1 style="text-align:center">signed out</h1>
      <pre>${req.body.user}</pre>
    `);
  });
let signin: Route = Route.create((req, res, next) => {
    res.send(`
      <div class="container">
        <h1>Login Page</h1>
        <p class="lead">Say something worthwhile here.</p><br/>
        <form role="form" action="/member/login" method="post" style="max-width: 300px;">
          <div class="form-group">
            <input type="text" name="username" placeholder="Enter Username" class="form-control"/>
          </div>
          <div class="form-group">
            <input type="password" name="password" placeholder="Password" class="form-control"/>
          </div>
          <button type="submit" class="btn btn-default">Submit</button><a href="register">Register</a>
            <button type="reset" class="btn btn-primary">Cancel</button>
        </form>
      </div>
    `);
  }, '/login')
  .on('post', Auth.signIn(), (req, res, next) => {
    console.info('here');
    res.json(req.body.user);
  });
let register: Route = Route.create((req, res, next) => {
    res.send(`
      <div class="container">
        <h1>Registration Page</h1>
        <p class="lead">Say something worthwhile here.</p><br/>
        <form role="form" action="register" method="post" style="max-width: 300px;">
          <div class="form-group">
            <input type="text" name="username" placeholder="Enter Username" class="form-control"/>
          </div>
          <div class="form-group">
            <input type="password" name="password" placeholder="Password" class="form-control"/>
          </div>
          <button type="submit" class="btn btn-default">Submit</button><a href="login">Login</a>
            <button type="reset" class="btn btn-primary">Cancel</button>
        </form>
      </div>
    `);
  }, '/register')
  .on('post', (req, res, next) => {
    // UserModel.delete();
    next();
  }, Auth.register(), (req, res, next) => {
    res.json(req.body.registered);
  });
export const LogRoute = new Controller('/member', [def, signin, signout, register]);