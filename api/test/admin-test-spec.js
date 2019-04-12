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
      const admin = {
        password: 'testPassword',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(admin)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should not login an admin without password', (done) => {
      const admin = {
        email: 'testemail@mail.com',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(admin)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should not login an admin with invalid login credentials', (done) => {
      const admin = {
        email: 'testemail@mail.com',
        password: 'somepasswordthatsnothashed',
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(admin)
        .end((err, res) => {
          res.should.be.an('object');
          res.should.have.status(404);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should not authorize user that exists, but not an admin', (done) => {
      const admin = {
        email: 'odejobiolushola@gmail.com',
        password: 'since1989',
        isAdmin: false,
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
        .send(admin)
        .end((err, res) => {
          res.should.has.status(404);
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('unauthorized');
          done();
        });
    });
    it('should login an admin with the right credentials ', (done) => {
      const staff = {
        email: 'oyebola12@gmail.com',
        password: 'since1989',
        isAdmin: true,
      };
      chai.request(app)
        .post('/api/v1/auth/admin/login')
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
  describe('Assign account Number', () => {
    it('should not assign account number if a user is not selected', (done) => {
      const assignAccount = {
        accountNumber: 1234568678,
      };
      chai.request(app)
        .patch('/api/v1/assign/accountNo')
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should not assign account number if none is entered', (done) => {
      const assignAccount = {
        id: 1,
      };
      chai.request(app)
        .patch('/api/v1/assign/accountNo')
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(400);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should not assign account number if user does not exist', (done) => {
      const assignAccount = {
        id: -1,
        accountNumber: 3045625897,
      };
      chai.request(app)
        .patch('/api/v1/assign/accountNo')
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(404);
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should assign account number', (done) => {
      const assignAccount = {
        id: 1,
        accountNumber: 3045625897,
      };
      chai.request(app)
        .patch('/api/v1/assign/accountNo')
        .send(assignAccount)
        .end((err, res) => {
          res.should.has.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status');
          res.body.should.have.property('msg');
          res.body.status.should.be.eql('success');
          done();
        });
    });
  });
});
