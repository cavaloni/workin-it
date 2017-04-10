import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Observable } from 'rxjs';
import * as actions from '../../actions/index';
import Paper from 'material-ui/paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import facebookImg from '../../../assets/facebook-icon-white.png';
import prog from '../../../assets/prog.png';
import track from '../../../assets/track.png';
import friends from '../../../assets/friends.png';

const O = Observable;

const style = {
    container: {
        textAlign: 'center',
        background: 'linear-gradient(135deg, #80CBC4, #4DB6AC)',
        marginBottom: 10,
    },
    fbImage: {
        width: 40,
        height: 40,
        boxShadow: '2px 2px 9px black',
    },
    login: {
        height: 40,
        display: 'inline-block',
        backgroundColor: 'rgb(71,90,150)',
        verticalAlign: 'top',
        marginLeft: '-1px',
        color: 'white',
        width: 220,
        lineHeight: '40px',
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        boxShadow: '2px 2px 9px black',

    },
    heading: {
        fontFamily: 'Roboto, sans-serif',
    },
    button: {
        margin: '200px 0 150px',
        display: 'inline-block',
    },
    icons: {
        fontSize: '13px',
        display: 'inline-block',
        marginLeft: 20,
        width: '25%',
        textAlign: 'center',
        padding: 10,
    },
    images: {
        width: '50%',
        height: '50%',
        maxHeight: 100,
        maxWidth: 100,
        verticalAlign: 'top',
    },
    imageContainer: {
        textAlign: 'center',
    }
};

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
            <MuiThemeProvider>
            <div>
            <div style={style.container}>
                <h1>Workin It</h1>
                <a href="/login/facebook" style={style.button}>
                    <img src={facebookImg} style={style.fbImage} />
                    <div style={style.login}>Login With Facebook</div>
                </a>
                </div>
                <div style={style.imageContainer}>
                    <Paper style={style.icons}>
                        <img src={prog} style={style.images} alt=""  />
                        Track Your Progress
                    </Paper>
                    <Paper style={style.icons}>
                        <img src={track} style={style.images} alt=""  />
                        Record Your Workouts
                    </Paper>
                    <Paper style={style.icons}>
                        <img src={friends} style={style.images} alt=""  />
                        Share and Track Friends
                    </Paper>
                </div>
            </div>
            </MuiThemeProvider>
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
