import {Router} from 'express';
import { requireAuth } from '../middlewares';
import Auth from '../controllers/Auth';

const router: Router = Router();

router.post('/', Auth.register);
router.post('/login', Auth.login);
router.post('/password/reset', Auth.resetPassword);
router.get('/verification', requireAuth, Auth.verify);
router.patch('/password',  requireAuth, Auth.updatePassword);

export const AuthRouter: Router = router;
