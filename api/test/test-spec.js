// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

// configure chai
chai.use(chaiHttp);
chai.should();

describe('Users /', () => {
  describe('Sign up ', () => {
    // Test to get the user registration form
    it('should display user registration form', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should not register a user without password', (done) => {
      const user = {
        email: 'test@testing.com',
      };
      chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(422);
          done();
        });
    });
    it('should register a new user with valid email and password', (done) => {
      const user = {
        email: 'test@testing.com',
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
    it('should not login a user without a valid email', (done) => {
      const user = {
        email: 'testing@mail.com',
        password: 'secret',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(404);
          done();
        });
    });
    it('should login a user', (done) => {
      const user = {
        email: 'odejobiolushola@gmail.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          res.body.should.have.property('email');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(true);
          done();
        });
    });
    it('should not login a user with a wrong password', (done) => {
      const user = {
        email: 'odejobiolushola@gmail.com',
        password: 'secret',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('status');
          res.body.auth.should.eql(422);
          res.body.should.have.property('auth');
          res.body.auth.should.eql('false');
          done();
        });
    });
  });
  describe('Update profile', () => {
    it('should not update user profile without first name', (done) => {
      const id = 5;
      const user = {
        email: 'odejobiolushola@hotmail.com',
        password: '$2b$08$1h8dVe10SMH7G1J86x7AM..wdLf0xuEU1Qv8KWU9vCfq/PA0RTAPy',
        lastname: 'testname',
      };
      chai.request(app)
        .put(`/api/v1/update-profile/${id}`)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(422);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(422);
          done();
        });
    });
    it('should not update user profile without last name', (done) => {
      const id = 5;
      const user = {
        email: 'odejobiolushola@hotmail.com',
        password: '$2b$08$1h8dVe10SMH7G1J86x7AM..wdLf0xuEU1Qv8KWU9vCfq/PA0RTAPy',
        firstname: 'testname',
      };
      chai.request(app)
        .put(`/api/v1/update-profile/${id}`)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(422);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(422);
          done();
        });
    });
    it('should not update user profile without phone number,', (done) => {
      const id = 5;
      const user = {
        email: 'odejobiolushola@hotmail.com',
        password: '$2b$08$1h8dVe10SMH7G1J86x7AM..wdLf0xuEU1Qv8KWU9vCfq/PA0RTAPy',
        firstname: 'testname',
        lastname: 'somename',
      };
      chai.request(app)
        .put(`/api/v1/update-profile/${id}`)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(422);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(422);
          done();
        });
    });
    it('should not update user profile with an invalid id', (done) => {
      const id = -1;
      const user = {
        email: 'odejobiolushola@hotmail.com',
        password: '$2b$08$1h8dVe10SMH7G1J86x7AM..wdLf0xuEU1Qv8KWU9vCfq/PA0RTAPy',
        lastname: 'testname',
        phone_no: '08022445566',
      };
      chai.request(app)
        .put(`/api/v1/update-profile/${id}`)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(404);
          done();
        });
    });
    it('should update user profile', (done) => {
      const id = 5;
      const user = {
        email: 'odejobiolushola@hotmail.com',
        password: '$2b$08$1h8dVe10SMH7G1J86x7AM..wdLf0xuEU1Qv8KWU9vCfq/PA0RTAPy',
        firstname: 'testname',
        lastname: 'sometest',
        phone_no: '08022445566',
      };
      chai.request(app)
        .put(`/api/v1/update-profile/${id}`)
        .send(user)
        .end((err, res) => {
          res.should.be.a('object');
          res.should.have.status(201);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(201);
          done();
        });
    });
  });
  describe('Create Bank Account', () => {
    it('should not create a bank account if user not found', (done) => {
      const user = { id: 10000 };
      chai.request(app)
        .post(`/api/v1/user/create-bank-account/${user.id}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          done();
        });
    });
    it('should not register a bank account without date of birth', (done) => {
      const id = 1;
      const bankAccount = {
        account_type: 'current',
        balance: 700000.00,
      };
      chai.request(app)
        .post(`/api/v1/user/create-bank-account/${id}`)
        .send(bankAccount)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          done();
        });
    });
    it('should not register a bank account without account type', (done) => {
      const id = 1;
      const bankAccount = {
        dob: '10/10/2000',
        balance: 700000.00,
      };
      chai.request(app)
        .post(`/api/v1/user/create-bank-account/${id}`)
        .send(bankAccount)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          done();
        });
    });
    it('should not register a bank account without opening balance', (done) => {
      const id = 1;
      const bankAccount = {
        dob: '10/10/2000',
        account_type: 'current',
      };
      chai.request(app)
        .post(`/api/v1/user/create-bank-account/${id}`)
        .send(bankAccount)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          done();
        });
    });
    it('should create bank account for the user', (done) => {
      const id = 1;
      // const counter = 0;
      const bankAccount = {
        // id: counter + 1,
        accountNumber: '',
        createdOn: new Date(),
        owner: id,
        dob: '10/10/2000',
        accountType: 'Savings',
        status: '',
        balance: 100000,
      };
      chai.request(app)
        .post(`/api/v1/user/create-bank-account/${id}`)
        .send(bankAccount)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('success');
          done();
        });
    });
  });
  describe('Password Reset', () => {
    it('should request for user email to reset password', (done) => {
      const user = {
        email: '',
      };
      chai.request(app)
        .post('/api/v1/user/password-reset')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should validate if user is registered', (done) => {
      const user = {
        email: 'testingmail@mail.com',
      };
      chai.request(app)
        .post('/api/v1/user/password-reset')
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should reset user password', (done) => {
      const user = {
        email: 'oyebola12@gmail.com',
      };
      chai.request(app)
        .post('/api/v1/user/password-reset')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.status.should.be.eql('success');
          done();
        });
    });
  });
  describe('change password', () => {
    it('should change user password', (done) => {
      const id = 1;
      const passwordchange = {
        id: 1,
        password: 'likemike009',
      };
      chai.request(app)
        .post(`/api/v1/user/change-password/${id}`)
        .send(passwordchange)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.should.have.property('newPassword');
          done();
        });
    });
  });
});
