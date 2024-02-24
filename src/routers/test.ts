import { NextFunction, Request, Response, Router } from 'express';
import { test } from '~/controller/test';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await test();
        next(result);
    },
);
