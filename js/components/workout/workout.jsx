import React, { Component } from 'react';
import { Observable } from 'rxjs';
import _ from 'lodash';
import moment from 'moment';
import qs from 'qs';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import WorkoutCard from '../workout-card/workout-card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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
            }
        };
        this.state = {
            weekRanges: [],
            selectedWeek: 'This Week',
            selectDialogOpen: false,
            import: false,
        };
        this.handleWeekChange = this.handleWeekChange.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.importToThisWeek = this.importToThisWeek.bind(this);
    }

    componentWillMount() {
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
                    if (week === currentWeek) { return; }
                    key++;
                    return <MenuItem value={week} key={key - 1} primaryText={week} />;
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
    }

    handleWeekChange(event, index, value) {
        this.selectedWeek = value;
        this.setState({ selectDialogOpen: true });
    }

    confirm() {
        if (this.state.import) {
            const curWeek = this.props.oneWeekData;
            const dataToSave = _.flatten(Object.keys(curWeek)
                .map(group => Object.keys(curWeek[group])
                    .reduce((acc, cur) => {
                        acc.push({
                            exercise: curWeek[group][cur].fullName,
                            exerciseGroup: group,
                            exerciseData: curWeek[group][cur].data,
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
            this.setState({ selectDialogOpen: false, import: false, selectedWeek: 'This Week' });
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
              onTouchTap={this.confirm}
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
                <DropDownMenu 
                  style={this.style.weekSelector}
                  maxHeight={300} 
                  value={this.state.selectedWeek} 
                  onChange={this.handleWeekChange}
                >
                    {this.state.weekRanges}
                </DropDownMenu>
                {importButton}
                <WorkoutCard cardType="Back" selectedWeek={this.state.selectedWeek} />
                <WorkoutCard cardType="Arms" selectedWeek={this.state.selectedWeek} />
                <WorkoutCard cardType="Shoulders" selectedWeek={this.state.selectedWeek} />
                <WorkoutCard cardType="Legs" selectedWeek={this.state.selectedWeek} />
                <WorkoutCard cardType="Chest" selectedWeek={this.state.selectedWeek} />
                <WorkoutCard cardType="Abs" selectedWeek={this.state.selectedWeek} />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    profileData: state.userData,
    exerciseData: state.exerciseData,
    token: state.userToken,
    oneWeekData: state.oneWeekData,
});


export default connect(mapStateToProps)(Workout);
