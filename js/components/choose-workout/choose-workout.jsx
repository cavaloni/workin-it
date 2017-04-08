import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Menu as Menus } from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { orange500, blue500 } from 'material-ui/styles/colors';

import exercisesList from '../exercise-list';

const styles = {
    radioButton: {
        marginTop: 16,
    },
    floatingLabelStyle: {
        color: orange500,
    },
    floatingLabelFocusStyle: {
        color: blue500,
    },
};


export default class ChooseWorkout extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.type = props.type.toLowerCase();
        this.handleSelect = this.handleSelect.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.customWorkoutHandler = this.customWorkoutHandler.bind(this);
        this.state = {
            selected: undefined,
            open: this.props.opener,
            worksList: exercisesList[this.type].map(() => false),
            customWorkout: '',
        };
        this.customWorkout = '';
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.opener) {
            this.handleOpen();
        }
    }

    customWorkoutHandler(e) {
        e.preventDefault();
        this.customWorkout = e.target.value;
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false });
        if (this.customWorkout !== '') {
            this.props.clicker(this.customWorkout);
            this.customWorkout = '';
            return;
        }
        if (this.state.selected === undefined) { return; }
        this.props.clicker(this.state.selected);
        const newArry = exercisesList[this.type].map(() => false); // reset checked state
        this.setState({ worksList: newArry });
    }

    handleSelect(event, menuObj, index) {
        event.preventDefault();
        const newArry = exercisesList[this.type].map(() => false);
        newArry[index] = true;
        this.setState({ selected: index, worksList: newArry });
    }

    render() {
        const actions = [<FlatButton
          label="Cancel" primary onTouchTap={this.handleClose}
        />, <FlatButton
          label="Add" primary keyboardFocused onTouchTap={this.handleClose}
        />,
        ];

        const menuItems = exercisesList[this.type].map((exercise) => {
            const i = exercisesList[this.type].indexOf(exercise);
            return (
                <MenuItem
                  checked={this.state.worksList[i]}
                  key={i}
                  value={`value${i + 1}`}
                  label={`${exercise} ${i + 1}`}
                  style={styles.radioButton}
                >{exercise}
                </MenuItem>
            );
        });

        return (

            <Dialog
              key={1}
              autoScrollBodyContent
              title="Select Workout"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
                <Menus onItemTouchTap={this.handleSelect}>
                    {menuItems}
                </Menus>
                <TextField
                  key={2}
                  onChange={this.customWorkoutHandler}
                  id="text-field-default"
                  floatingLabelText="Custom Workout"
                  floatingLabelStyle={styles.floatingLabelStyle}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                />
            </Dialog>

        );
    }
}

ChooseWorkout.propTypes = {
    // opens this selector component
    opener: React.PropTypes.bool.isRequired,
    // callback to send clicked workout back to parent component
    clicker: React.PropTypes.func.isRequired,
    // the type of the exercise (arms, back, etc)
    type: React.PropTypes.string.isRequired,
};
