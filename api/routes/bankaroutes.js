import { Router } from 'express';
import userController from '../controllers/users-controller';
import staffController from '../controllers/staff-controller';
import adminController from '../controllers/admin-controller';

import validator from '../handlers/validator';

const router = Router();


router.get('/', userController.index);
router.post('/api/v1/auth/register', validator.validateUserSignup, userController.userSignUp);
router.post('/api/v1/auth/login', validator.validateLogin, userController.userLogin);
router.put('/api/v1/update-profile', validator.validateProfileUpdate, userController.updateProfile);
router.post('/api/v1/accounts', validator.validateCreateBankAccount, userController.createBankAccount);
router.post('/api/v1/password-reset', userController.resetPassword);
router.patch('/api/v1/change-password', validator.validateChangePassword, userController.changePassword);

router.post('/api/v1/auth/staff/login', validator.validateLogin, staffController.staffLogin);
router.post('/api/v1/transactions/:accountno', validator.validateTransactions, staffController.transactions);
router.delete('/api/v1/accounts/:accountNumber', staffController.deleteAccount);
router.get('/api/v1/accounts', staffController.allBankAccounts); // an admin will share in this route too.
router.get('/api/v1/:accountNumber', staffController.getSpecificAccount); // an admin will share this route
router.get('/accounts/&&status=:status', staffController.getAccountByStatus); // an admin will share this route

router.post('/api/v1/auth/admin/login', validator.validateLogin, adminController.adminLogin);
router.patch('/api/v1/generate/account-number', validator.validateGenerateAccountNumber, adminController.giveAccountNumber);
router.patch('/accounts/account-id=:ownerId&&account-status=:status', adminController.updateAccountStatus);
router.post('/api/v1/admin/auth/registration', validator.validateAdminSignup, adminController.adminRegister);

export default router;
