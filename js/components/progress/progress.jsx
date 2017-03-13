import React, { Component } from 'react';
import moment from 'moment';
import ExerciseChart from '../chart-card/chart-card';

const mockData = {
    10: {
        arms: {
            pullUps: [
                'Pull Ups',
                {
                    weight: 180,
                    reps: 4,
                    sets: 3,
                }, {
                    weight: 180,
                    reps: 5,
                    sets: 3,
                }, {
                    weight: 180,
                    reps: 6,
                    sets: 3,
                }, {
                    weight: 190,
                    reps: 4,
                    sets: 3,
                },
            ],
        },
        back: {
            cockPushUps: [
                'Cock Push Ups',
                {
                    weight: 180,
                    reps: 4,
                    sets: 3,
                }, {
                    weight: 180,
                    reps: 5,
                    sets: 3,
                }, {
                    weight: 180,
                    reps: 6,
                    sets: 3,
                }, {
                    weight: 190,
                    reps: 4,
                    sets: 3,
                },
            ],
        },
    },
};

class Progress extends Component {
    render() {
        const charts = Object.keys(mockData)
            .map(weekSet => Object.keys(mockData[weekSet])
                    .map(group => Object.keys(mockData[weekSet][group]).map((data) => {
                        const name = mockData[weekSet][group][data][0];
                        return (
                            <div>
                                <ExerciseChart exercise={name} week={weekSet} name={`${name} Weights`} type="weights" data={mockData[weekSet][group][data]} />
                                <ExerciseChart exercise={name} week={weekSet} name={`${name} Reps`} type="reps" data={mockData[weekSet][group][data]} />
                            </div>
                        );
                    })));

        return (
            <div>
                {charts}
            </div>
        );
    }
}

export default Progress;
