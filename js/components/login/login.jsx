import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Observable } from 'rxjs';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as actions from '../../actions/index';
import facebookImg from '../../../assets/facebook-icon-white.png';
import prog from '../../../assets/prog.png';
import track from '../../../assets/track.png';
import friends from '../../../assets/friends.png';

const O = Observable;

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
    button: { // words
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
        width: '50%',
        height: '50%',
        maxHeight: 100,
        maxWidth: 100,
        verticalAlign: 'top',
    },
    imageContainer: {
        textAlign: 'center',
    },
    logoLetter: {
        backgroundColor: '#E57373',
        overflow: 'hidden',
        fontFamily: 'Poiret One, cursive',
        lineHeight: '150px',
        width: 150,
        height: 150,
        fontSize: 100,
        margin: '0 auto',
        color: 'white',
        textShadow: `rgb(160, 81, 81) 0px 0px 0px, 
        rgb(162, 81, 81) 1px 1px 0px, 
        rgb(163, 82, 82) 2px 2px 0px, 
        rgb(164, 82, 82) 3px 3px 0px, 
        rgb(165, 83, 83) 4px 4px 0px, 
        rgb(167, 84, 84) 5px 5px 0px, 
        rgb(168, 84, 84) 6px 6px 0px, 
        rgb(169, 85, 85) 7px 7px 0px, 
        rgb(170, 86, 86) 8px 8px 0px, 
        rgb(172, 86, 86) 9px 9px 0px, 
        rgb(173, 87, 87) 10px 10px 0px, 
        rgb(174, 88, 88) 11px 11px 0px, 
        rgb(176, 88, 88) 12px 12px 0px, 
        rgb(177, 89, 89) 13px 13px 0px, 
        rgb(178, 89, 89) 14px 14px 0px, 
        rgb(179, 90, 90) 15px 15px 0px, 
        rgb(181, 91, 91) 16px 16px 0px, 
        rgb(182, 91, 91) 17px 17px 0px, 
        rgb(183, 92, 92) 18px 18px 0px, 
        rgb(184, 93, 93) 19px 19px 0px, 
        rgb(186, 93, 93) 20px 20px 0px, 
        rgb(187, 94, 94) 21px 21px 0px, 
        rgb(188, 95, 95) 22px 22px 0px, 
        rgb(190, 95, 95) 23px 23px 0px, 
        rgb(191, 96, 96) 24px 24px 0px, 
        rgb(192, 96, 96) 25px 25px 0px, 
        rgb(193, 97, 97) 26px 26px 0px, 
        rgb(195, 98, 98) 27px 27px 0px,
        rgb(196, 98, 98) 28px 28px 0px, 
        rgb(197, 99, 99) 29px 29px 0px, 
        rgb(198, 100, 100) 30px 30px 0px, 
        rgb(200, 100, 100) 31px 31px 0px, 
        rgb(201, 101, 101) 32px 32px 0px, 
        rgb(202, 102, 102) 33px 33px 0px, 
        rgb(204, 102, 102) 34px 34px 0px, 
        rgb(205, 103, 103) 35px 35px 0px, 
        rgb(206, 104, 104) 36px 36px 0px, 
        rgb(207, 104, 104) 37px 37px 0px, 
        rgb(209, 105, 105) 38px 38px 0px, 
        rgb(210, 105, 105) 39px 39px 0px, 
        rgb(211, 106, 106) 40px 40px 0px, 
        rgb(212, 107, 107) 41px 41px 0px, 
        rgb(214, 107, 107) 42px 42px 0px, 
        rgb(215, 108, 108) 43px 43px 0px, 
        rgb(216, 109, 109) 44px 44px 0px, 
        rgb(218, 109, 109) 45px 45px 0px, 
        rgb(219, 110, 110) 46px 46px 0px, 
        rgb(220, 111, 111) 47px 47px 0px, 
        rgb(221, 111, 111) 48px 48px 0px, 
        rgb(223, 112, 112) 49px 49px 0px, 
        rgb(224, 112, 112) 50px 50px 0px, 
        rgb(225, 113, 113) 51px 51px 0px, 
        rgb(226, 114, 114) 52px 52px 0px, 
        rgb(228, 114, 114) 53px 53px 0px`,
    },

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
                <h1 style={style.heading}>Workin It</h1>
                <Paper style={style.logoLetter} circle zDepth={0}>WI</Paper>
                <a href="/login/facebook" style={style.button}>
                    <img src={facebookImg} style={style.fbImage} />
                    <div style={style.login}>Login With Facebook</div>
                </a>
                </div>
                <div style={style.imageContainer}>
                    <Paper style={style.icons}>
                        <img src={track} style={style.images} alt=""  />
                        Record Your Workouts
                    </Paper>
                    <Paper style={style.icons}>
                        <img src={prog} style={style.images} alt=""  />
                        Track Your Progress
                    </Paper>
                    <Paper style={style.icons}>
                        <img src={friends} style={style.images} alt=""  />
                        Share + Track Friends
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
