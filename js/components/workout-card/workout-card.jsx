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
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import WorkoutItem from '../workout-item/workout-item';
import WorkoutChooser from '../choose-workout/choose-workout';

import styles from './styles.css';

const style = {
    height: '20%',
    width: '41%',
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
    verticalAlign: 'top',
    paddingBottom: 10,
};

const fakeworks = ['Pull-Ups', 'Deadlift', 'Fatties', 'Heavy Shit', 'Overhead Tricep Press', 'hats', 'cats'];

class WorkoutCard extends Component {
    constructor(props) {
        super(props);
        this.openWorkoutChooser = this.openWorkoutChooser.bind(this);
        this.addWorkouts = this.addWorkouts.bind(this);
        this.state = {
            itemList: [],
            chooseWorkout: false,
        };
        this.workoutItem = (<WorkoutItem />);
    }

    openWorkoutChooser(e) {
        console.log('this worked');
        e.preventDefault();
        this.setState({ chooseWorkout: true });
        // const newArry = Array.from(this.state.itemList);
        // newArry.push(<WorkoutItem />)
        // this.setState( {itemList: newArry });
    }

    addWorkouts(idx) {
        const newArry = Array.from(this.state.itemList);
        newArry.push(<WorkoutItem key={idx} item={fakeworks[idx]} />);
        this.setState({ itemList: newArry, chooseWorkout: false });
    }

    render() {
        // let chooser;
        // if (this.state.chooseWorkout) {
        //     chooser = <WorkoutChooser open={this.state.chooseWork} clicker={this.clicker} />;
        // } else { chooser = <div />; }
        return (
            <MuiThemeProvider>
                
                    <Card style={style}>
                        <WorkoutChooser opener={this.state.chooseWorkout} clicker={this.addWorkouts} />
                        <CardHeader title={this.props.cardType} titleStyle={{ fontSize: '20px' }} />
                        <Checkbox
                            label="Same sets throughout"
                            defaultChecked={true}
                            style={styles.checkbox}

                        />
                        {this.state.itemList}
                        <RaisedButton style={{ height: '30px' }} label="Add Workout" onClick={this.openWorkoutChooser} />
                    </Card>
                
            </MuiThemeProvider>
        );
    }
}

export default WorkoutCard;
