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
        backgroundColor: '#607D8B',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    progress: {
        height: '49%',
        width: '53%',
        maxWidth: '300px',
        maxHeight: '300px',
        margin: '30',
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: '#F4511E',
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
};

class Home extends Component {

    componentWillMount() {
        if (this.props.params.jwToken) {
            this.props.dispatch(actions.setUserToken());
        }
        this.props.dispatch(actions.setUserProfile());
    }

    workoutRoute(e) {
        e.preventDefault();
        browserHistory.push('/app/1');
    }

    progressRoute(e) {
        e.preventDefault();
        browserHistory.push('/app/2');
    }

    render() {
        return (
            <div style={{ textAlign: 'center', width: '95%', margin: '0 auto' }}>
                <Paper style={{ marginBottom: 10, marginTop: 10 }}>
                    <List>
                        <ListItem
                          disabled
                          leftAvatar={
                              <Avatar src={this.props.profileData.profileImage} />
                        }
                        >
                    Hello {this.props.profileData.user}!
                    </ListItem>
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
            </div>
        );
    }
}

Home.propTypes = {
    profileData: React.PropTypes.shape({
        fbId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired,
        profileImage: React.PropTypes.string,
        friends: React.PropTypes.array,
    }).isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
    // parameter for initial jwToken
    params: React.PropTypes.shape({
        jwToken: React.PropTypes.string,
    }).isRequired,
};

const mapStateToProps = (state, props) => ({ profileData: state.userData }); // eslint-disable-line

const enhance = compose(
  connect(mapStateToProps),
  Radium(),
);

export default enhance(Home);
