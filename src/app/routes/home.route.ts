import * as express from 'express';
import { Server, Controller, Route, Handles } from '../../express-ts';
export const HomeRoute = new Controller('/', [Route.create(
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.sendFile(require('path').join(__dirname, '../../../../public/index.html'));
	},
)]);