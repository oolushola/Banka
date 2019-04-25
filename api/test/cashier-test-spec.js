import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('Staff /', () => {
  describe('Login', () => {
    it('should not login a staff without email', (done) => {
      const staff = {
        password: 'testPassword',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(422);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql(422);
          res.body.msg.should.be.eql('email is required');
          done();
        });
    });
    it('should not login a staff without a valid email format', (done) => {
      const staff = {
        email: 'emailme',
        password: 'testPassword',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql(400);
          res.body.msg.should.be.eql('invalid email');
          done();
        });
    });
    it('should not login a staff without password', (done) => {
      const staff = {
        email: 'testemail@mail.com',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(422);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql(422);
          res.body.msg.should.be.eql('password is required');
          done();
        });
    });
    it('should not login a staff with invalid login credentials', (done) => {
      const staff = {
        email: 'testemail@mail.com',
        password: 'somepasswordthatsnothashed',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(404);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('user not found');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('should not authorize user that exists, but not a staff', (done) => {
      const staff = {
        email: 'dj_ajax02@gmail.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unauthorized');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('should not login a user without the right credentials ', (done) => {
      const staff = {
        email: 'odejobiolushola@yahoo.com',
        password: 'wrongpassword',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('token');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('invalid login');
          done();
        });
    });
    it('should login a user with the right credentials ', (done) => {
      const staff = {
        email: 'odejobiolushola@yahoo.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(true);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('login successful');
          done();
        });
    });
  });

  describe('Perform Transaction on User Account /', () => {
    const validateStaff = {
      email: 'odejobiolushola@yahoo.com',
      password: 'since1989',
    };
    let staffToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(validateStaff)
        .end((err, res) => {
          staffToken = res.body.token;
          done();
        });
    });
    it('it should not perform transaction without account number', (done) => {
      const accountNumber = '1234560001';
      const transaction = {
        trasactionType: 'credit',
        amount: 10000,
      };
      chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(422);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('account number is require');
          done();
        });
    });
    it('it should not authorize staff without a token', (done) => {
      const transaction = {
        transactionType: 'credit',
        amount: 10000,
        accountNumber: '1234560001',
        confirmation: 1,
      };
      chai.request(app)
        .post(`/api/v1/transactions/${transaction.accountNumber}`)
        .set('authorization', '')
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('it should not authorize staff with an unverifiable token', (done) => {
      const transaction = {
        transactionType: 'credit',
        amount: 10000,
        accountNumber: '1234560001',
        confirmation: 1,
      };
      chai.request(app)
        .post(`/api/v1/transactions/${transaction.accountNumber}`)
        .set('authorization', `${staffToken}jsjkalls254`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
  });

  describe('All users bank account ', () => {
    const validateStaff = {
      email: 'odejobiolushola@yahoo.com',
      password: 'since1989',
    };
    let staffToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(validateStaff)
        .end((err, res) => {
          staffToken = res.body.token;
          done();
        });
    });
    it('should not display user account if no token', (done) => {
      chai.request(app)
        .get('/api/v1/accounts')
        .set('authorization', '')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          done();
        });
    });
    it('should not display user account if token is unverifiable', (done) => {
      chai.request(app)
        .get('/api/v1/accounts')
        .set('authorization', `${staffToken}kdkjdkd8dsh`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          done();
        });
    });
    it('should get all users account', (done) => {
      chai.request(app)
        .get('/api/v1/accounts')
        .set('authorization', staffToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(200);
          res.body.should.have.property('data');
          done();
        });
    });
  });

  describe('View specific user', () => {
    const validateStaff = {
      email: 'odejobiolushola@yahoo.com',
      password: 'since1989',
    };
    let staffToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(validateStaff)
        .end((err, res) => {
          staffToken = res.body.token;
          done();
        });
    });
    it('should not display a specific user account if no token', (done) => {
      const accountNumber = '123456789';
      chai.request(app)
        .get(`/api/v1/${accountNumber}`)
        .set('authorization', '')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          done();
        });
    });
    it('should not display user account if token is unverifiable', (done) => {
      const accountNumber = '1234560001';
      chai.request(app)
        .get(`/api/v1/${accountNumber}`)
        .set('authorization', `${staffToken}kdkjdkd8dsh`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          done();
        });
    });
    it('should not display an account number that does not exists', (done) => {
      const accountNumber = '25566447788';
      chai.request(app)
        .get(`/api/v1/${accountNumber}`)
        .set('authorization', staffToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(404);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('user not found');
          done();
        });
    });
    it('should get an account number that exists', (done) => {
      const accountNumber = '3045625897';
      chai.request(app)
        .get(`/api/v1/${accountNumber}`)
        .set('authorization', staffToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(200);
          res.body.should.have.property('userInfo');
          res.body.should.have.property('transactionInfo');
          done();
        });
    });
  });

  describe('Get all lists of accounts by status', () => {
    const validateStaff = {
      email: 'odejobiolushola@yahoo.com',
      password: 'since1989',
    };
    let staffToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(validateStaff)
        .end((err, res) => {
          staffToken = res.body.token;
          done();
        });
    });
    it('should not list accounts by status if there is no token', (done) => {
      const status = 'active';
      chai.request(app)
        .get(`/accounts/&&status=${status}`)
        .set('authorization', '')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          done();
        });
    });
    it('should not display users account by status if token is unverifiable', (done) => {
      const status = 'dormant';
      chai.request(app)
        .get(`/accounts/&&status=${status}`)
        .set('authorization', `${staffToken}vsgjskjs.yeu`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          done();
        });
    });
    it('should return the list of all accounts ', (done) => {
      const status = 'dormant';
      chai.request(app)
        .get(`/accounts/&&status=${status}`)
        .set('authorization', staffToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(200);
          res.body.should.have.property('data');
          done();
        });
    });
  });

  describe('Delete user bank account', () => {
    const validateStaff = {
      email: 'odejobiolushola@yahoo.com',
      password: 'since1989',
    };

    let staffToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(validateStaff)
        .end((err, res) => {
          staffToken = res.body.token;
          done();
        });
    });
    it('should not delete a user account if no token', (done) => {
      const accountNumber = '1234560001';
      chai.request(app)
        .delete(`/api/v1/accounts/${accountNumber}`)
        .set('authorization', '')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('should not delete user account if token is unverifiable', (done) => {
      const accountNumber = '1234560001';
      chai.request(app)
        .delete(`/api/v1/accounts/${accountNumber}`)
        .set('authorization', `${staffToken}blsjd.hdjs`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('should delete user account', (done) => {
      const accountNumber = '1234560002';
      chai.request(app)
        .delete(`/api/v1/accounts/${accountNumber}`)
        .set('authorization', staffToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(200);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('account deleted');
          done();
        });
    });
  });
});
