import { Router } from 'express';
import userController from '../controllers/users-controller';

const router = Router();

router.get('/', userController.index);
router.get('/api/v1/register', userController.getSignUp);
router.post('/api/v1/auth/register', userController.userSignUp);
router.get('/api/v1/auth/user-login', userController.getUserLogin);
router.post('/api/v1/auth/user-login', userController.userLogin);
router.get('/api/v1/user/password-reset', userController.getResetPassword);
router.post('/api/v1/user/password-reset', userController.resetPassword);
router.post('/api/v1/user/create-bank-account/:id', userController.createBankAccount);
export default router;
