import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Menu from 'material-ui/Menu';
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
        backgroundColor: '#457898',
    },
};

class MainMenu extends Component {
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
        let routeName;
        switch (index) {
            case 1: {
                routeName = 'workout';
                break;
            }
            case 2: {
                routeName = 'progress';
                break;
            }
            case 3: {
                routeName = 'friends';
                break;
            }
            // no default
        }
        if (index === 4) {
            localStorage.removeItem('wi_id_token');
            browserHistory.push('/');
        } else {
            let route;
            if (index === 0) {
                route = '';
            } else (route = routeName);
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
                  onRightIconButtonTouchTap={() => this.handleRoute(null, null, 0)}
                  style={style.appBar}
                  iconElementRight={<Logo size={0.22} clickHandler={() => this.handleRoute(null, null, 0)} />}
                  iconStyleRight={{ margin: 'auto auto auto 20px' }}
                  titleStyle={{ flex: '' }}
                />
                <Drawer
                  open={this.state.open}
                  docked={false}
                  onRequestChange={open => this.setState({ open })}
                >
                    <Menu onItemTouchTap={this.handleRoute}>
                        <MenuItem leftIcon={<Home />}>Home</MenuItem>
                        <Divider />
                        <MenuItem leftIcon={<FitnessCenter />}>Workouts</MenuItem>
                        <Divider />
                        <MenuItem leftIcon={<ShowChart />}>Progress</MenuItem>
                        <Divider />
                        {friends}
                        <Divider />
                        <MenuItem leftIcon={<ExitToApp />}>Logout</MenuItem>
                    </Menu>
                </Drawer>
            </div>
        );
    }
}

MainMenu.propTypes = {
    // list of friends
    friends: React.PropTypes.arrayOf([]),
};

MainMenu.defaultProps = {
    friends: [],
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    friends: state.userData.friends,
});

export default connect(mapStateToProps)(MainMenu);
