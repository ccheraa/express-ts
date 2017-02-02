// import { mongo } from './db';
import { Schema, Model as mgModel, model, Document, SchemaOptions } from 'mongoose';
import { Observable, Subject, Subscription } from 'rxjs';

export class Model {
  schema: Schema;
  model: mgModel<any>;
  constructor(public name: string, public definition?: Object, options?: SchemaOptions) {
    this.schema = new Schema(definition);
    this.model = model(name, this.schema);
  }
  test() {
    this.model.find((err, records) => {
      err ? console.log(err) : console.log(records.length);
    });
  }
  // C
  new(document: Object | Object[]): Subject<Document> {
    let result: Subject<Document> = new Subject();
    if (typeof (document as Object[]).forEach === 'function') {
      let documents = document as Object[];
      let current = 0;
      documents.forEach(doc => this.new(doc).subscribe(
        (res: Document) => result.next(res) || (++current === documents.length) && result.complete()),
        (err: any) => result.error(err)
      );
    } else {
      let cb = (err: any, res: Document) => err ? result.error(err) : (result.next(res) && result.complete());
      let model = new this.model(document);
      model.save(cb);
    }
    return result;
  }
  // R
  list(...args: Object[]): Subject<Document[]> {
    let result: Subject<Document[]> = new Subject();
    let cb = (err: any, res: Document[]) => err ? result.error(err) : (result.next(res) && result.complete());
    args.splice(3, 0, cb);
    this.model.find.apply(this.model, args);
    return result;
  }
  count(conditions?: Object): Subject<number> {
    let result: Subject<number> = new Subject();
    let cb = (err: any, res: Document[]) => err ? result.error(err) : (result.next(res.length) && result.complete());
    this.model.find(conditions, '_id', cb);
    return result;
  }
  get(id: string, ...args: Object[]): Subject<Document> {
    let result: Subject<Document> = new Subject();
    let cb = (err: any, res: Document) => err ? result.error(err) : (result.next(res) && result.complete());
    args.splice(2, 0, cb);
    this.model.findById.apply(this.model, [id, ...args]);
    return result;
  }
  // U
  set(id: string, ...args: Object[]): Subject<any> {
    let result: Subject<any> = new Subject();
    let cb = (err: any, res: any) => err ? result.error(err) : (result.next(res) && result.complete());
    args.splice(3, 0, cb);
    this.model.update.apply(this.model, [{_id: id}, ...args]);
    return result;
  }
  update(conditions?: Object, document?: Object, options?: Object): Subject<any> {
    let result: Subject<any> = new Subject();
    let cb = (err: any, res: any) => err ? result.error(err) : (result.next(res) && result.complete());
    if (options && (typeof options === 'object')) {
      (options as any).multi = true;
    } else {
      options = {multi: true};
    }
    this.model.update(conditions, document, options, cb);
    return result;
  }
  // D
  delete(conditions?: string | Object): Subject<any> {
    let result: Subject<any> = new Subject();
    let cb = (err: any) => err ? result.error(err) : (result.next(true) && result.complete());
    // console.log('type: ', (typeof conditions === 'string') ? {_id: conditions} : conditions);
    this.model.remove((typeof conditions === 'string') ? {_id: conditions} : conditions, cb);
    return result;
  }
}

// let standupSchema = new mongo.Schema({
//   memberName: String,
//   project: String,
//   workYesterday: String,
//   workToday: String,
//   impediment: String,
//   createdOn: Date
// });
// let Standup = mongo.model('Standup', standupSchema);