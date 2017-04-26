import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { compose } from 'redux';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import remove from 'lodash/remove';
import capitalize from 'lodash/capitalize';
import moment from 'moment';
import Checkbox from 'material-ui/Checkbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Card from 'material-ui/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import * as actions from '../../actions/index';

import WorkoutItem from '../workout-item/workout-item';
import WorkoutChooser from '../choose-workout/choose-workout';

import backAvatar from '../../../assets/back.png';
import absAvatar from '../../../assets/abs.png';
import armsAvatar from '../../../assets/arms.png';
import chestAvatar from '../../../assets/chest.png';
import legsAvatar from '../../../assets/legs.png';
import shouldersAvatar from '../../../assets/shoulders.png';

const O = Observable;

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#983D3D',
        primary2Color: '#983D3D',
        primary3Color: '#983D3D',
        accent1Color: '#457898',
        accent2Color: '#457898',
        accent3Color: '#457898',
    },
});

const style = {
    card: {
        height: '20%',
        width: '90%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        verticalAlign: 'top',
        paddingBottom: 10,
    },
    '@media (min-width: 700px)': {
        card: {
            width: '41%',
        },
    },
};

class WorkoutCard extends Component {
    constructor(props) {
        super(props);

        this.openWorkoutChooser = this.openWorkoutChooser.bind(this);
        this.addWorkouts = this.addWorkouts.bind(this);
        this.sameSetsCheck = this.sameSetsCheck.bind(this);
        this.saveData = this.saveData.bind(this);
        this.getChildrenDataAndSave = this.getChildrenDataAndSave.bind(this);
        this.populatedCallback = this.populatedCallback.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.changed = this.changed.bind(this);
        this.setComponentPopulated = this.setComponentPopulated.bind(this);
        this.closeChooser = this.closeChooser.bind(this);
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
            fetchSent: false,
            snackbarMessage: '',
        };
        this.tempDataToSave = [];
        this.workoutItem = (<WorkoutItem />);
    }

    componentDidMount() {
        const type = this.props.cardType.toLowerCase();
        if (this.props.weekData[type] && this.props.weekData[type] !== this.props.weekData[type]) {
            this.setComponentPopulated(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.fetchSent && nextProps.fetchFailed) {
            this.setState({ snackbarOpen: true, snackbarMessage: 'Something went wrong' });
        } else if (this.state.fetchSent && !nextProps.fetchFailed) {
            this.setState({ snackbarOpen: true, snackbarMessage: 'Saved' });
        }
    }

    componentWillUpdate(nextProps) {
        if (!isEmpty(this.props.weekData) && isEmpty(nextProps.weekData)) {
            this.setComponentPopulated(nextProps);
        }
        const type = this.props.cardType.toLowerCase();
        if (nextProps.weekData[type] && nextProps.weekData[type] !== this.props.weekData[type]) {
            this.setComponentPopulated(nextProps);
        }
    }

    componentDidUpdate() {
        if (this.state.snackbarOpen) {
            O.interval(4000)
                .take(1)
                .subscribe(() => {
                    this.setState({ snackbarOpen: false });
                    this.props.dispatch(actions.resetFetchFailure());
                });
        }
    }

    setComponentPopulated(props) {
        const type = this.props.cardType.toLowerCase();
        let itemList;
        let listNotEmpty;
        let isChecked;
        let sameSets = true;
        if (!isEmpty(props.weekData) && props.weekData[type]) {
            itemList = Object.keys(props.weekData[type]).map((exercise) => {
                if (props.weekData[type][exercise].data.length >= 1) {
                    listNotEmpty = true;
                }
                if (props.weekData[type][exercise].data.length > 1) {
                    isChecked = false;
                    sameSets = false;
                } else { isChecked = true; }
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

    getChildrenDataAndSave(exerciseData, exercise, sets) {
        const dataToSaveCopy = Array.from(this.tempDataToSave);
        dataToSaveCopy.push({
            exerciseData,
            exercise,
            exerciseGroup: this.props.cardType.toLowerCase(),
            sets,
        });
        this.tempDataToSave = dataToSaveCopy;
        if (this.tempDataToSave.length === this.state.itemList.length) {
            const dataToSave = flatten(dataToSaveCopy);
            let oneDayInWeek;
            if (this.props.selectedWeek === 'This Week') {
                oneDayInWeek = moment().format('MMM DD YY');
            } else { oneDayInWeek = this.props.selectedWeek.slice(0, 9); }
            const week = moment(oneDayInWeek, 'MMM DD YY').week();
            const year = moment(oneDayInWeek, 'MMM DD YY').year();
            this.tempDataToSave = []; // reset instance variable
            this.props.dispatch(actions.saveExerciseData(
                this.props.token,
                this.props.profileData.fbId,
                dataToSave,
                year,
                week,
                ));
            this.setState({ dataToSave, triggerSave: false, fetchSent: true });
        }
    }

    sameSetsCheck(e) {
        e.preventDefault();
        this.setState({ sameSets: !this.state.sameSets, isChecked: !this.state.isChecked });
    }

    closeChooser() {
        this.setState({ chooseWorkout: false });
    }

    addWorkouts(value) {
        let exName;
        if (typeof (value) === 'string') {
            exName = value;
        } else {
            exName = this.props.profileData.exercisesList[this.props.cardType.toLowerCase()][value];
        }
        const newArry = Array.from(this.state.itemList);
        newArry.push(capitalize(exName));
        this.setState({ itemList: newArry, chooseWorkout: false, listNotEmpty: true });
    }

    saveData() {
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
        remove(itemList, items => items === item);
        this.setState({ itemList });
    }

    changed() {
        this.setState({ saveSuggested: true });
    }

    render() {
        const { classes } = this.props;

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
                  saved={this.getChildrenDataAndSave}
                />);

        let avatar;
        switch (this.props.cardType.toLowerCase()) {
            case 'abs':
                avatar = absAvatar;
                break;
            case 'back':
                avatar = backAvatar;
                break;
            case 'shoulders':
                avatar = shouldersAvatar;
                break;
            case 'legs':
                avatar = legsAvatar;
                break;
            case 'arms':
                avatar = armsAvatar;
                break;
            case 'chest':
                avatar = chestAvatar;
                break;
            // no default
        }

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Card className={classes.card}>
                    <WorkoutChooser
                      exercisesList={this.props.profileData.exercisesList}
                      closer={this.closeChooser}
                      opener={this.state.chooseWorkout}
                      clicker={this.addWorkouts}
                      type={this.props.cardType}
                    />
                    <CardHeader
                      avatar={<Avatar
                        src={avatar}
                        backgroundColor={'none'}
                      />}
                      style={{ backgroundColor: '#E57373' }}
                      title={this.props.cardType}
                      titleStyle={{
                          fontSize: '20px',
                      }}
                    />
                    <Divider style={{ margin: 0 }} />
                    {workoutItemsList}
                    <Checkbox
                      onCheck={this.sameSetsCheck}
                      disabled={!this.state.listNotEmpty}
                      label="Same reps in sets"
                      labelStyle={{ right: '13%' }}
                      checked={this.state.isChecked}
                      style={{ display: this.state.listNotEmpty ? 'block' : 'none' }}
                    />
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
                      message={this.state.snackbarMessage}
                      autoHideDuration={4000}
                      onRequestClose={this.handleRequestClose}
                    />
                </Card>
            </MuiThemeProvider>
        );
    }
}

WorkoutCard.propTypes = {
    classes: React.PropTypes.shape({}).isRequired,
    // determines the exercise group card type(arms, chest, etc)
    cardType: React.PropTypes.string.isRequired,
    // the current week the user has selected to dislpay
    selectedWeek: React.PropTypes.string.isRequired,
    // redux store data for the user selected week, or default current week
    weekData: React.PropTypes.shape({}).isRequired,
    // error handling prop on bad server fetches
    fetchFailed: React.PropTypes.bool.isRequired, // eslint-disable-line
    // user JWT
    token: React.PropTypes.string.isRequired,
    // the users profile information
    profileData: React.PropTypes.shape({
        fbId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired,
        profileImage: React.PropTypes.string,
        friends: React.PropTypes.array,
        exercisesList: React.PropTypes.array,
    }).isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    fetchFailed: state.fetchFailed,
    exerciseData: state.exerciseData,
    profileData: state.userData,
    token: state.userToken,
    weekData: state.oneWeekData,
});

const enhance = compose(
  connect(mapStateToProps),
injectSheet(style),
);

export default enhance(WorkoutCard);
