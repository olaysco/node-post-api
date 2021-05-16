import { Router, Request, Response } from 'express';
import { UserRouter } from './user';
import { PostRouter } from './post';

const router: Router = Router();

router.use('/users', UserRouter);
router.use('/posts', PostRouter);
router.get('/', async (req: Request, res: Response) => {
	res.send(`version 1 endpoint`);
});

export default router;
