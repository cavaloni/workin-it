const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const express = require('express');
const Strategy = require('passport-facebook').Strategy;
const morgan = require('morgan')('combined');
const expressSession = require('express-session');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const eJwt = require('express-jwt');
const shortid = require('shortid');

const blacklist = { // this object is to keep the inital temporary tokens
    tokens: [0],    // blacklisted, since they are sent in the url
    getRevokedToken(tokenId, cb) { // the newToken below, is sent in a more secure way 
        this.tokens.forEach((curToken) => { // and so is not limited to the session
            if (curToken === tokenId) {
                return cb(null, true);
            }
            this.tokens.push(tokenId);
            return cb(null, false);
        });
    },
};

const isRevokedCallback = (req, payload, done) => {
    const tokenId = payload.jti;

    blacklist.getRevokedToken(tokenId, (err, isRevoked) => {
        if (err) { return done(err); }
        return done(null, isRevoked);
    });
};

process.env.PWD = process.cwd();

mongoose.Promise = global.Promise;

const app = express();

const { PORT, DATABASE_URL } = require('./config');

app.use(express.static(`${process.env.PWD}/build`));

passport.use(new Strategy({
    clientID: '266134167169182',
    clientSecret: '636f0c825d31af79085033dc03a58a43',
    callbackURL: 'http://localhost:8081/login/facebook/return',
},
  (accessToken, refreshToken, profile, cb) => {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
      profile.token = jwt.sign(profile, 'funky smell', {
          expiresIn: 10080,
          jwtid: shortid.generate(),
      });
      cb(null, profile);
  }));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('***********AUTHORIZED');
        return next();
    }
    console.log('~~~~not authenticated~~~~~');
};

// app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (request, response) => {
    response.sendFile(`${process.env.PWD}/build/index.html`);
});

app.get('/success', (req, res) => {
    res.status(200).json({ request: req, response: res, user: req.user });
});

app.get('/new_token',
    eJwt({ secret: 'funky smell',
        getToken: function fromQuery(req) { return req.query.initToken; },
        isRevoked: isRevokedCallback,
    }),
    (req, res) => {
        const newToken = jwt.sign(
            { foo: 'bar' },
            'super stank',
            { expiresIn: '7 days' });
        res.json({ newToken });
    });

app.get('/login/facebook',
   passport.authenticate('facebook'),
);

app.get('/init_token', (req, res) => {
    res.redirect(`/auth/${req.user.token}`);
});

app.get('/failed_auth', (req, res) => {
    res.json({ failed: 'failed' });
});

app.get('/verify_auth',
    eJwt({ secret: 'super stank',
        getToken: function fromQuery(req) { return req.headers.token; },
    }),
    (req, res) => {
        res.sendStatus(201);
});

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/failed_auth' }),
                                      (req, res) => {
                                          res.redirect('/init_token');
                                      });

app.get('*',
    // eJwt({ secret: 'super stank' }),
    (request, response) => {
        console.log('line 103');
        response.sendFile(`${process.env.PWD}/build/index.html`);
    });

// TODO: implment express-jwt to protect all endpoints

let server;

function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, (err) => {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                console.log(`Your app is listening on port ${PORT}`);
                resolve();
            })
            .on('error', (err) => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('closing server');
        server.close((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
