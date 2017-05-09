import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Divider from 'material-ui/Divider';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import PopoverAnimationVertical from 'material-ui/Popover/PopoverAnimationVertical';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import has from 'lodash/has';
import capitalize from 'lodash/capitalize';
import set from 'lodash/set';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import toNumber from 'lodash/toNumber';
import isEmpty from 'lodash/isEmpty';
import findKey from 'lodash/findKey';
import ExerciseChart from '../chart-card/chart-card';
import * as actions from '../../actions/index';

const Loader = require('halogen/BounceLoader');

const style = {
    noData: {
        fontFamily: 'Roboto, sans-serif',
        textAlign: 'center',
    },
    loader: {
        marginTop: 200,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        position: 'relative',
        left: 'calc(50% - 60px)',
    },
};

class Progress extends Component {
    constructor(props) {
        super(props);
        let data;
        if (props.friends !== undefined) {
            data = props.data;
        } else { data = props.exerciseData; }
        this.state = {
            friendsProgress: this.props.friends,
            value: '',
            group: 'all',
            week: moment().week(),
            popoverOpen: false,
            popoverEl: '',
            firstMount: true,
            groupRender: false,
            waitedForLoad: false,
            spinner: true,
            noDataThisWeek: false,
            data,
        };
        this.exerciseValueChange = this.exerciseValueChange.bind(this);
        this.groupValueChange = this.groupValueChange.bind(this);
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
        this.groupSelect = this.groupSelect.bind(this);
        this.getExerciseAverages = this.getExerciseAverages.bind(this);
        this.weekSet = this.weekSet.bind(this);
        this.loader = this.loader.bind(this);

        this.trackMenuChanges = { // track changes so that does not re-render wrong from state.group
            group: '',
            exercise: '',
            origGroup: '',
        };
    }

