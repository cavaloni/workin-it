import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Menu from '../menu/menu';

injectTapEventPlugin();

class App extends Component {

    componentWillMount() {
        google.charts.load('current', { packages: ['corechart'] }); // eslint-disable-line
    }


    render() {
        return (
            <MuiThemeProvider >
                <div>
                    <Menu /> {this.props.children}
                </div>
            </MuiThemeProvider>

        );
    }
}

// App.propTypes = {   children: React.PropTypes.node.isRequired, };
App.propTypes = {
   // children for react-router
    children: React.PropTypes.element.isRequired,
};

export default connect()(App);
