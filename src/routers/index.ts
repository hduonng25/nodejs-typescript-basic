import { Router } from 'express';
import { router as TestRouter } from './test';
import { configs } from '~/configs/configs';

export const router: Router = Router();

router.use(`${configs.app.prefix}/test`, TestRouter);
