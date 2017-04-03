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

import exercisesList from '../exercise-list';

import WorkoutItem from '../workout-item/workout-item';
import WorkoutChooser from '../choose-workout/choose-workout';

import styles from './styles.css';

// TODO: need to pass in the category of workout 'arms' 'back' to the workout item so it can access the oneWeekData object

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
        this.populatedCallback = this.populatedCallback.bind(this)
        this.state = {
            itemList: [],
            chooseWorkout: false,
            listNotEmpty: false,
            sameSets: true,
            isChecked: true,
            snackbarOpen: false,
            tiggerSave: false,
            populateWeek: false,
            dataToSave: [],
        };
        this.tempDataToSave = [];
        this.workoutItem = (<WorkoutItem />);
    }

    componentWillUpdate(nextProps, nextState) {
        const type = this.props.cardType.toLowerCase();
        console.log(nextProps.weekData[type]);
        if (nextProps.weekData !== this.props.weekData && nextProps.weekData[type]) {
            let isChecked = true;
            let sameSets = true;
            const itemList = Object.keys(nextProps.weekData[type]).map((exercise) => {
                console.log(nextProps.weekData[type][exercise].data.length)
                if (nextProps.weekData[type][exercise].data.length > 1) {
                    isChecked = false;
                    sameSets = false;
                }
                return nextProps.weekData[type][exercise].fullName;
            });
            this.setState({
                populateWeek: true,
                listNotEmpty: true,
                itemList,
                isChecked,
                sameSets,
            },
                () => this.setState({ populateWeek: false }));
        }
    }


    getExDataFromComponents(exerciseData, exName) {
        const dataToSaveCopy = Array.from(this.tempDataToSave);
        const exercise = _.camelCase(exName);
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
                ));
            this.setState({ dataToSave, triggerSave: false, snackbarOpen: false });
        }
    }

    sameSetsCheck(e, checked) {
        e.preventDefault();
        this.setState({ sameSets: !this.state.sameSets, isChecked: !this.state.isChecked });
    }

    addWorkouts(value) {
        let exName;
        if (typeof (value) === 'string') {
            exName = value;
        } else { exName = exercisesList[this.props.cardType.toLowerCase()][value]; }
        const newArry = Array.from(this.state.itemList);
        newArry.push(_.capitalize(exName));
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

    populatedCallback() {
        this.setState({ populateWeek: false });
    }

    render() {
        const workoutItemsList = this.state.itemList
            .map(item =>
                <WorkoutItem
                  populateWeek={this.state.populateWeek}
                  populatedCallback={this.populatedCallback}
                  exerciseGroup={this.props.cardType}
                  triggerSave={this.state.triggerSave}
                  key={item}
                  item={item}
                  sets={this.state.sameSets}
                  saved={this.getExDataFromComponents}
                />);

        console.log(this.props.cardType);

        return (
            <MuiThemeProvider>
                <Card style={this.style.card}>
                    <WorkoutChooser
                      opener={this.state.chooseWorkout}
                      clicker={this.addWorkouts}
                      type={this.props.cardType}
                    />
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
                      checked={this.state.isChecked}
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

                    >
                        <ContentAdd />
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
    weekData: state.oneWeekData,
});

export default connect(mapStateToProps)(WorkoutCard);
