import { NextFunction, Request, Response, Router } from 'express';
import { create, deleted, get, update } from '~/controller';
import { UserBodyReq } from '~/interface/request';
import { validate } from '~/middleware';
import { userValidator } from '~/middleware/validate';

export const router: Router = Router();

router.get('/', async (req: Request, _: Response, next: NextFunction) => {
     const result = await get();
     next(result);
});

router.post('/', validate.body(userValidator), async (req: Request, _: Response, next: NextFunction) => {
     const body = req.body as UserBodyReq;
     const result = await create({ ...body });
     next(result);
});

router.put('/', async (req: Request, _: Response, next: NextFunction) => {
     const body = req.body as UserBodyReq;
     const result = await update({ ...body });
     next(result);
});

router.put('/delete', async (req: Request, _: Response, next: NextFunction) => {
     const body = req.body as {
          ids: string[];
     };
     const result = await deleted({ ...body });
     next(result);
});
