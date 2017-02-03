import { PostModel } from './db';
import { Route, ModelRoutes } from '../express-ts';
export const testDB = function() {
  // model.list
  // PostModel.list().subscribe(posts => console.log(posts));

  // model.get
  // PostModel.get('57f9b68444b2090c103f33e8').subscribe(post => console.log(post));

  // model.create
  // PostModel.create({
  //   title: 'Test',
  //   author: 'Tester',
  //   body: 'Testing...',
  //   user: '57f9b68444b2090c103f33e8',
  //   date: new Date()
  // }).subscribe(post => console.log(post));
  // PostModel.create([{
  //   title: 'Test.1',
  //   author: 'Tester.1',
  //   body: 'Testing.1...',
  //   user: '57f9b68444b2090c103f33e8',
  //   date: new Date()
  // }, {
  //   title: 'Test.2',
  //   author: 'Tester.2',
  //   body: 'Testing.2...',
  //   user: '57f9b68444b2090c103f33e8',
  //   date: new Date()
  // }, {
  //   title: 'Test.3',
  //   author: 'Tester.3',
  //   body: 'Testing.3...',
  //   user: '57f9b68444b2090c103f33e8',
  //   date: new Date()
  // }]).subscribe(posts => console.log(posts));

  // model.count
  // PostModel.count().subscribe(count => console.log(count));

  // model.set
  // PostModel.set('589399650b33e44b18326764', {title: 'New test 1'}).subscribe(res => console.log(res));

  // model.update
  // PostModel.update({author: 'Tester.1'}, {author: 'New tester 1'}).subscribe(res => console.log(res));

  // model.delete
  // PostModel.delete('589398cf3ffb7f4e1027d2c0').subscribe(res => console.log(res));
  // PostModel.delete({body: 'Testing.3...'}).subscribe(res => console.log(res));
};
export const testDBRoute = function(): Route[] {
  return [...ModelRoutes(PostModel, '/post')];
};