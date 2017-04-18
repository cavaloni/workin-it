import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Observable as O } from 'rxjs';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as actions from '../../actions/index';
import facebookImg from '../../../assets/facebook-icon-white.png';
import prog from '../../../assets/prog.png';
import track from '../../../assets/track.png';
import friends from '../../../assets/friends.png';
import Logo from '../logo/logo';

const style = {
    container: {
        margin: '-22px',
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
        fontFamily: 'Muli, sans-serif',
        color: '#757574',
        backgroundColor: '#B2DFDB',
        height: '50px',
        lineHeight: '50px',
    },
    button: {
        margin: '90px 0 60px',
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
        textAlign: 'center',
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
            <MuiThemeProvider>
                <div>
                    <div style={style.container}>
                        <h1 style={style.heading}>Workin It</h1>
                        <Logo size={1} />
                        <a href="/login/facebook" style={style.button}>
                            <img src={facebookImg} style={style.fbImage} alt="facebook" />
                            <div style={style.login}>Login With Facebook</div>
                        </a>
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
