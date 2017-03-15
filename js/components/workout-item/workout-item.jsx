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
            Reps: 0,
            Weight: 0,
            Sets: 0,
            showSets: false,
        };

        this.onNumberChange = this.onNumberChange.bind(this);
        this.setsButton = this.setsButton.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sets === true) {
            this.setState({ showSets: false });
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
        if (this.state.sets !== 0) {
            this.setState({
                showSets: !this.state.showSets,
            });
        }
    }

    render() {
        if (this.props.sets) {
            _.set(this.styles, 'name.color', 'black');
        } else { _.unset(this.styles, 'name.color'); }
        let noStyle;
        const setList = [];
        if (this.state.showSets) {
            for (let i = 0; i < Number(this.state.Sets); i++) {
                setList.push(<SetListItem set={i}  />);
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
                      id="Reps"
                      value={this.state.Reps}
                      onChange={this.onNumberChange}
                      style={this.styles.numberFields}
                      floatingLabelText="Reps"
                      min={1}
                      max={100}  
                    />
                    <NumberInput
                      id="Weight"
                      value={this.state.Weight}
                      onChange={this.onNumberChange}
                      style={this.styles.numberFields}
                      floatingLabelText="Weight"
                      min={5}
                      max={900}  
                    />
                    <NumberInput
                      id="Sets"
                      value={this.state.Sets}
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
