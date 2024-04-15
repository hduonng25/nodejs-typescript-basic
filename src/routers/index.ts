import { Router } from 'express';
import { router as UserRouter } from './user.router';
import { router as DemoRouter } from './demo';
import { configs } from '~/configs/configs';

export const router: Router = Router();

router.use(`${configs.app.prefix}/user`, UserRouter);
router.use(`${configs.app.prefix}/demo`, DemoRouter);
