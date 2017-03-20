import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Menu as Menus } from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import * as actions from '../../actions/index';

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

    handleRoute(event, menuObj, index) {
        let route;
        if (index === 0) {
            route = '';
        } else (route = index);
        browserHistory.push(`/app/${route}`);
        this.setState({ open: false });
    }

    render() {
        return (
            <div>
                <AppBar title="Workin It" onLeftIconButtonTouchTap={this.menuOpen} />
                <Drawer
                  open={this.state.open}
                  docked={false}
                  onRequestChange={open => this.setState({ open })}
                >
                    <Menus onItemTouchTap={this.handleRoute}>
                        <MenuItem>Home</MenuItem>
                        <MenuItem>Workouts</MenuItem>
                        <MenuItem>Progress</MenuItem>
                        <MenuItem>Friends</MenuItem>
                        <MenuItem>Help</MenuItem>
                    </Menus>
                </Drawer>
            </div>
        );
    }
}
// no
export default connect()(Menu);
