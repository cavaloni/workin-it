import React, { Component } from 'react';
import NumberInput from 'material-ui-number-input';

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
};

class SetListItem extends Component  {
    constructor(props, context) {
        super(props, context);
            this.state = {
                reps: 0,
                weight: 0,
            }
            this.onNumberChange = this.onNumberChange.bind(this);
    }

    onNumberChange(e, value) {
        this.setState({[e.target.id]: value });
        this.props.getData({ 
            [e.target.id]: value,
            setNum: this.props.set,
        })
    }

    render () {
        const setNum = `Set ${this.props.set + 1}`;
        return ( 
        <div style={styles.container}>
            <div>
                <span style={styles.name}>{setNum}</span>
                <NumberInput
                  id="reps"
                  value={this.state.reps}
                  onChange={this.onNumberChange}
                  style={styles.numberFields}
                  inputStyle={styles.input}
                  floatingLabelText="Reps"
                  min={1}
                  max={100}
                />
                <NumberInput
                  id="weight"
                  value={this.state.weight}
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