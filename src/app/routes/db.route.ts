import * as express from 'express';
import { Server, Controller, Route, Handles } from '../../express-ts';
import { testDBRoute } from '../test';

export const DBRoute = new Controller('/data', testDBRoute());