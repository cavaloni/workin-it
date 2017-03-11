import React, { Component } from 'react';
import ExampleChart from '../chart-card/chart-card';

const mockData = {
    arms: {
        pullUps: {
            week1: {
                weight: 180,
                reps: 4,
                sets: 3,
            },
            week2: {
                weight: 180,
                reps: 5,
                sets: 3,
            },
            week3: {
                weight: 180,
                reps: 6,
                sets: 3,
            },
            week4: {
                weight: 190,
                reps: 4,
                sets: 3,
            },
        },
    },
    back: {
        cockPushUps: {
            week1: {
                weight: 180,
                reps: 4,
                sets: 3,
            },
            week2: {
                weight: 180,
                reps: 5,
                sets: 3,
            },
            week3: {
                weight: 180,
                reps: 6,
                sets: 3,
            },
            week4: {
                weight: 190,
                reps: 4,
                sets: 3,
            },
        },
    },
};

class Progress extends Component {
    render() {
        return (
            <div>
                <ExampleChart name="0" />
                <ExampleChart name="1" />
            </div>
        );
    }
}

export default Progress;