import moment from 'moment';
import find from 'lodash/find';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import setWith from 'lodash/setWith';
import isEmpty from 'lodash/isEmpty';
import inRange from 'lodash/inRange';
import cloneDeep from 'lodash/cloneDeep';
import camelCase from 'lodash/camelCase';
import flatten from 'lodash/flatten';

import bodyParser from 'body-parser';
import express from 'express';
import expressJwt from 'express-jwt';
import ExerciseData from './ex_model';
import { User } from '../user_router/user_model';
import { SECRET2 } from '../config';

const eJwt = expressJwt;
const router = express.Router();

router.use(bodyParser.json());
router.use(eJwt({ secret: SECRET2,
    getToken: function fromQuery(req) { return req.headers.token; },
    requestProperty: 'auth',
}));

function getExerciseData(req, res) {
    let user;
    if (req.body.friendFbId) {
        user = req.body.friendFbId;
    } else { user = req.body.user; }
    let allUserData;
    ExerciseData
        .findOne({
            userId: user,
        })
        .then((data) => {
            allUserData = data;
            if (isEmpty(allUserData)) {
                res.status(201)
                    .json({
                        data: 'no data',
                    });
            } else {
                let yearQuery;
                let weekQuery;
                const { exerciseData } = allUserData;

                if (req.body.year === 'undefined') {
                    yearQuery = moment()
                        .year().toString();
                } else {
                    yearQuery = req.body.year;
                }

                if (req.body.week === 'undefined') {
                    weekQuery = moment()
                        .week().toString();
                } else {
                    weekQuery = req.body.week;
                }

                let userRangeData;

                if (isEmpty(exerciseData)) {
                    userRangeData = 'no data';
                } else {
                    userRangeData = Object.keys(exerciseData)
                        .filter(years => years === yearQuery)
                        .map(year => Object.keys(exerciseData[year]))[0]
                        .filter((weeks) => {
                            if (req.body.oneWeek === 'true') {
                                return weeks === weekQuery;
                            }
                            const weekRangeMax = weekQuery + 1;
                            const weekRangeMin = weekQuery - 4;
                            return inRange(weeks, weekRangeMin, weekRangeMax);
                        })
                        .reduce((weekSet, week) => ({
                            ...weekSet,
                            [week]: exerciseData[2017][week],
                        }), {});
                }

                res.status(200)
                    .json({
                        data: userRangeData,
                    });
            }
        })
        .catch(() => {
            res.status(500);
        });
}

router.put('/', (req, res) => {
    const requiredFields = ['user', 'dataToSave'];
    requiredFields.forEach((field) => {
        if (!(field in req.body)) {
            res.status(400)
                .json({
                    error: `Missing "${field}" in request body`,
                });
        }
    });

    ExerciseData
        .findOne({
            userId: req.body.user,
        })
        .exec()
        .then((prevData) => {
            let newData = cloneDeep(prevData);
            const year = req.body.year;
            const week = req.body.week;

            // This sequence sets the data on the object copy from the mongoose object

            const exercisesInDataToSave = [];
            req.body.dataToSave.forEach((data) => {
                const i = req.body.dataToSave.indexOf(data);
                const exSets = req.body.dataToSave[i].exerciseData;
                const numSets = req.body.dataToSave[i].sets;
                const exName = req.body.dataToSave[i].exercise;
                const camelName = camelCase(req.body.dataToSave[i].exercise);
                const exGroup = req.body.dataToSave[i].exerciseGroup;
                exercisesInDataToSave.push(camelName);

                newData = setWith(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.data`, exSets, Object);
                newData = setWith(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.sets`, numSets, Object);
                newData = setWith(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.fullName`, exName, Object);
            });

            // The following sequence is to eliminate items that are deleted by the user.
            // Since whole exercises are saved only on user selecting save, additions and
            // deletions are done simeltaneously.

            const exercisesInDatabase = uniq(
                flatten(Object.keys(newData.exerciseData[year][week])
                .map(exGroup => Object.keys(newData.exerciseData[year][week][exGroup])
                    .map(exercise => exercise),
                )));
            const exercisesToDelete = difference(exercisesInDatabase, exercisesInDataToSave);
            Object.keys(newData.exerciseData[year][week])
                .filter((exGroup) => {
                    const groupsInDataToSave = Object.keys(req.body.dataToSave)
                        .map(data => req.body.dataToSave[data].exerciseGroup);
                    return groupsInDataToSave.includes(exGroup);
                })
                .forEach(exGroup => Object.keys(newData.exerciseData[year][week][exGroup])
                    .forEach((exercise) => {
                        if (exercisesToDelete.includes(exercise)) {
                            delete newData.exerciseData[year][week][exGroup][exercise];
                        }
                    }),
                );

            ExerciseData
                .findOneAndUpdate({
                    userId: req.body.user,
                }, {
                    $set: {
                        exerciseData: newData.exerciseData,
                    },
                }, {
                    new: true,
                })
                .exec()
                .then(profile => res.status(201).json(profile))
                .catch(() => {
                    res.status(500);
                });
        });
});

router.post('/get_friend_data', (req, res) => {
    const { user, friendFbId } = req.body;
    User
        .findOne({
            fbId: user,
        })
        .then((userProfile) => {
            User
                .findOne({
                    fbId: friendFbId,
                })
                .then((friendProfile) => {
                    const userStatusOfFriend = find(
                        userProfile.friends,
                        friend => friend.fbId === friendFbId,
                    ).status;
                    const friendStatusOfUser = find(
                        friendProfile.friends,
                        friend => friend.fbId === user,
                    ).status;
                    if (userStatusOfFriend === 'active' &&
                        friendStatusOfUser === 'active') {
                        getExerciseData(req, res);
                    } else { (res.status(202).json({ reason: 'friend not accepted' })); }
                });
        })
        .catch(() => {
            res.status(500);
        });
});


router.post('/get_data', getExerciseData);

router.put('/get_weeks', (req, res) => {
    ExerciseData
        .findOne({
            userId: req.body.user,
        })
        .then((data) => {
            const years = Object.keys(data.exerciseData);
            const weekRanges = years.map(year => ({
                [year]: Object.keys(data.exerciseData[year]).map((week) => {
                    const weekStart = moment().startOf('week').week(week).format('MMM DD YY');
                    const weekEnd = moment().endOf('week').week(week).format('MMM DD YY');
                    return `${weekStart} to ${weekEnd}`;
                }),
            }));
            res.status(200).json({ weekRanges });
        })
        .catch(() => {
            res.status(500);
        });
});

module.exports = { router };
