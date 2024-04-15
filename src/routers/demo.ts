import { NextFunction, Request, Response, Router } from 'express';
import { Result, success } from '~/result';

export const router: Router = Router();

router.get('/', async (req: Request, _: Response, next: NextFunction) => {
     const result = success.ok({ mess: 'Hello world' });
     next(result);
});
