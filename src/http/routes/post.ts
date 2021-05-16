import multer from 'multer';
import { Router } from 'express';
import Post from '../controllers/Post';
import { requireAuth } from '../middlewares';
import { config } from '../../config';
const upload = multer({ dest: `${config.rootUpload}/` })

const router: Router = Router();

router.get('/:id', Post.get);
router.get('/', Post.index);
router.post('/', upload.single('cover'), requireAuth, Post.store);
router.patch('/:id', requireAuth, Post.update);
router.delete('/:id', requireAuth, Post.delete);
router.put('/:id/reply', requireAuth, Post.reply);
router.post('/:id/react', requireAuth, Post.react);
router.delete('/:id/react', requireAuth, Post.unReact);

export const PostRouter: Router = router;
