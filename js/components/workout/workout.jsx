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

const O = Observable;

class Workout extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            weekRanges: [],
            selectedWeek: 'This Week',
            selectDialogOpen: false,
        };
        this.handleWeekChange = this.handleWeekChange.bind(this);
        this.confirmWeekChange = this.confirmWeekChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
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
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.selectedWeek !== this.state.selectedWeek) {
            const oneDayInWeek = nextState.selectedWeek.slice(0, 9);
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

    confirmWeekChange() {
        this.setState({ selectedWeek: this.selectedWeek, selectDialogOpen: false });
    }

    handleModalClose() {
        this.setState({ selectDialogOpen: false });
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
              onTouchTap={this.confirmWeekChange}
            />,
        ];

        return (
            <div>
                <Dialog
                  key={1}
                  autoScrollBodyContent
                  title="Confirm Week Change"
                  actions={modalActions}
                  modal
                  open={this.state.selectDialogOpen}
                >
                Changing the week you will lose any unsaved data. Continue?
                </Dialog>
                <DropDownMenu maxHeight={300} value={this.state.selectedWeek} onChange={this.handleWeekChange}>
                    {this.state.weekRanges}
                </DropDownMenu>
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

const mapStateToProps = (state, props) => ({
    profileData: state.userData,
    exerciseData: state.exerciseData,
    token: state.userToken,
});


export default connect(mapStateToProps)(Workout);
