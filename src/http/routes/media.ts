import { Router, static as expressStatic } from 'express';

const router: Router = Router();

router.use('/', expressStatic('uploads'));

export const MediaRouter: Router = router;
