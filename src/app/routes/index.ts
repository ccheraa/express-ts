export * from './api.route';
export * from './test.route';
export * from './db.route';
export * from './log.route';
import { ApiRoute } from './api.route';
import { TestRoute } from './test.route';
import { DBRoute } from './db.route';
import { LogRoute } from './log.route';
export const ROUTES = [ApiRoute, TestRoute, DBRoute, LogRoute];