import { Router } from 'express';
import { router as UserRouter } from './user.router';
import { configs } from '~/configs/configs';

export const router: Router = Router();

router.use(`${configs.app.prefix}/user`, UserRouter);
