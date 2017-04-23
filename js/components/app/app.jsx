import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MainMenu from '../menu/menu';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#983D3D',
        primary2Color: '#983D3D',
        primary3Color: '#983D3D',
        accent1Color: '#457898',
        accent2Color: '#457898',
        accent3Color: '#457898',
    },
});

class App extends Component {

    componentWillMount() {
        google.charts.load('current', { packages: ['corechart'] }); // eslint-disable-line
    }


    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <MainMenu /> {this.props.children}
                </div>
            </MuiThemeProvider>

        );
    }
}

App.propTypes = {
   // children for react-router
    children: React.PropTypes.element.isRequired,
};

export default connect()(App);
