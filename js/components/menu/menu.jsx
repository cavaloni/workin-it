import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Menu as Menus } from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Home from 'material-ui/svg-icons/action/home';
import Badge from 'material-ui/Badge';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import Face from 'material-ui/svg-icons/action/face';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Logo from '../logo/logo';

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
        const pendingFriendsNum = this.props.friends.filter(friend => (friend.status === 'pending') && (friend.sentByUser === false)).length;

        let friends;
        if (pendingFriendsNum >= 1) {
            friends = (<MenuItem
              leftIcon={<Badge
                badgeContent={pendingFriendsNum}
                primary
                style={{ margin: 0, padding: '7px 20px 12px 12px' }}
              ><Face />
              </Badge>}
            >Friends</MenuItem>);
        } else { friends = <MenuItem leftIcon={<Face />}>Friends</MenuItem>; }

        return (
            <div>
                <AppBar
                  title="Workin It"
                  onLeftIconButtonTouchTap={this.menuOpen}
                  style={style.appBar}
                  iconElementRight={<Logo size={0.27} />}
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
                        {friends}
                        <Divider />
                        <MenuItem leftIcon={<ExitToApp />}>Logout</MenuItem>
                    </Menus>
                </Drawer>
            </div>
        );
    }
}

Menu.propTypes = {
    // list of friends
    friends: React.PropTypes.arrayOf([]),
};

Menu.defaultProps = {
    friends: [],
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    friends: state.userData.friends,
});

export default connect(mapStateToProps)(Menu);
