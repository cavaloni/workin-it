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
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';

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
        this.saveData = this.saveData.bind(this);
        this.state = {
            itemList: [],
            chooseWorkout: false,
            listNotEmpty: false,
            sameSets: true,
            snackbarOpen: false,
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
        this.setState({ sameSets: checked });
    }

    saveData() {
        this.setState({ snackbarOpen: true });
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
                      labelStyle={{right: '50px' }}
                      defaultChecked={true}
                      style={styles.checkbox}
                    /> {workoutItemsList}
                    <FloatingActionButton
                      style={{
                          position: 'relative',
                          marginTop: 10,
                          right: '75px',
                          display: 'inline-block',
                      }}
                      mini={true}
                      onClick={this.openWorkoutChooser}
                      
                    > <ContentAdd /> 
                    </ FloatingActionButton>
                    <RaisedButton 
                        disabled={!this.state.listNotEmpty}
                        label="Save"
                        onClick={this.saveData}
                        style={{
                            position: 'relative',
                            bottom: '10px',
                            left: 75,
                        }}>
                    </RaisedButton>
                    <Snackbar
                        open={this.state.snackbarOpen}
                        message="Saved"
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                    />
                </Card>
            </MuiThemeProvider>
        );
    }
}

export default WorkoutCard;
