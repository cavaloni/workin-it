import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import styles from './styles.css';
import Menu from '../menu/menu';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';

injectTapEventPlugin();

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log(actions);
        google.charts.load('current', { packages: ['corechart'] });
        // this.props.dispatch(actions.sendToken(localStorage.getItem('id_token')));
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


export default connect()(App);
