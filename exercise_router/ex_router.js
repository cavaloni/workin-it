import moment from 'moment';
import _ from 'lodash';
import ExerciseData from './ex_model';

const jsonParser = require('body-parser')
    .json();
const express = require('express');
const eJwt = require('express-jwt');

const router = express.Router();

router.use(jsonParser);
router.use(eJwt({ secret: 'super stank',
    getToken: function fromQuery(req) { return req.headers.token; },
    requestProperty: 'auth',
}));


router.post('/', (req, res) => {
    const requiredFields = ['user', 'exerciseData'];
    requiredFields.forEach((field) => {
        if (!(field in req.body)) {
            console.log(field);
            console.log(req.body);
            res.status(400)
                .json({
                    error: `Missing "${field}" in request body`,
                });
        }
    });

    console.log(req.body);

    ExerciseData
        .create({
            userId: req.body.user,
            exerciseData: JSON.parse(req.body.exerciseData),
        })
        .then((data) => {
            console.log(data);
            res.status(200)
                .json(data);
        })
        .catch((err) => {
            res.status(500)
                .json({
                    error: 'something went wrong',
                    errData: err,
                });
        });
});

router.put('/', (req, res) => {
    console.log(req.body);
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
        .findOne(req.body.user.fbId)
        .exec()
        .then((prevData) => {
            let newData = _.cloneDeep(prevData);
            let year;
            let week;

            if (req.body.year === 'undefined') {
                year = moment().year().toString();
            } else {
                year = req.body.year;
            }

            if (req.body.week === 'undefined') {
                week = moment().week().toString();
            } else {
                week = req.body.week;
            }

            const exercisesInDataToSave = [];
            req.body.dataToSave.forEach((data) => {
                const i = req.body.dataToSave.indexOf(data);
                const exSets = req.body.dataToSave[i].exerciseData;
                const exName = req.body.dataToSave[i].exercise;
                const camelName = _.camelCase(req.body.dataToSave[i].exercise);
                const exGroup = req.body.dataToSave[i].exerciseGroup;
                exercisesInDataToSave.push(camelName);

                newData = _.set(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.data`, exSets);
                newData = _.set(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.sets`, exSets.length);
                newData = _.set(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.fullName`, exName);
            });

            const exercisesInDatabase = _.uniq(
                _.flatten(Object.keys(newData.exerciseData[year][week])
                .map(exGroup => Object.keys(newData.exerciseData[year][week][exGroup])
                    .map(exercise => exercise),
                )));
            const exercisesToDelete = _.difference(exercisesInDatabase, exercisesInDataToSave);
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
                    fbId: req.body.user.fbId,
                }, {
                    $set: {
                        exerciseData: newData.exerciseData,
                    },
                }, {
                    new: true,
                })
                .exec()
                .then(profile => res.status(201).json(profile))
                .catch((err) => {
                    console.log(err);
                    res.status(500).json(err);
                });
        });
});

router.post('/get_data', (req, res) => {
    let allUserData;
    ExerciseData
        .findOne({
            userId: req.body.user,
        })
        .then((data) => {
            allUserData = data;
            if (_.isEmpty(allUserData)) {
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

                const userRangeData = Object.keys(exerciseData)
                    .filter(years => years === yearQuery)
                    .map(year => Object.keys(exerciseData[year]))[0]
                    .filter((weeks) => {
                        if (req.body.oneWeek === 'true') {
                            return weeks === weekQuery;
                        }
                        const weekRangeMax = weekQuery + 1;
                        const weekRangeMin = weekQuery - 4;
                        return _.inRange(weeks, weekRangeMin, weekRangeMax);
                    })
                    .reduce((weekSet, week) => ({
                        ...weekSet,
                        [week]: exerciseData[2017][week],
                    }), {});

                res.status(200)
                    .json({
                        data: userRangeData,
                    });
            }
        });
});

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
        });
});

module.exports = { router };
