import moment from 'moment';
import _ from 'lodash';
import ExerciseData from './ex_model';
import mockData from '../js/components/mock-data';
import { Observable } from 'rxjs';

const O = Observable;
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
    const exSets = req.body.dataToSave[0].exerciseData;
    const exName = req.body.dataToSave[0].exercise;
    const camelName = _.camelCase(req.body.dataToSave[0].exercise);
    const exGroup = req.body.dataToSave[0].exerciseGroup;
    const week = req.body.week || moment().week().toString();
    const year = req.body.year || moment().year().toString();

    const requiredFields = ['user', 'exerciseData'];
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
            let newData = _.cloneDeep(prevData[0]);
            newData = _.set(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.data`, exSets);
            newData = _.set(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.sets`, exSets.length);
            newData = _.set(newData, `exerciseData.${year}.${week}.${exGroup}.${camelName}.fullName`, exName);

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
                .catch(err => res.status(500).json(err));
        });
});

router.post('/get_data', (req, res) => {
    console.log(req.body);
    let allUserData;
    ExerciseData
        .findOne({
            userId: req.body.user,
        })
        .then((data) => {
            console.log(data);
            allUserData = data;
            if (!allUserData) {
                res.status(201)
                    .json({
                        data: 'no data',
                    });
            } else {
                let yearQuery;
                let weekQuery;
                const { exerciseData } = allUserData;

                if (!req.body.year) {
                    yearQuery = moment()
                        .year().toString();
                } else {
                    yearQuery = req.body.year;
                }

                if (!req.body.week) {
                    weekQuery = moment()
                        .week().toString();
                } else {
                    weekQuery = req.body.week;
                }

                const userRangeData = Object.keys(exerciseData)
                    .filter(years => years === yearQuery)
                    .map(year => Object.keys(exerciseData[year]))[0]
                    .filter((weeks) => {
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
            console.log(data);
            const years = Object.keys(data.exerciseData);
            const numOfYears = years.length;
            const numOfWeeks = years.map(year => Object.keys(data.exerciseData[year]).length);
            res.status(200).json({ weeks: numOfWeeks * numOfYears });
        });
});

module.exports = { router };
