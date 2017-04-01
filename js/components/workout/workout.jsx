import React, { Component } from 'react';
import { Observable } from 'rxjs';
import { connect } from 'react-redux';
import DropDownMenu from 'material-ui/DropDownMenu';
import WorkoutCard from '../workout-card/workout-card';

const O = Observable;

class Workout extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            weeks: 0,
        };
    }

    componentWillMount() {
        O.ajax({
            url: '/exercise_data/get_weeks',
            body: { user: this.props.profileData.fbId },
            headers: { token: this.props.token },
            method: 'PUT',
        })
        .subscribe(weeks => this.setState(weeks));
    }

    render() {

        this.state.weekRange

        return (
            <div>
                <DropDownMenu maxHeight={300} value={this.state.value} onChange={this.handleChange}>
                    {this.state.weekRange}
                </DropDownMenu>
                <WorkoutCard cardType="Back" />
                <WorkoutCard cardType="Arms" />
                <WorkoutCard cardType="Shoulders" />
                <WorkoutCard cardType="Legs" />
                <WorkoutCard cardType="Chest" />
                <WorkoutCard cardType="Abs" />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({ 
    profileData: state.userData, 
    exerciseData: state.exerciseData, 
    token: state.userToken,
});


export default connect(mapStateToProps)(Workout);
