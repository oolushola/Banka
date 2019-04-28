import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('Users /', () => {
  describe('Sign up ', () => {
    it('should not register a user without email', (done) => {
      const user = {
        password: 'mysecret',
      };
      chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('email is required');
          done();
        });
    });
    it('should not register a user with a wrong email format', (done) => {
      const user = {
        email: 'mailnotformated',
      };
      chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('invalid email');
          done();
        });
    });
    it('should not register a user without password', (done) => {
      const user = {
        email: 'usertest@testing.com',
      };
      chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          done();
        });
    });
    it('should not register an already existing email', (done) => {
      const user = {
        email: 'dj_ajax02@gmail.com',
        password: 'mysecretredefined',
      };
      chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(409);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('record exists');
          done();
        });
    });
    it('should register a new user with valid email and password', (done) => {
      const user = {
        email: 'usertest@testing.com',
        password: 'pythagoraswinterfield',
      };
      chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(201);
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(true);
          res.body.should.have.property('token');
          done();
        });
    });
  });

  describe('Login', () => {
    it('should not login a user without an email', (done) => {
      const user = {
        password: 'secret',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('email is required');
          done();
        });
    });
    it('should not login a user without a valid email format', (done) => {
      const user = {
        email: 'testing',
        password: 'secret',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('invalid email');
          done();
        });
    });
    it('should not login a user without a password', (done) => {
      const user = {
        email: 'olatunjidebby@gmail.com',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('password is required');
          done();
        });
    });
    it('should not login a user with both wrong email and password', (done) => {
      const user = {
        email: 'notcorrectemail@meil.com',
        password: 'secret',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.status.should.eql(404);
          res.body.should.have.property('auth');
          res.body.auth.should.eql(false);
          res.body.should.have.property('msg');
          res.body.msg.should.eql('not match');
          done();
        });
    });
    it('should not login a user with a wrong password', (done) => {
      const user = {
        email: 'olatunjidebby@gmail.com',
        password: 'secret',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.eql(401);
          res.body.should.have.property('auth');
          res.body.auth.should.eql(false);
          res.body.should.have.property('msg');
          res.body.msg.should.eql('incorrect login details');
          done();
        });
    });
    it('should login a user', (done) => {
      const user = {
        email: 'olatunjidebby@gmail.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(true);
          done();
        });
    });
  });

  describe('Update profile', () => {
    const validateUser = {
      email: 'olatunjidebby@gmail.com',
      password: 'since1989',
    };

    let userToken;

    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(validateUser)
        .end((err, res) => {
          userToken = res.body.token;
          done();
        });
    });

    it('should not update user profile without first name', (done) => {
      //    const id = 1;
      const user = {
        lastName: 'testname',
        phoneNo: '080225566',
        state: 'chipewa',
        address: 'some address',
      };
      chai.request(app)
        .put('/api/v1/update-profile')
        .set('authorization', userToken)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('first name is required');
          done();
        });
    });
    it('should not update user profile without last name', (done) => {
      const id = 1;
      const user = {
        firstName: 'testname',
        phoneNo: '080225566',
        state: 'chipewa',
        address: 'some address',
      };
      chai.request(app)
        .put('/api/v1/update-profile')
        .set('authorization', userToken)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('last name is required');
          done();
        });
    });
    it('should not update user profile without phone number,', (done) => {
      const id = 1;
      const user = {
        firstName: 'testname',
        lastName: 'testname',
        state: 'chipewa',
        address: 'some address',
      };
      chai.request(app)
        .put('/api/v1/update-profile')
        .set('authorization', userToken)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('phone number is required');
          done();
        });
    });
    it('should not update user profile if authentication is not verified', (done) => {
      const id = 1;
      const user = {
        firstName: 'testname',
        lastName: 'testname',
        phoneNo: '080225566',
        state: 'chipewa',
        address: 'some address',
      };
      chai.request(app)
        .put('/api/v1/update-profile')
        .set('authorization', `${userToken}lskkdi`)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('failed to authenticate token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('should update user profile', (done) => {
      const id = 1;
      const user = {
        firstName: 'Deborah',
        lastName: 'Olatunji',
        phoneNo: '08022445566',
        state: 'chipewa',
        address: 'King George V Road, Ikoyi, Lagos.',
      };
      chai.request(app)
        .put('/api/v1/update-profile')
        .set('authorization', userToken)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(201);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(201);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('profile updated');
          done();
        });
    });
  });

  describe('Create Bank Account', () => {
    const validateUser = {
      email: 'shokunbidamilare@gmail.com',
      password: 'since1989',
    };

    let userToken;

    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(validateUser)
        .end((err, res) => {
          userToken = res.body.token;
          done();
        });
    });

    it('should not create a bank account if token is not verifiable', (done) => {
      const id = 4;
      const accountinfo = {
        dob: '10/10/2000',
        accountType: 'savings',
        balance: 350000,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', `${userToken}lskkdi`)
        .send(accountinfo)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('invalid token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('should not register a bank account without date of birth', (done) => {
      const id = 4;
      const bankAccount = {
        accountType: 'current',
        balance: 700000.00,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', `${userToken}`)
        .send(bankAccount)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('date of birth is required');
          done();
        });
    });
    it('should not register a bank account without account type', (done) => {
      const id = 4;
      const bankAccount = {
        dob: '10/10/2000',
        balance: 700000.00,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', `${userToken}`)
        .send(bankAccount)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('account type is required');
          done();
        });
    });
    it('should not register a bank account without opening balance', (done) => {
      const id = 4;
      const bankAccount = {
        dob: '10/10/2000',
        accountType: 'savings',
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(bankAccount)
        .set('authorization', `${userToken}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(400);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('opening balance is required');
          done();
        });
    });
    it('should create bank account for a new user', (done) => {
      const id = 4;
      const bankAccount = {
        accountNumber: '',
        createdOn: new Date(),
        owner: id,
        dob: '10/10/2000',
        accountType: 'Savings',
        status: '',
        balance: 350000,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', `${userToken}`)
        .send(bankAccount)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql(201);
          res.body.msg.should.be.eql('account created');
          done();
        });
    });
  });
});
