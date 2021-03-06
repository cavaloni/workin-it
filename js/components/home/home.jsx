import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import { browserHistory } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';

import barbellImg from '../../../assets/barbell.png';


const style = {
    workouts: {
        height: '49%',
        width: '53%',
        maxWidth: '300px',
        maxHeight: '300px',
        margin: '30',
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: 'rgb(229, 115, 115)',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    progress: {
        height: '49%',
        width: '49%',
        maxWidth: '300px',
        maxHeight: '300px',
        margin: '30',
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: '#607D8B',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    image: {
        height: '100%',
        width: '100%',
        margin: '0 auto',
    },
    span: {
        position: 'relative',
        fontSize: 24,
        left: 0,
        right: 0,
        top: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    welcome: {
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: 'white',
        width: '100vw',
        fontFamily: 'Poppins, sans-serif',
    },
    bottomBanner: {
        position: 'fixed',
        height: '5%',
        width: '100%',
        bottom: '0px',
        backgroundColor: '#4889B2',
    },
};

class Home extends Component {

    componentWillMount() {
        if (this.props.params.jwToken) {
            this.props.dispatch(actions.setUserToken());
        }
        this.props.dispatch(actions.setUserProfile());
    }

    workoutRoute(e) { // eslint-disable-line
        e.preventDefault();
        browserHistory.push('/app/workout');
    }

    progressRoute(e) { // eslint-disable-line
        e.preventDefault();
        browserHistory.push('/app/progress');
    }

    render() {
        let newFriends;
        const pendingFriendsNum = this.props.friends.filter(friend => (friend.status === 'pending') && (friend.sentByUser === false)).length;

        if (pendingFriendsNum >= 1) {
            newFriends = (
                <ListItem
                  disabled
                >
                You have {pendingFriendsNum} pending friend requests.
                </ListItem>
            );
        } else { newFriends = <ListItem disabled style={{ marginLeft: '50px' }}>No new notifications</ListItem>; }

        return (
            <div style={{ textAlign: 'center' }}>
                <Paper style={style.welcome}>
                    <List>
                        <ListItem
                          disabled
                          leftAvatar={
                              <Avatar size={70} src={this.props.profileData.profileImage} />
                        }
                        >
                    Hello {this.props.profileData.user}!
                        </ListItem>
                        
                        {newFriends}
                    </List>
                </Paper>
                <Paper
                  style={style.workouts}
                  key="1"
                  zDepth={3}
                  circle
                  onClick={this.workoutRoute}
                >
                    <span style={style.span}>Workouts</span>
                    <img
                      alt="barbell"
                      style={style.image}
                      key="1"
                      src={barbellImg}
                    />
                </Paper>
                <Paper
                  style={style.progress}
                  key="2" zDepth={3}
                  circle
                  onClick={this.progressRoute}
                >
                    <span style={style.span}>Progress</span>
                    <img
                      alt="barbell"
                      style={style.image}
                      key="1"
                      src={barbellImg}
                    />
                </Paper>
                <div style={style.bottomBanner} />
            </div>
        );
    }
}

Home.propTypes = {
    // list of friends
    friends: React.PropTypes.arrayOf([]),
    profileData: React.PropTypes.shape({
        fbId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired,
        profileImage: React.PropTypes.string,
        friends: React.PropTypes.array,
        exercisesList: React.PropTypes.array,
    }).isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
    // parameter for initial jwToken
    params: React.PropTypes.shape({
        jwToken: React.PropTypes.string,
    }).isRequired,
};

const mapStateToProps = (state, props) => ({ profileData: state.userData, friends: state.userData.friends }); // eslint-disable-line

Home.defaultProps = {
    friends: [],
};

const enhance = compose(
  connect(mapStateToProps),
  Radium(),
);

export default enhance(Home);
