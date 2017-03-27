import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import { browserHistory } from 'react-router';
import { Observable } from 'rxjs';

const O = Observable;

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.justGetIn = this.justGetIn.bind(this);
    }

    componentWillMount() {
        const getToken = O.of(localStorage.getItem('wi_id_token'));
        const verifyAuth = tk => O.ajax({
            headers: {
                token: tk,
            },
            url: 'verify_auth',
        });

        getToken
            .map((tkn) => {
                return verifyAuth(tkn);
            })
            .concatAll()
            .subscribe((response) => {
                if (response.status === 201) {
                    browserHistory.push('/app');
                }
            },
        ((err) => {
            console.log(err);
        }));
    }

    justGetIn() {
        browserHistory.push('/app');
    }

    login() {
        console.log(actions);
        this.props.dispatch(actions.login('Michal'));
    }

    render() {
        return (
            <div>
                <h1>Yep</h1>
                <button onClick={this.login}>Login</button>
                <a href="/login/facebook">Login a</a>
                <button onClick={this.justGetIn} />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    loginSuccess: state.loginSuccess,
});

export default connect(mapStateToProps)(Login);
