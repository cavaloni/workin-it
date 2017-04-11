import React, { Component } from 'react';
import { connect } from 'react-redux';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Divider from 'material-ui/Divider';
import Menu from 'material-ui/Menu';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import _ from 'lodash';
import ExerciseChart from '../chart-card/chart-card';
import * as actions from '../../actions/index';


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
            data,
        };
        this.exerciseValueChange = this.exerciseValueChange.bind(this);
        this.groupValueChange = this.groupValueChange.bind(this);
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
        this.groupSelect = this.groupSelect.bind(this);
        this.getExerciseAverages = this.getExerciseAverages.bind(this);
        this.weekSet = this.weekSet.bind(this);

        this.trackMenuChanges = { // track changes so that does not re-render wrong from state.group
            group: '',
            exercise: '',
            origGroup: '',
        };
    }

    componentWillMount() {
        this.props.dispatch(actions.getExerciseData(this.props.token, this.props.profileData.fbId));
    }

    componentWillReceiveProps(nextProps) {
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
                                        weight: _.toNumber(curData.weight) +
                                            _.toNumber(accData.weight),
                                        reps: _.toNumber(curData.reps) +
                                            _.toNumber(accData.reps),
                                    }));
                                _.set(parsedAvgs, `${group}.${exercise}[${exerciseIndex}]`, {
                                    fullName,
                                    week: weekSet,
                                    weight: sum.weight / thisData.length,
                                    reps: sum.reps / thisData.length,
                                });
                                parsedAvgs[group][exercise].fullName = fullName;
                                exerciseIndex++;
                            });
                    });
            });
        return parsedAvgs;
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
        console.log(group);
        this.setState({ group, popoverOpen: false, groupRender: true });
    }

    exerciseValueChange(e) {
        e.preventDefault();
        const dbName = _.findKey(this.state.data[this.state.week][this.state.group],
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
        if (_.isEmpty(this.state.data || this.state.data === 'no data')) {
            return (
                <div>
                    <h1>No Data</h1>
                </div>
            );
        }

        if (this.props.exerciseData) {
            if (!this.props.exerciseData[this.state.week]) {
                this.weekSet(this.props.exerciseData);
                return (
                    <div>
                        <h1>No Data</h1>
                    </div>
                );
            }
        }

        const parsedAvgs = this.getExerciseAverages();


        const week = this.state.week;

        const allCharts = _.flatten(Object.keys(parsedAvgs)
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
                                        const menuItems = Object.keys(_.get(this.state.data, `${week}.${curGroup}`))
                                            .map(exercise =>
                                                <MenuItem
                                                  onTouchTap={this.exerciseValueChange}
                                                  value={exercise}
                                                  primaryText={
                                                      this.state.data[week][curGroup][exercise].fullName
                                                  }
                                                />);
                                        return _.set(accObj, `${curGroup}`, menuItems);
                                    }, {});

        exerciseMenuList.group = Object.keys(this.state.data[week])
                                .map(exerciseGroup =>
                                    <MenuItem
                                      onTouchTap={this.groupSelect}
                                      value={exerciseGroup}
                                      primaryText={_.capitalize(exerciseGroup)}
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
                <RaisedButton
                  style={{
                      margin: '20px',
                  }}
                  onTouchTap={this.openPopover}
                  label="Select Workout(s)"
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
    }).isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    profileData: state.userData,
    exerciseData: state.exerciseData.data,
    token: state.userToken,
});

export default connect(mapStateToProps)(Progress);
