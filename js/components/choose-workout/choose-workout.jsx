import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Menu as Menus } from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import { orange500, blue500 } from 'material-ui/styles/colors';

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
        this.handleAutoComSelect = this.handleAutoComSelect.bind(this);
        this.addButton = this.addButton.bind(this);
        this.state = {
            selected: undefined,
            open: this.props.opener,
            worksList: this.props.exercisesList[this.type].map(() => false),
            customWorkout: '',
            autoComSelected: '',
            autoComErrTxt: '',
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
        this.props.closer();
    }

    addButton() {
        if (this.customWorkout !== '') {
            this.props.clicker(this.customWorkout);
            this.customWorkout = '';
            this.setState({ open: false });
            return;
        }
        if (this.state.selected === undefined) { return; }
        this.props.clicker(this.state.selected);
        const newArry = this.props.exercisesList[this.type].map(() => false); // reset checked state
        this.setState({ worksList: newArry, open: false });
        this.props.closer();
    }

    handleSelect(event, menuObj, index) {
        if (event !== null) {
            event.preventDefault();
        }
        const newArry = this.props.exercisesList[this.type].map(() => false);
        newArry[index] = true;
        this.setState({ selected: index, worksList: newArry });
    }

    handleAutoComSelect(selected, selectedIndex) {
        this.handleSelect(null, null, selectedIndex);
    }

    render() {
        const actions = [<FlatButton
          label="Cancel" primary onTouchTap={this.handleClose}
        />, <FlatButton
          label="Add" primary keyboardFocused onTouchTap={this.addButton}
        />,
        ];

        const menuItems = this.props.exercisesList[this.type].map((exercise) => {
            const i = this.props.exercisesList[this.type].indexOf(exercise);
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
                <AutoComplete
                  errorText={this.state.autoComErrTxt}
                  floatingLabelText="Search Workouts"
                  filter={AutoComplete.fuzzyFilter}
                  dataSource={this.props.exercisesList[this.type]}
                  maxSearchResults={5}
                  onNewRequest={this.handleAutoComSelect}
                />
                <TextField
                  key={2}
                  onChange={this.customWorkoutHandler}
                  id="text-field-default"
                  floatingLabelText="Custom Workout"
                  floatingLabelStyle={styles.floatingLabelStyle}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                />
                <Menus onItemTouchTap={this.handleSelect}>
                    {menuItems}
                </Menus>
            </Dialog>

        );
    }
}

ChooseWorkout.propTypes = {
    // list of exercises obtained from server and passed to profileData in parent
    exercisesList: React.PropTypes.arrayOf([]).isRequired,
    // opens this selector component
    opener: React.PropTypes.bool.isRequired,
    // callback that closes this selector component in the parent
    closer: React.PropTypes.func.isRequired,
    // callback to send clicked workout back to parent component
    clicker: React.PropTypes.func.isRequired,
    // the type of the exercise (arms, back, etc)
    type: React.PropTypes.string.isRequired,
};
