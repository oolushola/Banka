const validateEmail = (email) => {
  const atSymbol = email.indexOf('@');
  const dot = email.indexOf('.');
  if (atSymbol < 1) { return false; }

  if (dot <= atSymbol + 2) { return false; }

  if (dot === email.length - 1) { return false; }
  return true;
};

class Validator {
  static validateUserSignup(req, res, next) {
    const { email, password } = req.body;
    if (!email) return res.status(422).send({ status: 422, msg: 'email is required' });
    if (validateEmail(email) === false) return res.status(400).send({ status: 400, msg: 'invalid email' });
    if (!password) return res.status(422).send({ status: 422, msg: 'password is required' });
    if (password.length < 8) return res.status(400).send({ status: 400, msg: 'minimum of 8 characters' });
    next();
  }

  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (!email) return res.status(422).send({ status: 422, msg: 'email is required' });
    if (validateEmail(email) === false) return res.status(400).send({ status: 400, msg: 'invalid email' });
    if (!password) return res.status(422).send({ status: 422, msg: 'password is required' });
    return next();
  }

  static validateProfileUpdate(req, res, next) {
    const {
      firstName, lastName, phoneNo, state, address,
    } = req.body;
    if (!firstName) return res.status(422).send({ status: 422, msg: 'first name is required' });
    if (!lastName) return res.status(422).send({ status: 422, msg: 'last name is required' });
    if (!phoneNo) return res.status(422).send({ status: 422, msg: 'phone number is required' });
    if (!state) return res.status(422).send({ status: 422, msg: 'state is required' });
    if (!address) return res.status(422).send({ status: 422, msg: 'address is required' });
    return next();
  }

  static validateCreateBankAccount(req, res, next) {
    const { dob, accountType } = req.body;
    const balance = Number(req.body.balance);
    if (!dob) return res.status(422).send({ status: 422, msg: 'date of birth is required' });
    if (!accountType) return res.status(422).send({ status: 422, msg: 'account type is required' });
    if (!balance) return res.status(422).send({ status: 422, msg: 'opening balance is required' });
    if (balance <= 0) return res.status(422).send({ status: 422, msg: 'unacceptable opening balance' });
    if (typeof balance !== 'number') return res.status(400).send({ status: 400, msg: 'invalid type of amount' });

    return next();
  }

  static validateChangePassword(req, res, next) {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword) return res.status(422).send({ status: 422, msg: 'old password is require' });
    if (!newPassword) return res.status(422).send({ status: 422, msg: 'new password is require' });
    if (!confirmPassword) return res.status(422).send({ status: 422, msg: 'confirm new password is require' });

    if ((newPassword.length < 8) || (confirmPassword.length < 8)) return res.status(400).send({ status: 400, msg: 'password should be minimum of 8 characters' });

    if (newPassword !== confirmPassword) return res.status(400).send({ status: 400, msg: 'password does not match' });

    return next();
  }

  static validateTransactions(req, res, next) {
    const {
      accountNumber, amount, transactionType, confirmation,
    } = req.body;
    if (!accountNumber) return res.status(422).send({ status: 422, msg: 'account number is require' });
    if (!amount) return res.status(422).send({ status: 422, msg: 'amount is required' });
    if (!transactionType) return res.status(422).send({ status: 422, msg: 'Transaction type is require' });
    if (!confirmation) return res.status(422).send({ status: 422, msg: 'transaction confirmation is require ' });

    if (Number(confirmation) !== 1) return res.status(400).send({ status: 400, msg: 'confirm transaction' });

    if (transactionType === 'credit' && Number(amount) <= 0) return res.status(400).send({ status: 400, msg: 'invalid amount' });

    return next();
  }

  static validateGenerateAccountNumber(req, res, next) {
    const { ownerId, accountNumber } = req.body;

    if (!ownerId) return res.status(422).send({ status: 422, msg: 'account owner is required' });
    if (!accountNumber) return res.status(422).send({ status: 422, msg: 'account number is required' });

    return next();
  }

  static validateAdminSignup(req, res, next) {
    const {
      userType, firstName, lastName, email, password,
    } = req.body;

    if (!userType) return res.status(422).send({ status: 422, msg: 'admin type is required' });
    if (!firstName) return res.status(422).send({ status: 422, msg: 'first name is required' });
    if (!lastName) return res.status(422).send({ status: 422, msg: 'last name is required' });
    if (!email) return res.status(422).send({ status: 422, msg: 'email is required' });
    if (!password) return res.status(422).send({ status: 422, msg: 'password is required' });
    return next();
  }

}

export default Validator;
