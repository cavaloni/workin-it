import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import NumberInput from 'material-ui-number-input';
import FlatButton from 'material-ui/FlatButton';

const styles = {
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
        overflow: 'hidden',
        marginRight: 10,
        marginTop: 0,
        verticalAlign: 'bottom',
    },
    input: {
        marginTop: 0,
    },
    checkbox: {
        marginBottom: 16,
        width: '100%',
    },
    divide: {
        marginBottom: 5,
    }
};

class SetListItem extends Component  {
    constructor(props, context) {
        super(props, context);
            console.log(props);
            this.state = {
                Reps: 0,
                Weight: 0,
            }
            this.onNumberChange = this.onNumberChange.bind(this);
    }

    onNumberChange(e) {
        this.setState({[e.target.floatingLabelText]: e.target.value});
    }

    render () {
        const setNum = `Set ${this.props.set + 1}`;
        return ( 
        <div style={styles.container}>
            <div>
                <span style={styles.name}>{setNum}</span>
                <NumberInput
                  value={this.state.Reps}
                  onChange={this.onNumberChange}
                  style={styles.numberFields}
                  inputStyle={styles.input}
                  floatingLabelText="Reps"
                  min={1}
                  max={100}
                />
                <NumberInput
                  value={this.state.Weight}
                  onChange={this.onNumberChange}
                  style={styles.numberFields}
                  inputStyle={styles.input}
                  floatingLabelText="Weight"
                  min={5}
                  max={900}
                />
            </div>
        </div>
    );
    }
};

export default SetListItem;