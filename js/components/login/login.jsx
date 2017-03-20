import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import { browserHistory } from 'react-router'

class Login extends Component {
    constructor(props) {
        console.log(actions);
        super(props);
        this.login = this.login.bind(this);    
    }
    
    login() {
        browserHistory.push('/app');
        // console.log(actions);
        // this.props.dispatch(actions.login());
    }

    render() {
        return (
            <div>
                <h1>Yep</h1>
                <button onClick={this.login} >Login</button>
            </div>
        );
    }
}

export default connect()(Login);
