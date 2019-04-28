const validateEmail = (email) => {
  const atSymbol = email.indexOf('@');
  const dot = email.indexOf('.');
  if (atSymbol < 1) { return false; }

  if (dot <= atSymbol + 2) { return false; }

  if (dot === email.length - 1) { return false; }
  return true;
};

const trimmer = value => value.replace(/\s/g, '');

class Validator {
  static validateUserSignup(req, res, next) {
    let { email, password } = req.body;
    if (!email) return res.status(400).send({ status: 400, msg: 'email is required' });
    if (validateEmail(email) === false) return res.status(400).send({ status: 400, msg: 'invalid email' });
    if (!password) return res.status(400).send({ status: 400, msg: 'password is required' });
    if (password.length < 8) return res.status(400).send({ status: 400, msg: 'minimum of 8 characters' });
    email = trimmer(email);
    password = trimmer(password);
    return next();
  }

  static validateLogin(req, res, next) {
    let { email, password } = req.body;
    if (!email) return res.status(400).send({ status: 400, msg: 'email is required' });
    if (validateEmail(email) === false) return res.status(400).send({ status: 400, msg: 'invalid email' });
    if (!password) return res.status(400).send({ status: 400, msg: 'password is required' });
    email = trimmer(email);
    password = trimmer(password);
    return next();
  }

  static validateProfileUpdate(req, res, next) {
    let {
      firstName, lastName, phoneNo, state, address,
    } = req.body;
    if (!firstName) return res.status(400).send({ status: 400, msg: 'first name is required' });
    if (!lastName) return res.status(400).send({ status: 400, msg: 'last name is required' });
    if (!phoneNo) return res.status(400).send({ status: 400, msg: 'phone number is required' });
    if (!state) return res.status(400).send({ status: 400, msg: 'state is required' });
    if (!address) return res.status(400).send({ status: 400, msg: 'address is required' });

    firstName = trimmer(firstName);
    lastName = trimmer(lastName);
    phoneNo = trimmer(phoneNo);
    state = trimmer(state);
    address = trimmer(address);

    return next();
  }

  static validateCreateBankAccount(req, res, next) {
    let { dob, accountType } = req.body;
    let balance = Number(req.body.balance);
    if (!dob) return res.status(400).send({ status: 400, msg: 'date of birth is required' });
    if (!accountType) return res.status(400).send({ status: 400, msg: 'account type is required' });
    if (!balance) return res.status(400).send({ status: 400, msg: 'opening balance is required' });
    if (balance <= 0) return res.status(400).send({ status: 400, msg: 'unacceptable opening balance' });
    if (typeof balance !== 'number') return res.status(400).send({ status: 400, msg: 'invalid type of amount' });

    dob = trimmer(dob);
    accountType = trimmer(accountType);
    balance = trimmer(balance);

    return next();
  }

  static validateChangePassword(req, res, next) {
    let { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword) return res.status(400).send({ status: 400, msg: 'old password is require' });
    if (!newPassword) return res.status(400).send({ status: 400, msg: 'new password is require' });
    if (!confirmPassword) return res.status(400).send({ status: 400, msg: 'confirm new password is require' });

    if ((newPassword.length < 8) || (confirmPassword.length < 8)) return res.status(400).send({ status: 400, msg: 'password should be minimum of 8 characters' });

    if (newPassword !== confirmPassword) return res.status(400).send({ status: 400, msg: 'password does not match' });

    oldPassword = trimmer(oldPassword);
    newPassword = trimmer(newPassword);
    confirmPassword = trimmer(confirmPassword);

    return next();
  }

  static validateTransactions(req, res, next) {
    let {
      accountNumber, amount, transactionType, confirmation,
    } = req.body;

    if (!accountNumber) return res.status(400).send({ status: 400, msg: 'account number is require' });
    if (!amount) return res.status(400).send({ status: 400, msg: 'amount is required' });
    if (!transactionType) return res.status(400).send({ status: 400, msg: 'Transaction type is require' });
    if (!confirmation) return res.status(400).send({ status: 400, msg: 'transaction confirmation is require ' });

    if (Number(confirmation) !== 1) return res.status(400).send({ status: 400, msg: 'confirm transaction' });
    if (amount <= 0) return res.status(400).send({ status: 400, msg: 'invalid amount' });

    accountNumber = trimmer(accountNumber);
    amount = trimmer(amount);
    transactionType = trimmer(transactionType);
    confirmation = trimmer(confirmation);

    return next();
  }

  static validateGenerateAccountNumber(req, res, next) {
    let { ownerId, accountNumber } = req.body;

    if (!ownerId) return res.status(400).send({ status: 400, msg: 'account owner is required' });
    if (!accountNumber) return res.status(400).send({ status: 400, msg: 'account number is required' });

    ownerId = trimmer(ownerId);
    accountNumber = trimmer(accountNumber);

    return next();
  }

  static validateAdminSignup(req, res, next) {
    let {
      userType, firstName, lastName, email, password,
    } = req.body;

    if (!userType) return res.status(400).send({ status: 400, msg: 'admin type is required' });
    if (!firstName) return res.status(400).send({ status: 400, msg: 'first name is required' });
    if (!lastName) return res.status(400).send({ status: 400, msg: 'last name is required' });
    if (!email) return res.status(400).send({ status: 400, msg: 'email is required' });
    if (!password) return res.status(400).send({ status: 400, msg: 'password is required' });

    userType = trimmer(userType);
    firstName = trimmer(firstName);
    lastName = trimmer(lastName);
    email = trimmer(email);
    password = trimmer(password);

    return next();
  }
}

export default Validator;
