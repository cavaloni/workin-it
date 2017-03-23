import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Rx from 'rxjs';
import { browserHistory } from 'react-router';

class Auth extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log(document.cookie);
        Rx.Observable.ajax(`/new_token?initToken=${this.props.params.initToken}`)
        .subscribe((response) => {
            localStorage.setItem('wi_id_token', response.response.newToken);
            browserHistory.push('/app');
        });
        // this.props.dispatch(actions.getNewToken());
    }

    render() {
        return (
            <div />
        );
    }
}

export default connect()(Auth);
