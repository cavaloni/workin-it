import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText,
} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import WorkoutItem from '../workout-item/workout-item';
import WorkoutChooser from '../choose-workout/choose-workout';

import styles from './styles.css';

const fakeworks = [
    'Pull-Ups',
    'Deadlift',
    'Fatties',
    'Heavy Shit',
    'Overhead Tricep Press',
    'hats',
    'cats',
];

class WorkoutCard extends Component {
    constructor(props) {
        super(props);
        this.style = {
            card: {
                height: '20%',
                width: '41%',
                margin: 20,
                textAlign: 'center',
                display: 'inline-block',
                verticalAlign: 'top',
                paddingBottom: 10,
            },
        };
        this.openWorkoutChooser = this.openWorkoutChooser.bind(this);
        this.addWorkouts = this.addWorkouts.bind(this);
        this.sameSetsCheck = this.sameSetsCheck.bind(this);
        this.state = {
            itemList: [],
            chooseWorkout: false,
            listNotEmpty: false,
            sameSets: true,
        };
        this.workoutItem = (<WorkoutItem />);
    }

    openWorkoutChooser(e) {
        e.preventDefault();
        this.setState({ chooseWorkout: true });
    }

    addWorkouts(idx) {
        const newArry = Array.from(this.state.itemList);
        newArry.push(idx);
        this.setState({ itemList: newArry, chooseWorkout: false, listNotEmpty: true });
    }

    sameSetsCheck(e, checked) {
        console.log(checked);
        this.setState({ sameSets: checked });
    }

    render() {
        const workoutItemsList = this.state.itemList
            .map(itemIndex => <WorkoutItem key={itemIndex} item={fakeworks[itemIndex]} sets={this.state.sameSets} />);
        return (
            <MuiThemeProvider>
                <Card style={this.style.card}>
                    <WorkoutChooser opener={this.state.chooseWorkout} clicker={this.addWorkouts} />
                    <CardHeader
                      title={this.props.cardType}
                      titleStyle={{
                          fontSize: '20px',
                      }}
                    />
                    <Checkbox
                      onCheck={this.sameSetsCheck}
                      disabled={!this.state.listNotEmpty}
                      label="Same sets throughout"
                      defaultChecked={true}
                      style={styles.checkbox}
                    /> {workoutItemsList}
                    <RaisedButton
                      style={{
                          height: '30px',
                          marginTop: 10,
                      }}
                      label="Add Workout"
                      onClick={this.openWorkoutChooser}
                      primary={true}
                    />
                </Card>
            </MuiThemeProvider>
        );
    }
}

export default WorkoutCard;
