import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Menu as Menus } from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Home from 'material-ui/svg-icons/action/home';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import Face from 'material-ui/svg-icons/action/face';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Logo from '../logo/logo';
import * as actions from '../../actions/index';

const style = {
    appBar: {
        backgroundColor: '#80CBC4',
    },
};

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.menuOpen = this
            .menuOpen
            .bind(this);
        this.handleRoute = this
            .handleRoute
            .bind(this);
    }

    menuOpen() {
        console.log(this.state);
        this.setState({
            open: !this.state.open,
        });
    }

    menuClose() {
        this.setState({ open: false });
    }

    handleRoute(event, menuObj, i) {
        const index = i / 2;
        if (index === 4) {
            localStorage.removeItem('wi_id_token');
            browserHistory.push('/');
        } else {
            let route;
            if (index === 0) {
                route = '';
            } else (route = index);
            browserHistory.push(`/app/${route}`);
            this.setState({ open: false });
        }
    }

    render() {
        return (
            <div>
                <AppBar 
                  title="Workin It" 
                  onLeftIconButtonTouchTap={this.menuOpen} 
                  style={style.appBar} 
                  iconElementRight={<Logo size={.27} />}
                />
                <Drawer
                  open={this.state.open}
                  docked={false}
                  onRequestChange={open => this.setState({ open })}
                >
                    <Menus onItemTouchTap={this.handleRoute}>
                        <MenuItem leftIcon={<Home />}>Home</MenuItem>
                        <Divider />
                        <MenuItem leftIcon={<FitnessCenter />}>Workouts</MenuItem>
                        <Divider />
                        <MenuItem leftIcon={<ShowChart />}>Progress</MenuItem>
                        <Divider />
                        <MenuItem leftIcon={<Face />}>Friends</MenuItem>
                        <Divider />
                        <MenuItem leftIcon={<ExitToApp />}>Logout</MenuItem>
                    </Menus>
                </Drawer>
            </div>
        );
    }
}
// no
export default connect()(Menu);
