// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

// configure chai
chai.use(chaiHttp);
chai.should();

describe('Users', () => {
  describe('Registration /', () => {
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
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.be.eql('failed');
          done();
        });
    });
    it('should register a user with valid email and password', (done) => {
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
          res.body.should.have.property('auth');
          res.body.auth.should.be.eql(true);
          res.body.should.have.property('token');

          done();
        });
    });
  });
});
