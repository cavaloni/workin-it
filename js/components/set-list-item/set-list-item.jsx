import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Observable } from 'rxjs/Observable';

const O = Observable;

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

class SetListItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reps: 0,
            weight: 0,
            errTxtReps: '',
            errTxtWeight: '',
        };
        this.onNumberChange = this.onNumberChange.bind(this);
    }

    componentWillMount() {
        if (this.props.populateValue) {
            const { reps, weight } = this.props.populateValue;
            this.setState({ reps, weight });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.populateValue !== this.props.populateValue) {
            const { reps, weight } = nextProps.populateValue;
            this.setState({ reps, weight });
        }
    }

    componentDidUpdate() {
        if ((this.state.errTxtReps !== '') || (this.state.errTxtWeight !== '')) {
            O.interval(2000)
                .take(1)
                .subscribe(() => this.setState({ errTxtReps: '', errTxtWeight: '' }));
        }
    }


    onNumberChange(e, value) {
        const type = e.target.id === 'reps' ? 'errTxtReps' : 'errTxtWeight';
        if (isNaN(Number(e.target.value))) {
            this.setState({
                [type]: 'Invalid Input',
            });
        } else {
            this.setState({ [e.target.id]: value, [type]: '' });
            this.props.getData({
                [e.target.id]: value,
                setNum: this.props.set - 1,
            });
        }
    }

    render() {
        const setNum = `Set ${this.props.set + 1}`;
        return (
            <div style={styles.container}>
                <div>
                    <span style={styles.name}>{setNum}</span>
                    <TextField
                      id="reps"
                      strategy="ignore"
                      value={this.state.reps}
                      onChange={this.onNumberChange}
                      style={styles.numberFields}
                      inputStyle={styles.input}
                      errorText={this.state.errTxtReps}
                      floatingLabelText="Reps"
                    />
                    <TextField
                      id="weight"
                      strategy="ignore"
                      value={this.state.weight}
                      onChange={this.onNumberChange}
                      style={styles.numberFields}
                      inputStyle={styles.input}
                      errorText={this.state.errTxtWeight}
                      floatingLabelText="Weight"
                    />
                </div>
            </div>
        );
    }
}

SetListItem.propTypes = {
    // the values to populate if week is being populated
    populateValue: React.PropTypes.shape({
        reps: React.PropTypes.oneOfType(
            React.PropTypes.string,
            React.PropTypes.number),
        weight: React.PropTypes.oneOfType(
            React.PropTypes.string,
            React.PropTypes.number),
    }),
    // the number of the set
    set: React.PropTypes.number.isRequired,
    // callback to send data to parent element
    getData: React.PropTypes.func.isRequired,
};

SetListItem.defaultProps = {
    populateValue: {
        reps: 0,
        weight: 0,
    },
};

export default SetListItem;
