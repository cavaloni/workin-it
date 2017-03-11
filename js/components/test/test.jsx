import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};
export default class DialogExampleSimple extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        const actions = [<FlatButton
          label="Cancel" primary
          onTouchTap={
                this.handleClose
            }
        />, <FlatButton
          label="Submit" primary
          keyboardFocused
          onTouchTap={
                this.handleClose
            }
        />,
        ];

        return (
            
            <MuiThemeProvider>
            <div>
                <RaisedButton label="Dialog" onTouchTap={this.handleOpen} />
                <Dialog
                  title="Dialog With Actions"
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                >
                    The actions in this window were passed in as an array of React objects.
                </Dialog>
                </div>
                </MuiThemeProvider>

        );
    }
}
