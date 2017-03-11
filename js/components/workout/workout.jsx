import React, { Component } from 'react';
import WorkoutCard from '../workout-card/workout-card';
import Main from '../test/test';

class Workout extends Component {
    render() {
        return (
            <div>
                <WorkoutCard cardType="Back" />
                <WorkoutCard cardType="Arms" />
                <WorkoutCard cardType="Shoulders" />
                <WorkoutCard cardType="Legs" />
                <WorkoutCard cardType="Chest" />
                <WorkoutCard cardType="Abs" />
            </div>
        );
    }
}

export default Workout;
