import React, { Component } from 'react';
import _ from 'lodash';
import Divider from 'material-ui/Divider';
import NumberInput from 'material-ui-number-input';
import FlatButton from 'material-ui/FlatButton';
import SetListItem from '../set-list-item/set-list-item';


class WorkoutItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.styles = {
            container: {
                paddingTop: '0px',
            },
            name: {
                margin: '13px',
                width: '100px',
                display: 'inline-block',
            },
            numberFields: {
                width: '50px',
                display: 'inline-block',
                marginRight: 10,
                verticalAlign: 'bottom',
            },
            checkbox: {
                marginBottom: 16,
                width: '100%',
            },
            divide: {
                marginBottom: 5,
            },
        };
        console.log(this.styles);
        this.state = {
            reps: 0,
            weight: 0,
            sets: 0,
            showSets: false,
            triggerSave: props.triggerSave,
            setsData: [],
        };

        this.onNumberChange = this.onNumberChange.bind(this);
        this.setsButton = this.setsButton.bind(this);
        this.getSetsData = this.getSetsData.bind(this);
        this.saveAll = this.saveAll.bind(this);
    }

    // TODO: FlatButton to show sets keeps returning false (line 102)

    componentWillReceiveProps(nextProps) {
        if (nextProps.sets === true) {
            this.setState({ showSets: false });
        }
        if (nextProps.triggerSave) {
            this.saveAll();
        }
    }

    onNumberChange(e) {
        let shower = this.state.showSets;
        if (e.target.value === 0) {
            shower = false;
        }
        this.setState({
            [e.target.id]: e.target.value,
            showSets: shower,
        });
    }

    setsButton(e) {
        e.preventDefault();
        if (this.state.sets !== 0) {
            this.setState({ showSets: !this.state.showSets });
        }
    }

    getSetsData(setData) {
        const setsDataCopy = Array.from(this.state.setsData)
        const setTypeKey = Object.keys(setData)[0]
        setsDataCopy[setData.setNum] = Object.assign({}, setsDataCopy[setData.setNum], { [setTypeKey]: setData[setTypeKey] });
        this.setState({ setsData: setsDataCopy });
    }

    saveAll() {
        const firstSet = {
            reps: this.state.reps,
            weight: this.state.weight,
        }
        const setsDataCopy = Array.from(this.state.setsData);
        setsDataCopy.unshift(firstSet);
        this.props.saved(setsDataCopy, this.props.item);
    }

    render() {
        if (this.props.sets) {
            _.set(this.styles, 'name.color', 'black');
        } else { _.unset(this.styles, 'name.color'); }
        let noStyle;
        const setList = [];
        if (this.state.showSets) {
            for (let i = 1; i < Number(this.state.sets); i++) {
                setList.push(<SetListItem set={i} getData={this.getSetsData} />);
            }
        }
        if (!this.props.sets) {
            noStyle = {
                color: 'black',
            };
        }
        return (
            <div style={this.styles.container}>
                <div>
                    <FlatButton
                      style={this.styles.name}
                      disabled={this.props.sets}
                      primary={!this.props.sets}
                      secondary={this.props.sets}
                      onClick={this.setsButton}
                    >
                        {this.props.item}
                    </FlatButton>
                    <NumberInput
                      id="reps"
                      value={this.state.reps}
                      onChange={this.onNumberChange}
                      style={this.styles.numberFields}
                      floatingLabelText="Reps"
                      min={1}
                      max={100}  
                    />
                    <NumberInput
                      id="weight"
                      value={this.state.weight}
                      onChange={this.onNumberChange}
                      style={this.styles.numberFields}
                      floatingLabelText="Weight"
                      min={5}
                      max={900}  
                    />
                    <NumberInput
                      id="sets"
                      value={this.state.sets}
                      onChange={this.onNumberChange}
                      style={this.styles.numberFields}
                      floatingLabelText="Sets"
                      min={5}
                      max={90}  
                    />
                </div>
                {setList}
                <Divider style={this.styles.divide}  />
            </div>
        );
    }
}

export default WorkoutItem;
