import { Router } from 'express';
import userController from '../controllers/users-controller';
import staffController from '../controllers/staff-controller';

const router = Router();

router.get('/', userController.index);
router.get('/api/v1/register', userController.getSignUp);
router.post('/api/v1/auth/register', userController.userSignUp);
router.get('/api/v1/auth/user-login', userController.getUserLogin);
router.post('/api/v1/auth/user-login', userController.userLogin);
router.put('/api/v1/update-profile/:id', userController.updateProfile);
router.get('/api/v1/user/password-reset', userController.getResetPassword);
router.post('/api/v1/user/password-reset', userController.resetPassword);
router.post('/api/v1/user/create-bank-account/:id', userController.createBankAccount);
router.get('/api/v1/user', userController.specificUser);
router.post('/api/v1/user/change-password/:id', userController.changePassword);

// Route defined for the staffs
router.get('/api/v1/staff/login', staffController.getStaffLogin);
router.post('/api/v1/auth/staff/login', staffController.staffLogin);
router.post('/api/v1/transaction/:accountno/credit', staffController.creditAccount);
router.post('/api/v1/transaction/:accountno/debit', staffController.debitAccount);

export default router;
