import React, { Component } from 'react';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Divider from 'material-ui/Divider';
import Menu from 'material-ui/Menu';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
import mockData from '../mock-data';
import ExerciseChart from '../chart-card/chart-card';


class Progress extends Component {
    constructor(props) {
        super(props);
        let data;
        if (props.friends !== undefined) {
            data = props.data;
        } else { data = mockData; }
        this.state = {
            friendsProgress: this.props.friends,
            value: this.getDefaultValue(data),
            group: 'all',
            week: 13,
            popoverOpen: false,
            popoverEl: '',
            firstMount: true,
            groupRender: false,
            data,
        };
        this.getDefaultValue = this.getDefaultValue.bind(this);
        this.exerciseValueChange = this.exerciseValueChange.bind(this);
        this.groupValueChange = this.groupValueChange.bind(this);
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
        this.groupSelect = this.groupSelect.bind(this);
        this.getExerciseAverages = this.getExerciseAverages.bind(this);
    }

    componentDidMount() {
        this.setState({ firstMount: false });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.popoverOpen !== this.state.popoverOpen) {
            return true;
        }
        if (nextState.value === this.state.value ||
            nextState.firstMount === this.state.firstMount) {
            return false;
        }
        if (nextState.group !== this.state.group && nextState.groupRender === false
            && nextState.popoverOpen === this.state.popoverOpen) {
            return false;
        }
        return true;
    }

    getDefaultValue(data) {
        const exerciseKey = Object.keys(_.get(data, '10.arms'));
        console.log(exerciseKey);
        return exerciseKey[0];
    }

    groupSelect(e) {
        e.preventDefault();
        this.setState({ group: e.target.innerHTML.toLowerCase(), popoverOpen: false, groupRender: true });
    }

    exerciseValueChange(e) {
        e.preventDefault();
        const dbName = _.findKey(this.state.data[this.state.week][this.state.group],
            { fullName: e.target.innerHTML });
        this.setState({ value: dbName, popoverOpen: false, groupRender: false });
    }

    groupValueChange(e, menuObj) {
        e.preventDefault();
        this.setState({ group: menuObj.props.value, groupRender: false });
    }

    openPopover(e) {
        e.preventDefault();
        this.setState({ popoverOpen: true, popoverEl: e.currentTarget });
    }

    closePopover() {
        this.setState({ popoverOpen: false });
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
                                        weight: curData.weight + accData.weight,
                                        reps: curData.reps + accData.reps,
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

    render() {
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

        if (this.state.group === 'all') {
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
                                                  primaryText={this.state.data[week][curGroup][exercise].fullName}
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
};

export default Progress;
