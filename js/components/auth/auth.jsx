import React, { Component } from 'react';
import Rx from 'rxjs';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class Auth extends Component {

    componentWillMount() {
        Rx.Observable.ajax(`/new_token?initToken=${this.props.params.initToken}`)
        .subscribe((response) => {
            localStorage.setItem('wi_id_token', response.response.newToken);
            this.props.dispatch(actions.setUserToken(response.response.newToken));
            browserHistory.push('/app');
        },
        () => this.props.dispatch(actions.loginFail()));
    }

    render() {
        return (
            <div />
        );
    }
}

Auth.propTypes = {
    // initial user token in routing parameter
    params: React.PropTypes.shape({
        initToken: React.PropTypes.string,
    }).isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

export default connect()(Auth);
