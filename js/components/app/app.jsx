import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import styles from './styles.css';
import Menu from '../menu/menu';

injectTapEventPlugin();

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <Menu /> {this.props.children}
                </div>
            </MuiThemeProvider>

        );
    }
}

// App.propTypes = {   children: React.PropTypes.node.isRequired, };
