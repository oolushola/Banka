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
  
});