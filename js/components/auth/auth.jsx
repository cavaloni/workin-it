import React, { Component } from 'react';
import { Observable } from 'rxjs/Observable';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../actions';


// this component is simply to have a router point on the client end
// verify the first JWT sent from the server, which is less secure since it is
// sent through the URL. It then requests a new token which is sent through a
// standard HTTP request.

class Auth extends Component {

    componentWillMount() {
        Observable.ajax(`/new_token?initToken=${this.props.params.initToken}`)
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
