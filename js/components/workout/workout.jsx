import React, { Component } from 'react';
import { Observable } from 'rxjs';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import WorkoutCard from '../workout-card/workout-card';
import * as actions from '../../actions/index';


const O = Observable;

class Workout extends Component {
    constructor(props, context) {
        super(props, context);
        this.style = {
            weekSelector: {
                display: 'block',
                width: '200px',
            },
            copy: {
                margin: '10px',
                display: 'block',
                width: '190px',
            },
        };
        this.state = {
            weekRanges: [],
            selectedWeek: 'This Week',
            selectDialogOpen: false,
            import: false,
        };
        this.handleWeekChange = this.handleWeekChange.bind(this);
        this.confirmImport = this.confirmImport.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.importToThisWeek = this.importToThisWeek.bind(this);
    }

    componentWillMount() {
        if (this.props.token === '') {
            this.props.dispatch(actions.setUserProfile());
        } else { this.getExerciseData(); }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.selectedWeek !== this.state.selectedWeek) {
            let oneDayInWeek;
            if (nextState.selectedWeek === 'This Week') {
                oneDayInWeek = moment().format('MMM DD YY');
            } else { oneDayInWeek = nextState.selectedWeek.slice(0, 9); }
            const week = moment(oneDayInWeek, 'MMM DD YY').week();
            const year = moment(oneDayInWeek, 'MMM DD YY').year();
            this.props.dispatch(actions.getExerciseData(
                    this.props.token,
                    this.props.profileData.fbId,
                    year,
                    week,
                    true,
            ));
        }
        if (this.state.import && this.props.exerciseData !== nextProps.exerciseData) {
            this.setState({ selectedWeek: 'This Week', import: false });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.profileData !== prevProps.profileData) {
            this.getExerciseData();
        }
    }


    getExerciseData() {
        O.ajax({
            url: '/exercise_data/get_weeks',
            body: { user: this.props.profileData.fbId },
            headers: { token: this.props.token },
            method: 'PUT',
        })
        .subscribe((response) => {
            const weekRanges = response.response.weekRanges[0];
            const currentWeek = `${moment().startOf('week').format('MMM DD YY')} to ${moment().endOf('week').format('MMM DD YY')}`;
            let key = 0;
            const weekRangesList = _.flatten(Object.keys(weekRanges).map(year =>
                weekRanges[year].map((week) => {
                    if (week === currentWeek) { return; } // eslint-disable-line
                    key += 1;
                    return <MenuItem value={week} key={key - 1} primaryText={week} />; // eslint-disable-line
                })));
            const orderedWeekRangesList = _.reverse(weekRangesList);
            orderedWeekRangesList.unshift(<MenuItem value={'This Week'} key={key} primaryText={'This Week'} />);
            this.setState({ weekRanges: weekRangesList });
        });
        this.props.dispatch(actions.getExerciseData(
                    this.props.token,
                    this.props.profileData.fbId,
                    moment().year().toString(),
                    moment().week().toString(),
                    true,
            ));
    }

    handleWeekChange(event, index, value) {
        this.selectedWeek = value;
        this.setState({ selectDialogOpen: true });
    }

    confirmImport() {
        if (this.state.import) {
            const curWeek = this.props.oneWeekData;
            const dataToSave = _.flatten(Object.keys(curWeek)
                .map(group => Object.keys(curWeek[group])
                    .reduce((acc, cur) => {
                        acc.push({
                            exercise: curWeek[group][cur].fullName,
                            exerciseGroup: group,
                            exerciseData: curWeek[group][cur].data,
                            sets: curWeek[group][cur].sets,
                        });
                        return acc;
                    }, []),
                ));
            const week = moment().week();
            const year = moment().year();
            this.props.dispatch(actions.saveExerciseData(
                this.props.token,
                this.props.profileData.fbId,
                dataToSave,
                year,
                week,
            ));
            this.setState({ selectDialogOpen: false });
        } else { this.setState({ selectedWeek: this.selectedWeek, selectDialogOpen: false }); }
    }

    handleModalClose() {
        this.setState({ selectDialogOpen: false });
    }

    importToThisWeek() {
        this.setState({ selectDialogOpen: true, import: true });
    }

    render() {
        const modalActions = [
            <FlatButton
              label="Cancel"
              primary
              onTouchTap={this.handleModalClose}
            />,
            <FlatButton
              label="Confirm"
              primary
              onTouchTap={this.confirmImport}
            />,
        ];

        let importButton;
        if (this.state.selectedWeek !== 'This Week') {
            importButton = (<RaisedButton
              style={this.style.copy}
              label="Copy To This Week"
              onTouchTap={this.importToThisWeek}
            />);
        } else importButton = '';

        const modalInfo = {};
        if (this.state.import) {
            modalInfo.title = 'Comfirm Week Import';
            modalInfo.content = 'Importing to current week will overwrite exercises you already have in this week. Continue?';
        } else {
            modalInfo.title = 'Confirm Week Change';
            modalInfo.content = 'Changing the week you will lose any unsaved data. Continue?';
        }

        let dropDownMenu;

        if (this.state.weekRanges.length > 0) {
            dropDownMenu = (<DropDownMenu
              style={this.style.weekSelector}
              maxHeight={300}
              value={this.state.selectedWeek}
              onChange={this.handleWeekChange}
            >
                {this.state.weekRanges}
            </DropDownMenu>);
        } else { dropDownMenu = <div />; }

        return (
            <div>
                <Dialog
                  key={1}
                  autoScrollBodyContent
                  title={modalInfo.title}
                  actions={modalActions}
                  modal
                  open={this.state.selectDialogOpen}
                >
                    {modalInfo.content}
                </Dialog>
                {dropDownMenu}
                {importButton}
                <WorkoutCard
                  cardType="Back"
                  selectedWeek={this.state.selectedWeek}
                />
                <WorkoutCard
                  cardType="Arms"
                  selectedWeek={this.state.selectedWeek}
                />
                <WorkoutCard
                  cardType="Shoulders"
                  selectedWeek={this.state.selectedWeek}
                />
                <WorkoutCard
                  cardType="Legs"
                  selectedWeek={this.state.selectedWeek}
                />
                <WorkoutCard
                  cardType="Chest"
                  selectedWeek={this.state.selectedWeek}
                />
                <WorkoutCard
                  cardType="Abs"
                  selectedWeek={this.state.selectedWeek}
                />
            </div>
        );
    }
}

Workout.propTypes = {
    // the users exercise data from redux store
    exerciseData: React.PropTypes.shape({}).isRequired,
    // redux store data for the user selected week, or default current week
    oneWeekData: React.PropTypes.shape({}).isRequired,
    // the users JWT
    token: React.PropTypes.string.isRequired,
    // the users profile information from redux store
    profileData: React.PropTypes.shape({
        fbId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired,
        profileImage: React.PropTypes.string,
        friends: React.PropTypes.array,
    }).isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    profileData: state.userData,
    token: state.userToken,
    oneWeekData: state.oneWeekData,
    exerciseData: state.exerciseData,
});


export default connect(mapStateToProps)(Workout);
