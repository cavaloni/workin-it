import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Observable } from 'rxjs';
import * as actions from '../../actions/index';


const O = Observable;

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.justGetIn = this.justGetIn.bind(this);
        this.state = {
            token: false,
            loginFail: false,
        };
    }

    componentWillMount() {
        if (this.props.loginFail) {
            this.setState({ loginFail: true });
        }
        const getToken = O.of(localStorage.getItem('wi_id_token'));
        const verifyAuth = tk => O.ajax({
            headers: {
                token: tk,
            },
            url: 'verify_auth',
        });
        let token;
        getToken
            .map((tkn) => {
                token = tkn;
                return verifyAuth(tkn);
            })
            .concatAll()
            .subscribe((response) => {
                if (response.status === 201) {
                    this.props.dispatch(actions.setUserToken(token));
                    browserHistory.push('/app');
                }
            },
        (() => {
            this.setState({ token: false });
        }));
    }

    justGetIn() {
        browserHistory.push('/app');
    }

    login() {
        this.props.dispatch(actions.login('Michal'));
    }

    render() {
        // TODO: a login fail message
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

Login.propTypes = {
     // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    loginSuccess: state.loginSuccess,
});

export default connect(mapStateToProps)(Login);
