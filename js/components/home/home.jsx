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


const style = {
    workouts: {
        height: '49%',
        width: '43%',
        maxWidth: '300px',
        maxHeight: '300px',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: '#00BCD4',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    progress: {
        height: '49%',
        width: '43%',
        maxWidth: '300px',
        maxHeight: '300px',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: '#F44336',
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
    constructor(props, context) {
        super(props, context);
        this.workoutRoute = this.workoutRoute.bind(this);
        this.progressRoute = this.progressRoute.bind(this);
    }


    componentWillMount() {
        if (this.props.params.jwToken) {
            this.props.dispatch(actions.setUserToken());
        }
        console.log('this happened at home');
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
            <div>
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
                      src="../../../assets/barbell.png"
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
                      src="../../../assets/barbell.png"
                    />
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({ profileData: state.userData });

const enhance = compose(
  connect(mapStateToProps),
  Radium(),
);

export default enhance(Home);
