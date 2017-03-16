import React, { Component } from 'react';
import ExerciseChart from '../chart-card/chart-card';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Menu from 'material-ui/Menu';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import mockData from '../mock-data.js';


class Progress extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        let data;
        if (props.friends !== undefined) {
            data = props.data;
        } else { data = mockData; }
        this.state = {
            friendsProgress: false,
            value: this.getDefaultValue(data),
            group: 'arms',
            week: 13,
            popoverOpen: false,
            popoverEl: '',
            firstMount: true,
            data,
        };
        console.log(this.state);
        this.getDefaultValue = this.getDefaultValue.bind(this);
        this.exerciseValueChange = this.exerciseValueChange.bind(this);
        this.groupValueChange = this.groupValueChange.bind(this);
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
    }

    componentWillMount() {
        if (this.props.friends) {
            this.setState({ friendsProgress: true} )
        }   
    }
    
    componentDidMount() {
        this.setState({ firstMount: false })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.popoverOpen !== this.state.popoverOpen) {
            return true;
        }
        if (nextState.value === this.state.value || nextState.firstMount === this.state.firstMount) {
            return false;
        }
        return true;
    }

    getDefaultValue(data) {
        const exerciseKey = Object.keys(_.get(data, '10.arms'));
        console.log(exerciseKey);
        return exerciseKey[0];
    }

    exerciseValueChange(e) {
        const dbName = _.findKey(this.state.data[this.state.week][this.state.group], { fullName: e.target.innerHTML });
        e.preventDefault();
        this.setState({ value: dbName, popoverOpen: false });
    }

    groupValueChange(e, menuObj) {
        e.preventDefault();
        this.setState({ group: menuObj.props.value });
    }

    openPopover(e) {
        e.preventDefault();
        this.setState({ popoverOpen: true, popoverEl: e.currentTarget });
    }

    closePopover() {
        this.setState({ popoverOpen: false });
    }

    render() {
        const parsedAvgs = {};
        let exerciseIndex = 0;
        _.flatten(Object.keys(this.state.data)
            .map((weekSet) => {
                Object.keys(this.state.data[weekSet])
                    .map((group) => {
                        Object.keys(this.state.data[weekSet][group])
                            .map((exercise) => {
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
            }),
        );

        console.log(parsedAvgs);

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
        const name = parsedAvgs[group][selectedExercise].fullName;

        const filteredCharts = (<div>
            <ExerciseChart exercise={name} week={week} name={`${name} Weights`} type="weights" data={parsedAvgs[group][selectedExercise]} />
            <ExerciseChart exercise={name} week={week} name={`${name} Reps`} type="reps" data={parsedAvgs[group][selectedExercise]} />
        </div>);

        const exerciseMenuList = Object.keys(this.state.data[week])
                                    .reduce((accObj, curGroup) => {
                                        const menuItems = Object.keys(_.get(this.state.data, `${week}.${curGroup}`))
                                            .map(exercise => <MenuItem onTouchTap={this.exerciseValueChange} value={exercise} primaryText={this.state.data[week][curGroup][exercise].fullName} />);
                                        return _.set(accObj, `${curGroup}`, menuItems);
                                    }, {});

        let charts;
        if (this.state.firstMount) {
            charts = allCharts;
        } else { charts = filteredCharts };

        return (
            <div>
                <RaisedButton
                  style={{
                      margin: '20px'
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

export default Progress;
