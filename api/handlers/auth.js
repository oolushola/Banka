class tokenChecker {
  static checker(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        status: 401, msg: 'no token', token: null, auth: false,
      });
    }
    return next();
  }
}

export default tokenChecker;
