import moment from 'moment';
import faker from 'faker';
import { User } from '../user_router/user_model';
import ExerciseData from '../exercise_router/ex_model';

const chai = require('chai');

const expect = chai.expect;
const mongoose = require('mongoose');
const tester = require('supertest');
const { app, runServer, closeServer } = require('../server');
const jwt = require('jsonwebtoken');
const qs = require('qs');
const _ = require('lodash');

/* eslint-env node, jest */

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
    const year = moment().year().toString();
    const week = moment().week().toString();
    const fakeName = faker.name.firstName();
    const fakeId = faker.random.number(100).toString();
    const fakeImage = faker.image.avatar();
    let testProfile;

    beforeAll(() => runServer()
        .then(() => User
            .create({
                user: fakeName,
                fbId: fakeId,
                profileImage: fakeImage,
                friends: [],
            })
        .then(() => ExerciseData
            .create({
                userId: fakeId,
                exerciseData: {},
            }),
        ),
        ));

    afterAll(() => User
            .findOneAndRemove({
                fbId: fakeId,
            })
            .then(() => ExerciseData
            .findOneAndRemove({
                userId: fakeId,
                exerciseData: {},
            }),
            )
            .then(() => closeServer()));

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
                expect(response.body).to.have.keys('fbId', 'user', 'profileImage', 'friends', '_id', '__v');
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
                    fbId: fakeId,
                    name: fakeName,
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
                friendFbId: fakeId,
            }))
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.keys('fbId', 'user', 'profileImage', 'friends', '_id', '__v');
                expect(response.body.friends).to.have.length.of.at.least(1);
                const friend = _.find(response.body.friends, ['fbId', fakeId]);
                expect(friend.status).to.equal('active');
            }),
            );

        it('should delete a friend', () => tester(app)
            .put('/user/delete_friend')
            .set('token', token)
            .send(qs.stringify({
                user: '10210391595884532',
                friend: {
                    fbId: fakeId,
                    name: fakeName,
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
        it('should save exercise data', () => {
            const exerciseData = [{
                exercise: 'Dummy squats',
                sets: 3,
                exerciseData: [
                    {
                        reps: 5,
                        weight: 10,
                    },
                    {
                        reps: 5,
                        weight: 20,
                    },
                ],
                exerciseGroup: 'legs',
            }];

            return tester(app)
                .put('/exercise_data')
                .set('token', token)
                .send({
                    user: fakeId,
                    dataToSave: exerciseData,
                    year,
                    week,
                })
                .expect(201)
                .then((response) => {
                    console.log('2222222222222222222222222222222222222');
                    console.log(response.body);
                    expect(response.body).to.have.keys('_id', 'userId', 'exerciseData', '__v');
                    const data = response.body.exerciseData;
                    expect(Object.keys(data)).to.have.length.of.at.least(1);
                    expect(Object.keys(data[year])).to.have.length.of.at.least(1);
                    console.log(data[year][week]);
                    const exercise = data[year][week].legs.dummySquats;
                    console.log(exercise.data);
                    console.log(exerciseData[0].exerciseData);
                    expect(exercise.data).to.deep.equal(exerciseData[0].exerciseData);
                });
        });

        it('should retrieve user exercise data', () => tester(app)
            .post('/exercise_data/get_data')
            .set('token', token)
            .send({ user: fakeId, year, week })
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.key('data');
                const oneWeekData = Object.keys(response.body.data);
                expect(oneWeekData).to.have.length.of.at.least(1);
                expect(response.body.data[oneWeekData[0]]).to.have.key('legs');
            }),
        );

        it('should get friends exercise data', () => tester(app)
                .put('/user/add_friend')
                .set('token', token)
                .send(qs.stringify({
                    user: {
                        fbId: fakeId,
                        name: fakeName,
                    },
                    friend: {
                        fbId: '10210391595884532',
                        name: 'Chad Avalon',
                    },
                }))
                .then(() => tester(app)
                .put('/user/accept_friend')
                .set('token', token)
                .send(qs.stringify({
                    userFbId: fakeId,
                    friendFbId: '10210391595884532',
                }))
                .then(() => tester(app)
                .post('/exercise_data/get_friend_data')
                .set('token', token)
                .send(qs.stringify({
                    user: '10210391595884532',
                    friendFbId: fakeId,
                    week,
                    year,
                }))
                .then((response) => {
                    expect(response.body).to.have.key('data');
                    const oneWeekData = Object.keys(response.body.data);
                    expect(oneWeekData).to.have.length.of.at.least(1);
                }))));


        it('should get the weeks ranges of stored exercises', () => tester(app)
            .put('/exercise_data/get_weeks')
            .set('token', token)
            .send(qs.stringify({ user: '10210391595884532' }))
            .expect(200)
            .then((response) => {
                expect(response.body.weekRanges).to.be.an('array');
                response.body.weekRanges.forEach((yearData) => {
                    yearData[year].forEach((weekRange) => {
                        expect(weekRange).to.be.a('string');
                    });
                });
            }));
    });
});

