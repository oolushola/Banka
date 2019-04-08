import { Router } from 'express';
import userController from '../controllers/users-controller';

const router = Router();

router.get('/', userController.index);
router.get('/api/v1/register', userController.getSignUp);
router.post('/api/v1/auth/register', userController.userSignUp);


export default router;
