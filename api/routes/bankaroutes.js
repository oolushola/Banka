import { Router } from 'express';
import userController from '../controllers/users-controller';
import staffController from '../controllers/staff-controller';
import adminController from '../controllers/admin-controller';

import validator from '../handlers/validator';
import token from '../handlers/auth';

const router = Router();


router.get('/', userController.index);
router.post('/api/v1/auth/register',
  validator.validateUserSignup,
  userController.userSignUp);

router.post('/api/v1/auth/login',
  validator.validateLogin,
  userController.userLogin);

router.put('/api/v1/update-profile',
  validator.validateProfileUpdate,
  token.checker,
  userController.updateProfile);

router.get('/account/:accountNumber/transactions',
  token.checker,
  userController.getTransactionHistory);

router.get('/accounts/transactions/:transactionid',
  token.checker,
  userController.getSpecificUserTransaction);

router.post('/api/v1/accounts',
  validator.validateCreateBankAccount,
  token.checker,
  userController.createBankAccount);

router.post('/api/v1/password-reset',
  userController.resetPassword);

router.patch('/api/v1/change-password',
  validator.validateChangePassword,
  token.checker,
  userController.changePassword);

router.post('/api/v1/auth/staff/login',
  validator.validateLogin,
  staffController.staffLogin);

router.post('/api/v1/transactions/:accountno',
  validator.validateTransactions,
  token.checker,
  staffController.transactions);

router.delete('/api/v1/accounts/:accountNumber',
  token.checker,
  staffController.deleteAccount);

router.get('/api/v1/accounts',
  token.checker,
  staffController.allBankAccounts);

router.get('/api/v1/:accountNumber',
  token.checker,
  staffController.getSpecificAccount);

router.get('/api/v1/accounts/&&status=:status',
  token.checker,
  staffController.getAccountByStatus);

router.post('/api/v1/auth/admin/login',
  validator.validateLogin,
  adminController.adminLogin);

router.patch('/api/v1/generate/account-number',
  validator.validateGenerateAccountNumber,
  token.checker,
  adminController.giveAccountNumber);

router.patch('/api/v1/accounts/account-id=:ownerId&&account-status=:status',
  token.checker,
  adminController.updateAccountStatus);

router.post('/api/v1/admin/auth/registration',
  validator.validateAdminSignup,
  token.checker,
  adminController.adminRegister);

export default router;
