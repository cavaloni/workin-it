import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import { browserHistory } from 'react-router';

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

    workoutRoute(e) {
        console.log(e.currentTarget);
        browserHistory.push('/1')
    }

    progressRoute() {
        browserHistory.push('/2')
    }

    render() {
        return (
            <div>
                <Paper style={style.workouts} key="1" zDepth={3} circle={true} onClick={this.workoutRoute}>
                    <span style={style.span}>Workouts</span>
                    <img style={style.image} key="1" src="../../../assets/barbell.png" />
                </Paper>
                <Paper style={style.progress} key="2" zDepth={3} circle={true} onClick={this.progressRoute}>
                    <span style={style.span}>Progress</span>
                    <img style={style.image} key="1" src="../../../assets/barbell.png" />
                </Paper>
            </div>
        );
    }
}

export default Radium(Home);