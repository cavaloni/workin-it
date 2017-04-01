import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Checkbox from 'material-ui/Checkbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardHeader } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import * as actions from '../../actions/index';


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
        this.getExDataFromComponents = this.getExDataFromComponents.bind(this);
        this.state = {
            itemList: [],
            chooseWorkout: false,
            listNotEmpty: false,
            sameSets: true,
            snackbarOpen: false,
            tiggerSave: false,
            dataToSave: [],
        };
        this.tempDataToSave = [];
        this.workoutItem = (<WorkoutItem />);
    }

    getExDataFromComponents(exerciseData, exercise) {
        const dataToSaveCopy = Array.from(this.tempDataToSave);
        dataToSaveCopy.push({
            exerciseData,
            exercise,
            exerciseGroup: this.props.cardType.toLowerCase(),
        });
        this.tempDataToSave = dataToSaveCopy;
        if (this.tempDataToSave.length === this.state.itemList.length) {
            const dataToSave = _.flatten(dataToSaveCopy);
            this.tempDataToSave = [];
            this.props.dispatch(actions.saveExerciseData(
                this.props.token,
                this.props.profileData.fbId, 
                dataToSave,
                ))
            this.setState({ dataToSave, triggerSave: false, snackbarOpen: false });
        }
    }

    sameSetsCheck(e, checked) {
        this.setState({ sameSets: checked });
    }

    addWorkouts(value) {
        let idx;
        if (typeof (value) === 'string') {
            fakeworks.push(value);
            idx = fakeworks.indexOf(value);
        } else { idx = value; }
        const newArry = Array.from(this.state.itemList);
        newArry.push(idx);
        this.setState({ itemList: newArry, chooseWorkout: false, listNotEmpty: true });
    }

    saveData() {
        this.setState({ snackbarOpen: true });
        this.setState({ triggerSave: true }, () => { this.setState({ triggerSave: false }); });
    }

    openWorkoutChooser(e) {
        e.preventDefault();
        this.setState({ chooseWorkout: true });
    }

    render() {
        const workoutItemsList = this.state.itemList
            .map(itemIndex =>
                <WorkoutItem
                  triggerSave={this.state.triggerSave}
                  key={itemIndex}
                  item={fakeworks[itemIndex]}
                  sets={this.state.sameSets}
                  saved={this.getExDataFromComponents}
                />);
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
                      labelStyle={{ right: '13%' }}
                      defaultChecked
                      style={styles.checkbox}
                    /> {workoutItemsList}
                    <FloatingActionButton
                      style={{
                          position: 'relative',
                          marginTop: 10,
                          right: '19%',
                          display: 'inline-block',
                      }}
                      mini
                      onClick={this.openWorkoutChooser}

                    > <ContentAdd />
                    </FloatingActionButton>
                    <RaisedButton
                      disabled={!this.state.listNotEmpty}
                      label="Save"
                      onClick={this.saveData}
                      style={{
                          position: 'relative',
                          bottom: '10px',
                          left: '19%',
                      }}
                    />
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

WorkoutCard.propTypes = {
    // determines the exercise group card type(arms, chest, etc)
    cardType: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => ({ 
    profileData: state.userData, 
    token: state.userToken, 
});

export default connect(mapStateToProps)(WorkoutCard);
