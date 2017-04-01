const chai = require('chai');
// const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;
const mongoose = require('mongoose');
// const faker = require('faker');
const tester = require('supertest');
const { app, runServer, closeServer } = require('../server');
const { ExerciseData } = require('../exercise_router/ex_model');
const { User } = require('../user_router/user_model');
const jwt = require('jsonwebtoken');
const qs = require('qs');
const _ = require('lodash');
// chai.use(chaiHttp);

const token = jwt.sign({ user: '10210391595884532' },
                        'super stank',
                        { expiresIn: '7 days' });

function tearDownDB() {
    return new Promise((resolve, reject) => {
        console.warn('delete database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

describe('Workin It API resource', () => {
    let testProfile;

    beforeAll(() => runServer());

    afterAll(() => closeServer());

    it('should verify the auth token', () => tester(app)
            .get('/verify_auth')
            .set('token', token)
            .expect(201));

    describe('User endpoints', () => {
        it('should return all user names and facebook Id', () => tester(app)
            .get('/user')
            .set('token', token)
            .expect(201)
            .then((response) => {
                console.log(response.body);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.key('allUsers');
                expect(response.body.allUsers).to.have.length.of.at.least(1);
            }));

        it('should get user profile', () => tester(app)
            .get('/user/profile')
            .set('token', token)
            .expect(201)
            .then((response) => {
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.keys('fbId', 'user', 'profileImage', 'friends');
                testProfile = response.body;
            }),
        );

        it('should add a friend', () => tester(app)
            .put('/user/add_friend')
            .set('token', token)
            .send(qs.stringify({
                user: {
                    fbId: '10210391595884532',
                    name: 'Chad Avalon',
                },
                friend: {
                    fbId: '1',
                    name: 'Milford WaxPaddidle',
                },
            }))
            .expect(201)
            .then((response) => {
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.keys('fbId', 'user', 'profileImage', 'friends', '_id', '__v');
                expect(response.body.friends).to.have.length.of.at.least(1);
                expect(response.body.friends.length).to.be.greaterThan(testProfile.friends.length);
            }),
        );

        it('should accept a friend', () => tester(app)
            .put('/user/accept_friend')
            .set('token', token)
            .send(qs.stringify({
                userFbId: '10210391595884532',
                friendFbId: '1',
            }))
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.keys('fbId', 'user', 'profileImage', 'friends', '_id', '__v');
                expect(response.body.friends).to.have.length.of.at.least(1);
                const friend = _.find(response.body.friends, ['fbId', '1']);
                expect(friend.status).to.equal('active');
            }),
            );

        it('should delete a friend', () => tester(app)
            .put('/user/delete_friend')
            .set('token', token)
            .send(qs.stringify({
                user: '10210391595884532',
                friend: {
                    fbId: '1',
                    name: 'Milford WaxPaddidle',
                },
            }))
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.keys('fbId', 'user', 'profileImage', 'friends', '_id', '__v');
                expect(response.body.friends.length).to.equal(testProfile.friends.length);
            }),
        );
    });

    describe('Exercise data endpoints', () => {
        it('should retrieve user exercise data', () => tester(app)
            .post('/exercise_data/get_data')
            .set('token', token)
            .send({ user: '10210391595884532' })
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.key('data');
                const oneWeekData = Object.keys(response.body.data);
                expect(oneWeekData).to.have.length.of.at.least(1);
                expect(response.body.data[oneWeekData[0]]).to.have.keys('arms', 'back');
            }),
        );
    });
});

