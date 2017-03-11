import React from 'react';
import Divider from 'material-ui/Divider';
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

const WorkoutItem = (props) => {
    console.log(props);
    return (
        <div style={styles.container}>
            <div>
                <span style={styles.name}>
                    {props.item}</span>
                <NumberInput
                  style={styles.numberFields}
                  inputStyle={styles.input}
                  floatingLabelText="Reps"
                  min={1}
                  max={100}
                />
                <NumberInput
                  style={styles.numberFields}
                  inputStyle={styles.input}
                  floatingLabelText="Weight"
                  min={5}
                  max={900}
                />
                <NumberInput
                  style={styles.numberFields}
                  inputStyle={styles.input}
                  floatingLabelText="Sets"
                  min={5}
                  max={900}
                />
            </div>
            <Divider style={styles.divide}/>
        </div>
    );
};

export default WorkoutItem;
