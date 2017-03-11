import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Menu as Menus } from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const styles = {
    radioButton: {
        marginTop: 16,
    },
};

const fakeworks = ['Pull-Ups', 'Deadlift', 'Fatties', 'Heavy Shit', 'Overhead Tricep Press', 'hats', 'cats'];

export default class ChooseWorkout extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            selected: undefined,
            open: this.props.opener,
            worksList: fakeworks.map(() => {
                return false;
            })
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.opener) {
            this.handleOpen();
        }
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false });
        this.props.clicker(this.state.selected);
    }

    handleSelect(event, menuObj, index) {
        console.log(event, menuObj);
        const newArry = fakeworks.map(() => { return false; });
        newArry[index] = true;
        this.setState({ selected: index, worksList: newArry });
    }

    render() {
        console.log(this.state);
        const actions = [<FlatButton
          label="Cancel" primary onTouchTap={this.handleClose}
        />, <FlatButton
          label="Submit" primary keyboardFocused onTouchTap={this.handleClose}
        />,
        ];

        const menuItems = fakeworks.map((work) => {
            const i = fakeworks.indexOf(work);
            return (
                <MenuItem
                  checked={this.state.worksList[i]}
                  key={i}
                  value={`value${i + 1}`}
                  label={`${work} ${i + 1}`}
                  style={styles.radioButton}
                >{work}
                </MenuItem>
            );
        });

        console.log(menuItems);

        return (
            
                <Dialog
                  title="Select Workout"
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                >
                    <Menus onItemTouchTap={this.handleSelect}>
                        {menuItems}
                    </Menus>
                    <TextField id="text-field-default" defaultValue="Custom Workout" />
                </Dialog>
            
        );
    }
}
