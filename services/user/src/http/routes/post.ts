import {Router} from 'express';
import Post from '../controllers/Post';
import { requireAuth } from '../middlewares';

const router: Router = Router();

router.get('/:id', Post.get);
router.get('/', Post.index);
router.post('/', requireAuth, Post.store);
router.patch('/:id', requireAuth, Post.update);
router.delete('/:id', requireAuth, Post.delete);
router.put('/:id/reply', requireAuth, Post.reply);
router.post('/:id/react', requireAuth, Post.react);
router.delete('/:id/react', requireAuth, Post.unReact);

export const PostRouter: Router = router;
