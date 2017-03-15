import React, { Component } from 'react';
import ExerciseChart from '../chart-card/chart-card';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Menu from 'material-ui/Menu';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';

const mockData = {
    10: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 180,
                    reps: 4,
                }, {
                    weight: 180,
                    reps: 5,
                }, {
                    weight: 180,
                    reps: 6,
                }],
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 80,
                    reps: 4,
                }],
            },
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 280,
                    reps: 1,
                }, {
                    weight: 280,
                    reps: 2,
                }],
            },
        },
    },
    11: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 185,
                    reps: 4,
                }, {
                    weight: 185,
                    reps: 5,
                }, {
                    weight: 185,
                    reps: 6,
                }],
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 85,
                    reps: 4,
                }],
            },
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 280,
                    reps: 1,
                }, {
                    weight: 280,
                    reps: 2,
                }],
            },
        },
    },
    12: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 190,
                    reps: 4,
                }, {
                    weight: 190,
                    reps: 5,
                }, {
                    weight: 190,
                    reps: 6,
                }],
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 90,
                    reps: 4,
                }],
            },
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 290,
                    reps: 1,
                }, {
                    weight: 290,
                    reps: 2,
                }],
            },
        },
    },
    13: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 200,
                    reps: 5,
                }, {
                    weight: 200,
                    reps: 4,
                }, {
                    weight: 200,
                    reps: 4,
                }],
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 100,
                    reps: 4,
                }],
            },
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 310,
                    reps: 1,
                }, {
                    weight: 300,
                    reps: 2,
                }],
            },
        },
    },
};

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.getDefaultValue(),
            group: 'arms',
            week: 10,
            popoverOpen: false,
            popoverEl: '',
        };
        this.getDefaultValue = this.getDefaultValue.bind(this);
        this.exerciseValueChange = this.exerciseValueChange.bind(this);
        this.groupValueChange = this.groupValueChange.bind(this);
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.popoverOpen !== this.state.popoverOpen) {
            return true;
        }
        if (nextState.value === this.state.value) {
            return false;
        }
        return true;
    }

    getDefaultValue() {
        const exerciseKey = Object.keys(_.get(mockData, '10.arms'));
        console.log(exerciseKey);
        return exerciseKey[0];
    }

    exerciseValueChange(e) {
        const dbName = _.findKey(mockData[this.state.week][this.state.group], { fullName: e.target.innerHTML });
        e.preventDefault();
        this.setState({ value: dbName });
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
        _.flatten(Object.keys(mockData)
            .map((weekSet) => {
                Object.keys(mockData[weekSet])
                    .map((group) => {
                        Object.keys(mockData[weekSet][group])
                            .map((exercise) => {
                                const thisData = mockData[weekSet][group][exercise].data;
                                const fullName = mockData[weekSet][group][exercise].fullName;
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

        const exerciseMenuList = Object.keys(mockData[week])
                                    .reduce((accObj, curGroup) => {
                                        const menuItems = Object.keys(_.get(mockData, `${week}.${curGroup}`))
                                            .map(exercise => <MenuItem onTouchTap={this.exerciseValueChange} value={exercise} primaryText={mockData[week][curGroup][exercise].fullName} />);
                                        return _.set(accObj, `${curGroup}`, menuItems);
                                    }, {});

        return (
            <div>
                <RaisedButton
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
                {filteredCharts}
            </div>
        );
    }
}

export default Progress;
