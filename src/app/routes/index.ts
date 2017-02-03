export * from './api.route';
export * from './test.route';
export * from './db.route';
import { ApiRoute } from './api.route';
import { TestRoute } from './test.route';
import { DBRoute } from './db.route';
export const ROUTES = [ApiRoute, TestRoute, DBRoute];