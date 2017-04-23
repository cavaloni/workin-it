import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/observable/dom/ajax';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as actions from '../../actions/index';
import facebookImg from '../../../assets/facebook-icon-white.png';
import prog from '../../../assets/prog.png';
import track from '../../../assets/track.png';
import friends from '../../../assets/friends.png';
import Logo from '../logo/logo';

import weightsImg from '../../../assets/weights.png';

const O = Observable;

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#983D3D',
        primary2Color: '#983D3D',
        primary3Color: '#983D3D',
        accent1Color: '#457898',
        accent2Color: '#457898',
        accent3Color: '#457898',
    },
});

const style = {
    container: {
        margin: '-22px',
        textAlign: 'center',
        backgroundColor: 'rgb(69, 113, 131)',
        backgroundImage: `url(${weightsImg})`,
        backgroundBlendMode: 'soft-light',
        marginBottom: 0,
        backgroundSize: 'cover',
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
    demoLogin: {
        paddingBottom: 20,
        marginBottom: 0,
    },
    demoLoginButton: {
        color: 'antiquewhite',
        fontFamily: 'Roboto, serif',
        boxShadow: '1px 2px 5px black',
        textDecoration: 'none',
        padding: '5px',
        borderRadius: '5px',
        backgroundColor: '#E57373',
    },
    heading: {
        fontFamily: 'Muli, sans-serif',
        color: '#757574',
        backgroundColor: '#E9E88D',
        height: '50px',
        lineHeight: '50px',
    },
    button: {
        margin: '90px 0 20px',
        display: 'inline-block',
    },
    icons: {
        verticalAlign: 'top',
        fontSize: '13px',
        display: 'inline-block',
        marginLeft: 20,
        width: '25%',
        textAlign: 'center',
        padding: 10,
        mingHieght: '100px',
    },
    images: {
        display: 'block',
        margin: '0 auto',
        width: '50%',
        height: '50%',
        maxHeight: 100,
        maxWidth: 100,
        verticalAlign: 'top',
    },
    imageContainer: {
        background: 'white',
        textAlign: 'center',
        padding: '20px',
    },
};

class Login extends Component {
    constructor(props) {
        super(props);
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

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <div style={style.container}>
                        <h1 style={style.heading}>Workin It</h1>
                        <Logo size={1} />
                        <a href="/login/facebook" style={style.button}>
                            <img src={facebookImg} style={style.fbImage} alt="facebook" />
                            <div style={style.login}>Login With Facebook</div>
                        </a>
                        <p>or</p>
                        <p style={style.demoLogin}>
                            <a href="/demo" style={style.demoLoginButton}>Demo User</a>
                        </p>
                    </div>
                    <div style={style.imageContainer}>
                        <Paper style={style.icons}>
                            <img src={track} style={style.images} alt="workouts" />
                        Record Your Workouts
                    </Paper>
                        <Paper style={style.icons}>
                            <img src={prog} style={style.images} alt="progress" />
                        Track Your Progress
                    </Paper>
                        <Paper style={style.icons}>
                            <img src={friends} style={style.images} alt="friends" />
                        Share + Track Friends
                    </Paper>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

Login.propTypes = {
    // boolean if login failed
    loginFail: React.PropTypes.bool.isRequired,
     // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    loginSuccess: state.loginSuccess,
});

export default connect(mapStateToProps)(Login);