    componentWillMount() {
        if (this.props.friends !== undefined) {
            this.loader(this.props); // the problem is here at loader
        }
        if (this.props.friends !== undefined) {
            return;
        }
        if (this.props.token === '') {
            this.props.dispatch(actions.setUserProfile());
        } else {
            this.props.dispatch(actions.getExerciseData(
                this.props.token, this.props.profileData.fbId));
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.exerciseData !== this.props.exerciseData) ||
            nextProps.data !== this.props.data) {
            this.loader(nextProps);
        }
        this.weekSet(nextProps.exerciseData);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.popoverOpen !== this.state.popoverOpen) {
            return true;
        }
        if (nextState.group !== this.state.group && nextState.groupRender === false
            && nextState.popoverOpen === this.state.popoverOpen) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps) {
        if (this.props.profileData !== prevProps.profileData) {
            this.props.dispatch(actions.getExerciseData(
                this.props.token, this.props.profileData.fbId));
        }
    }

    // getExerciseAverages maps through the depth of the data to get each individual
    // average for each exercise. Averages are used so that even if the reps or weights
    // are different through each set, only one value will be displayed, the average,
    // for each chart to represent data more clearly.

    getExerciseAverages() {
        const parsedAvgs = {};
        let exerciseIndex = 0;
        Object.keys(this.state.data)
            .forEach((weekSet) => {
                Object.keys(this.state.data[weekSet])
                    .forEach((group) => {
                        Object.keys(this.state.data[weekSet][group])
                            .forEach((exercise) => {
                                const thisData = this.state.data[weekSet][group][exercise].data;
                                const fullName = this.state.data[weekSet][group][exercise].fullName;
                                const sum = thisData
                                    .reduce((accData, curData) => ({
                                        weight: toNumber(curData.weight) +
                                            toNumber(accData.weight),
                                        reps: toNumber(curData.reps) +
                                            toNumber(accData.reps),
                                    }));
                                set(parsedAvgs, `${group}.${exercise}[${exerciseIndex}]`, {
                                    fullName,
                                    week: weekSet,
                                    weight: sum.weight / thisData.length,
                                    reps: sum.reps / thisData.length,
                                });
                                parsedAvgs[group][exercise].fullName = fullName;
                                exerciseIndex += 1;
                            });
                    });
            });
        return parsedAvgs;
    }

    loader(props) {
        const objectToCheck = !this.props.friends ? props.exerciseData : props.data;
        if (isEmpty(objectToCheck) || objectToCheck === 'no data' ||
            !has(objectToCheck, this.state.week)) {
            this.setState({ noDataThisWeek: true, spinner: false });
        } else {
            this.setState({ spinner: false, noDataThisWeek: false });
        }
    }

    weekSet(eData) {
        if (eData) {
            let week;
            if (!eData[this.state.week]) {
                week = moment().subtract(1, 'w').week();
            } else { week = moment().week(); }
            this.setState({ data: eData, week });
        }
    }

    groupSelect(e) {
        e.preventDefault();
        const group = e.target.innerHTML.toLowerCase();
        this.setState({ group, popoverOpen: false, groupRender: true });
    }

    exerciseValueChange(e) {
        e.preventDefault();
        const dbName = findKey(this.state.data[this.state.week][this.state.group],
            { fullName: e.target.innerHTML });
        this.trackMenuChanges.exercise = dbName;
        this.setState({ value: dbName, popoverOpen: false, groupRender: false });
    }

    groupValueChange(e, menuObj) {
        e.preventDefault();
        const group = menuObj.props.value;
        this.trackMenuChanges.group = group;
        this.setState({ group, groupRender: false });
    }

    openPopover(e) {
        e.preventDefault();
        this.trackMenuChanges.origGroup = this.state.group;
        this.setState({ popoverOpen: true, popoverEl: e.currentTarget });
    }

    closePopover() {
        if (this.trackMenuChanges.group !== '' && this.trackMenuChanges.exercise !== '') {
            this.setState({ popoverOpen: false });
        } else {
            this.setState({ popoverOpen: false, group: this.trackMenuChanges.origGroup });
        }
        this.trackMenuChanges = {
            group: '',
            value: '',
            origGroup: '',
        };
    }

    render() {
        if (this.state.spinner) {
            return (
                <div style={{ height: '100vh', width: '100%' }}>
                    <div style={style.loader}>
                        <Loader color="#FFCDD2" size="120px" margin="120px" />
                    </div>
                </div>
            );
        }

        let friendHeading = <div />;
        if (this.props.selectedFriend) {
            friendHeading = <h3>{this.props.selectedFriend}s Workouts</h3>;
        }

        if (this.state.noDataThisWeek) {
            return (
                <div>
                    <h1 style={style.noData}>No Data For This Week</h1>
                </div>
            );
        }


        const week = this.state.week;

        const parsedAvgs = this.getExerciseAverages();

        const allCharts = flatten(Object.keys(parsedAvgs)
                    .map(group => Object.keys(parsedAvgs[group])
                        .map((exercise) => {
                            const name = parsedAvgs[group][exercise].fullName;
                            return (
                                <div>
                                    <ExerciseChart exercise={name} week={week} name={`${name} Weights`} type="weights" data={parsedAvgs[group][exercise]} />
                                    <ExerciseChart exercise={name} week={week} name={`${name} Reps`} type="reps" data={parsedAvgs[group][exercise]} />
                                </div>
                            );
                        })));

        const group = this.state.group;
        const selectedExercise = this.state.value;

        let filteredCharts;

        if (this.state.group === 'all' || (this.state.value === '' && !this.state.groupRender)) {
            filteredCharts = undefined;
        } else if (this.state.groupRender) {
            filteredCharts = Object.keys(this.state.data[week][group])
                    .map((exercise) => {
                        const name = parsedAvgs[group][exercise].fullName;
                        return (
                            <div>
                                <ExerciseChart exercise={name} week={week} name={`${name} Weights`} type="weights" data={parsedAvgs[group][exercise]} />
                                <ExerciseChart exercise={name} week={week} name={`${name} Reps`} type="reps" data={parsedAvgs[group][exercise]} />
                            </div>);
                    });
        } else {
            const name = parsedAvgs[group][selectedExercise].fullName;
            filteredCharts = (<div>
                <ExerciseChart exercise={name} week={week} name={`${name} Weights`} type="weights" data={parsedAvgs[group][selectedExercise]} />
                <ExerciseChart exercise={name} week={week} name={`${name} Reps`} type="reps" data={parsedAvgs[group][selectedExercise]} />
            </div>);
        }

        const exerciseMenuList = Object.keys(this.state.data[week])
                                    .reduce((accObj, curGroup) => {
                                        const menuItems = Object.keys(get(this.state.data, `${week}.${curGroup}`))
                                            .map(exercise =>
                                                <MenuItem
                                                  onTouchTap={this.exerciseValueChange}
                                                  value={exercise}
                                                  primaryText={
                                                      this.state.data[week][curGroup][exercise]
                                                        .fullName
                                                  }
                                                />);
                                        return set(accObj, `${curGroup}`, menuItems);
                                    }, {});

        exerciseMenuList.group = Object.keys(this.state.data[week])
                                .map(exerciseGroup =>
                                    <MenuItem
                                      onTouchTap={this.groupSelect}
                                      value={exerciseGroup}
                                      primaryText={capitalize(exerciseGroup)}
                                    />,
                                );
        exerciseMenuList.group.push(
            <MenuItem
              onTouchTap={this.groupSelect}
              value="All"
              primaryText="All"
            />);

        let charts;
        if (this.state.group === 'all') {
            charts = allCharts;
        } else { charts = filteredCharts; }

        return (
            <div>
                {friendHeading}
                <RaisedButton
                  style={{
                      margin: '20px',
                  }}
                  primary
                  onTouchTap={this.openPopover}
                  label="Filter Workouts"
                />
                <Popover
                  open={this.state.popoverOpen}
                  anchorEl={this.state.popoverEl}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  onRequestClose={this.closePopover}
                  animation={PopoverAnimationVertical}
                >
                    <Menu value={this.state.value} onItemTouchTap={this.groupValueChange} >
                        <MenuItem
                          value={'groups'} primaryText="Groups"
                          menuItems={exerciseMenuList.group}
                          rightIcon={<ArrowDropRight />}
                        />
                        <Divider />
                        <MenuItem
                          value={'arms'} primaryText="Arms"
                          menuItems={exerciseMenuList.arms}
                          rightIcon={<ArrowDropRight />}
                        />
                        <MenuItem
                          value={'back'}
                          primaryText="Back"
                          menuItems={exerciseMenuList.back}
                          rightIcon={<ArrowDropRight />}
                        />
                        <MenuItem
                          value={'legs'}
                          primaryText="Legs"
                          menuItems={exerciseMenuList.legs}
                          rightIcon={<ArrowDropRight />}
                        />
                        <MenuItem
                          value={'chest'}
                          primaryText="Chest"
                          menuItems={exerciseMenuList.chest}
                          rightIcon={<ArrowDropRight />}
                        />
                        <MenuItem
                          value={'abs'}
                          primaryText="Abs"
                          menuItems={exerciseMenuList.abs}
                          rightIcon={<ArrowDropRight />}
                        />
                        <MenuItem
                          value={'calves'}
                          primaryText="Calves"
                          menuItems={exerciseMenuList.calves}
                          rightIcon={<ArrowDropRight />}
                        />
                    </Menu>
                </Popover >
                {charts}
            </div>
        );
    }
}

Progress.propTypes = {
    selectedFriend: React.PropTypes.string, // eslint-disable-line
    // sets up component to work with friend's data
    friends: React.PropTypes.bool.isRequired,
    // users data in form of week, reps, sets, weight
    data: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired,
    // the users exercise data from redux store
    exerciseData: React.PropTypes.shape({}).isRequired,
    // the users JWT
    token: React.PropTypes.string.isRequired,
    // the users profile information from redux store
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
    profileData: state.userData,
    exerciseData: state.exerciseData.data,
    token: state.userToken,
});

const enhance = compose(
  connect(mapStateToProps),
);

export default enhance(Progress);
