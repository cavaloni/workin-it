import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
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
        this.getExDataFromComponentsAndSave = this.getExDataFromComponentsAndSave.bind(this);
        this.populatedCallback = this.populatedCallback.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.changed = this.changed.bind(this);
        this.setComponentPopulated = this.setComponentPopulated.bind(this);
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

    componentDidMount() {
        this.setComponentPopulated(this.props);
    }

    componentWillUpdate(nextProps) {
        console.log(nextProps);
        console.log('1111111111111111111111111111111111111');
        if (nextProps.weekData !== this.props.weekData) {
            this.setComponentPopulated(nextProps);
        }
    }

    setComponentPopulated(props) {
        const type = this.props.cardType.toLowerCase();
        let itemList;
        let listNotEmpty;
        let isChecked = true;
        let sameSets = true;
        if (!_.isEmpty(props.weekData) && props.weekData[type]) {
            itemList = Object.keys(props.weekData[type]).map((exercise) => {
                if (props.weekData[type][exercise].data.length >= 1) {
                    listNotEmpty = true;
                    isChecked = false;
                    sameSets = false;
                }
                return props.weekData[type][exercise].fullName;
            });
        } else {
            listNotEmpty = false;
            itemList = [];
        }
        this.setState({
            populateWeek: true,
            listNotEmpty,
            itemList,
            isChecked,
            sameSets,
            saveSuggested: false,
        },
                () => this.setState({ populateWeek: false }));
    }

    getExDataFromComponentsAndSave(exerciseData, exercise) {
        const dataToSaveCopy = Array.from(this.tempDataToSave);
        dataToSaveCopy.push({
            exerciseData,
            exercise,
            exerciseGroup: this.props.cardType.toLowerCase(),
        });
        this.tempDataToSave = dataToSaveCopy;
        if (this.tempDataToSave.length === this.state.itemList.length) {
            const dataToSave = _.flatten(dataToSaveCopy);
            let oneDayInWeek;
            if (this.props.selectedWeek === 'This Week') {
                oneDayInWeek = moment().format('MMM DD YY');
            } else { oneDayInWeek = this.props.selectedWeek.slice(0, 9); }
            const week = moment(oneDayInWeek, 'MMM DD YY').week();
            const year = moment(oneDayInWeek, 'MMM DD YY').year();
            this.tempDataToSave = [];
            this.props.dispatch(actions.saveExerciseData(
                this.props.token,
                this.props.profileData.fbId,
                dataToSave,
                year,
                week,
                ));
            this.setState({ dataToSave, triggerSave: false, snackbarOpen: false });
        }
    }

    sameSetsCheck(e) {
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
        this.setState({ triggerSave: true }, () => {
            this.setState({
                triggerSave: false,
                saveSuggested: false });
        });
    }

    openWorkoutChooser(e) {
        e.preventDefault();
        this.setState({ chooseWorkout: true });
    }

    populatedCallback() {
        this.setState({ populateWeek: false });
    }

    deleteItem(item) {
        const itemList = Array.from(this.state.itemList);
        _.remove(itemList, items => items === item);
        this.setState({ itemList });
    }

    changed() {
        this.setState({ saveSuggested: true });
    }

    render() {
        const workoutItemsList = this.state.itemList
            .map(item =>
                <WorkoutItem
                  changed={this.changed}
                  delete={this.deleteItem}
                  populateWeek={this.state.populateWeek}
                  populatedCallback={this.populatedCallback}
                  exerciseGroup={this.props.cardType}
                  triggerSave={this.state.triggerSave}
                  key={item}
                  item={item}
                  sets={this.state.sameSets}
                  saved={this.getExDataFromComponentsAndSave}
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
                      secondary={this.state.saveSuggested}
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
    // the current week the user has selected to dislpay
    selectedWeek: React.PropTypes.string.isRequired,
    // redux store data for the user selected week, or default current week
    weekData: React.PropTypes.shape({}).isRequired,
    // user JWT
    token: React.PropTypes.string.isRequired,
    // the users profile information
    profileData: React.PropTypes.shape({
        fbId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired,
        profileImage: React.PropTypes.string,
        friends: React.PropTypes.array,
    }).isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    profileData: state.userData,
    token: state.userToken,
    weekData: state.oneWeekData,
});

export default connect(mapStateToProps)(WorkoutCard);
