// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

// configure chai
chai.use(chaiHttp);
chai.should();

describe('Admin /', () => {
  describe('Login', () => {
    it('should not login an admin without email', (done) => {
      const staff = {
        password: 'testPassword',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
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
    it('should not login an admin without a valid email format', (done) => {
      const staff = {
        email: 'emailme',
        password: 'testPassword',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
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
    it('should not login an admin  without password', (done) => {
      const staff = {
        email: 'testemail@mail.com',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
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
    it('should not login an admin with invalid login credentials', (done) => {
      const staff = {
        email: 'odejobiolushola@andela.com',
        password: 'somepasswordthatsnothashed',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(staff)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('invalid login');
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(false);
          done();
        });
    });
    it('should not authorize user that exists, but not an admin', (done) => {
      const staff = {
        email: 'dj_ajax02@gmail.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
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
        email: 'odejobiolushola@andela.com',
        password: 'wrongpassword',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
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
    it('should login an admin with the right credentials ', (done) => {
      const staff = {
        email: 'odejobiolushola@andela.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
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

  describe('Assign account Number', () => {
    const validateAdmin = {
      email: 'odejobiolushola@andela.com',
      password: 'since1989',
    };
    let adminToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(validateAdmin)
        .end((err, res) => {
          adminToken = res.body.token;
          done();
        });
    });

    it('should not assign account number if no token', (done) => {
      const generateAccount = {
        ownerId: 1,
        accountNumber: '0001110001',
      };
      chai.request(app)
        .patch('/api/v1/generate/account-number')
        .set('x-access-token', '')
        .send(generateAccount)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          done();
        });
    });
    it('should not assign account number if token is unverifiable', (done) => {
      const generateAccount = {
        ownerId: 1,
        accountNumber: '0001110001',
      };
      chai.request(app)
        .patch('/api/v1/generate/account-number')
        .set('x-access-token', `${adminToken}kdkjdkd8dsh`)
        .send(generateAccount)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          done();
        });
    });
    it('should not assign account number if an account owner is not selected', (done) => {
      const assignAccount = {
        accountNumber: 1234568678,
      };
      chai.request(app)
        .patch('/api/v1/generate/account-number')
        .set('x-access-token', adminToken)
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(422);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql(422);
          res.body.msg.should.be.eql('account owner is required');
          done();
        });
    });
    it('should not assign account number if none is entered', (done) => {
      const assignAccount = {
        ownerId: 1,
      };
      chai.request(app)
        .patch('/api/v1/generate/account-number')
        .set('x-access-token', adminToken)
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(422);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql(422);
          res.body.msg.should.be.eql('account number is required');
          done();
        });
    });
    it('should not assign account number if user does not exist', (done) => {
      const assignAccount = {
        ownerId: -1,
        accountNumber: 3045625897,
      };
      chai.request(app)
        .patch('/api/v1/generate/account-number')
        .set('x-access-token', adminToken)
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(404);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(404);
          res.body.should.have.property('msg');
          done();
        });
    });
    it('should assign account number', (done) => {
      const assignAccount = {
        ownerId: 1,
        accountNumber: '3045625897',
      };
      chai.request(app)
        .patch('/api/v1/generate/account-number')
        .set('x-access-token', adminToken)
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql(201);
          res.body.msg.should.be.eql('account number assigned');
          done();
        });
    });
  });

  describe('Update Account Status', () => {
    const validateAdmin = {
      email: 'odejobiolushola@andela.com',
      password: 'since1989',
    };
    let adminToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(validateAdmin)
        .end((err, res) => {
          adminToken = res.body.token;
          done();
        });
    });

    it('should not update account status if no token', (done) => {
      const ownerId = 1;
      const status = 'active';
      chai.request(app)
        .patch(`/accounts/account-id=${ownerId}&&account-status=${status}`)
        .set('x-access-token', '')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          done();
        });
    });
    it('should not update account status if token is unverifiable', (done) => {
      const ownerId = 1;
      const status = 'active';
      chai.request(app)
        .patch(`/accounts/account-id=${ownerId}&&account-status=${status}`)
        .set('x-access-token', `${adminToken}kdkjdkd8dsh`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          done();
        });
    });
    it('should update account status', (done) => {
      const ownerId = 1;
      const status = 'active';
      chai.request(app)
        .patch(`/accounts/account-id=${ownerId}&&account-status=${status}`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          res.should.has.status(201);
          res.body.should.have.property('status');
          res.body.status.should.be.eql(201);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('account status updated');
          done();
        });
    });
  });

  describe('Admin Registration /', () => {
    const validateAdmin = {
      email: 'odejobiolushola@andela.com',
      password: 'since1989',
    };
    let adminToken;
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(validateAdmin)
        .end((err, res) => {
          adminToken = res.body.token;
          done();
        });
    });

    it('should not register an admin/staff if an admin is not signed in', (done) => {
      const registrationDetails = {
        userType: 'staff',
        firstName: 'olushola',
        lastName: 'odejobi',
        email: 'odejobiolushola@gmail.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/admin/auth/registration')
        .set('x-access-token', '')
        .send(registrationDetails)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('no token');
          done();
        });
    });
    it('should not register an admin/staff with an invalid token', (done) => {
      const registrationDetails = {
        userType: 'staff',
        firstName: 'olushola',
        lastName: 'odejobi',
        email: 'odejobiolushola@gmail.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/admin/auth/registration')
        .set('x-access-token', `${adminToken}xfsgxc.klo`)
        .send(registrationDetails)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(401);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('unverifiable token');
          done();
        });
    });
    it('should not register an admin/staff whereby a user already has that email in use', (done) => {
      const registrationDetails = {
        userType: 'staff',
        firstName: 'olushola',
        lastName: 'odejobi',
        email: 'odejobiolushola@yahoo.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/admin/auth/registration')
        .set('x-access-token', adminToken)
        .send(registrationDetails)
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
    it('should not register an admin/staff whereby a user already has that email in use', (done) => {
      const registrationDetails = {
        userType: 'staff',
        firstName: 'Oyebola',
        lastName: 'Popoola',
        email: 'oyebola12@gmail.com',
        password: 'since1989',
      };
      chai.request(app)
        .post('/api/v1/admin/auth/registration')
        .set('x-access-token', adminToken)
        .send(registrationDetails)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql(201);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('registration successful');
          done();
        });
    });
  });
});
