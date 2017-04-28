import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { browserHistory } from 'react-router';
import { Observable } from 'rxjs/Observable';
import injectSheet from 'react-jss';
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
        fontFamily: 'Poiret One',
        boxShadow: '1px 2px 5px black',
        textDecoration: 'none',
        padding: '5px',
        borderRadius: '5px',
        backgroundColor: '#E57373',
    },
    heading: {
        fontFamily: 'Poiret One',
        color: '#757574',
        backgroundColor: '#A7D1ED',
        height: '50px',
        lineHeight: '50px',
    },
    button: {
        margin: '90px 0 20px',
        display: 'inline-block',
    },
    icons: {
        fontFamily: 'Poiret One',
        verticalAlign: 'top',
        fontSize: '13px',
        display: 'inline-block',
        marginLeft: 20,
        width: '25%',
        textAlign: 'center',
        padding: 10,
        height: '130px',
        fontWeight: 'bolder',
    },
    '@media (min-width: 700px)': {
        icons: {
            fontSize: '18px',
        },
    },
    images: {
        display: 'block',
        margin: '0 auto',
        height: '50%',
        maxHeight: 100,
        maxWidth: 100,
        verticalAlign: 'top',
        marginBottom: '10px',
    },
    imageContainer: {
        textAlign: 'center',
        padding: '40px 20px 20px 20px',
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
        const { classes } = this.props;

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <div className={classes.container}>
                        <h1 className={classes.heading}>Workin It</h1>
                        <Logo size={1} />
                        <a href="/login/facebook" className={classes.button}>
                            <img src={facebookImg} className={classes.fbImage} alt="facebook" />
                            <div className={classes.login}>Login With Facebook</div>
                        </a>
                        <p style={{ fontFamily: 'Poiret One', fontWeight: 'bolder' }}>or</p>
                        <p className={classes.demoLogin}>
                            <a href="/demo" className={classes.demoLoginButton}>Demo User</a>
                        </p>
                    </div>
                    <div className={classes.imageContainer}>
                        <Paper className={classes.icons} style={{ fontFamily: 'Poiret One' }}>
                            <img src={track} className={classes.images} alt="workouts" />
                        Record Your Workouts
                        </Paper>
                        <Paper className={classes.icons} style={{ fontFamily: 'Poiret One' }}>
                            <img src={prog} className={classes.images} alt="progress" />
                        Track Your Progress
                        </Paper>
                        <Paper className={classes.icons} style={{ fontFamily: 'Poiret One' }}>
                            <img src={friends} className={classes.images} alt="friends" />
                        Share + Track Friends
                    </Paper>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

Login.propTypes = {
    // class object for JSS injection
    classes: React.PropTypes.objectOf({}).isRequired,
    // boolean if login failed
    loginFail: React.PropTypes.bool.isRequired,
     // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    loginSuccess: state.loginSuccess,
});

const enhance = compose(
  connect(mapStateToProps),
  injectSheet(style),
);

export default enhance(Login);
