// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

// configure chai
chai.use(chaiHttp);
chai.should();

// Test suite for the staff
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
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
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
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
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
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should not authorize user that exists, but not a staff', (done) => {
      const staff = {
        email: 'odejobiolushola@gmail.com',
        password: 'likemike009',
        type: 'notAstaff',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.has.status(404);
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('unauthorized');
          done();
        });
    });
    it('should login a user with the right credentials ', (done) => {
      const staff = {
        email: 'ajax_02@gmail.com',
        password: 'since1989',
        type: 'staff',
      };
      chai.request(app)
        .post('/api/v1/auth/staff/login')
        .send(staff)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(true);
          done();
        });
    });
  });

  // credit user
  describe('Credit User Account /', () => {
    it('should not credit an account without an account number', (done) => {
      const accno = 14587;
      const transaction = {
        type: 'credit',
        amount: 10000,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${accno}/credit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });

    it('should not credit an account without an amount ', (done) => {
      const transaction = {
        accountNumber: 125786,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${transaction.accountNumber}/credit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });

    it('should not credit an account thats not found ', (done) => {
      const transaction = {
        accountNumber: 125786,
        amount: 2000,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${transaction.accountNumber}/credit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });

    it('should credit a valid registered account', (done) => {
      const transaction = {
        accountNumber: 1234567810,
        amount: 2000,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${transaction.accountNumber}/credit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('success');
          done();
        });
    });
  });

  // Debit user account
  describe('Debit User Account /', () => {
    it('should not debit an account without an account number', (done) => {
      const accno = 14587;
      const transaction = {
        amount: 3000,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${accno}/debit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });

    it('should not debit an account without an amount ', (done) => {
      const transaction = {
        accountNumber: 125786,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${transaction.accountNumber}/debit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });

    it('should not debit an account thats not found ', (done) => {
      const transaction = {
        accountNumber: 125786,
        amount: 2000,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${transaction.accountNumber}/debit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });

    it('should not debit  account, if old balance is < the amount  to debit', (done) => {
      const transaction = {
        accountNumber: 1234567810,
        amount: 1500000000,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${transaction.accountNumber}/debit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    
    it('should debit a valid registered account', (done) => {
      const transaction = {
        accountNumber: 1234567810,
        amount: 500,
      };
      chai.request(app)
        .post(`/api/v1/transaction/${transaction.accountNumber}/debit`)
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('success');
          done();
        });
    });
  });

  // users account
  describe('All users account ', () => {
    it('should not display any account, if no one has registered', (done) => {
      const accounts = 0;
      chai.request(app)
        .get('/api/v1/users-account')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('success');
          done();
        });
    });
    it('should display all users account', (done) => {
      chai.request(app)
        .get('/api/v1/users-account')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('success');
          done();
        });
    });
  });
  // single account
});
