const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const Strategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const eJwt = require('express-jwt');
const shortid = require('shortid');
const { router: exerciseDataRouter } = require('./exercise_router/ex_router');
const { router: userRouter } = require('./user_router/user_router');


const blacklist = { // this object is to keep the inital temporary tokens
    tokens: [0],    // blacklisted, since they are sent in the url.
    getRevokedToken(tokenId, cb) { // The newToken below, is sent in a more secure way
        this.tokens.forEach((curToken) => { // and so is not limited to the session.
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

const { PORT, DATABASE_URL, SECRET1, SECRET2 } = require('./config');

app.use(express.static(`${process.env.PWD}/build`));

app.get('/demo', (req, res) => {
    const profile = {
        user: '1001',
    };
    const token = jwt.sign(profile, SECRET1, { // eslint-disable-line
        expiresIn: 10,
        jwtid: shortid.generate(),
    });
    res.redirect(`/auth/${token}`);
});


passport.use(new Strategy({
    clientID: '266134167169182',
    clientSecret: '636f0c825d31af79085033dc03a58a43',
    callbackURL: '/user/init_profile',
    profileFields: ['picture.type(large)', 'first_name', 'last_name'],
},
  (accessToken, refreshToken, profile, cb) => {
      profile.token = jwt.sign(profile, SECRET1, { // eslint-disable-line
          expiresIn: 10,
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

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/exercise_data', exerciseDataRouter);
app.use('/user', userRouter);

app.get('/', (request, response) => {
    response.sendFile(`${process.env.PWD}/build/index.html`);
});

app.get('/success', (req, res) => {
    res.status(200).json({ request: req, response: res, user: req.user });
});

app.get('/new_token',
    eJwt({ secret: SECRET1,
        getToken: function fromQuery(req) { return req.query.initToken; },
        isRevoked: isRevokedCallback,
    }),
    (req, res) => {
        let user;
        if (jwt.verify(req.query.initToken, SECRET1).user) {
            user = jwt.verify(req.query.initToken, SECRET1).user;
        } else { user = req.user.id; }
        const newToken = jwt.sign(
            { user },
            SECRET2,
            { expiresIn: '7 days' });
        res.json({ newToken });
    });

app.get('/login/facebook',
   passport.authenticate('facebook', { scope: 'public_profile' }),
);

app.get('/init_token', (req, res) => {
    res.redirect(`/auth/${req.query.token}`);
});

app.get('/verify_auth',
    eJwt({ secret: SECRET2,
        getToken: function fromQuery(req) { return req.headers.token; },
        requestProperty: 'auth',
    }),
    (req, res) => {
        res.send(201);
    });

app.get('*',
    (request, response) => {
        response.sendFile(`${process.env.PWD}/build/index.html`);
    });

let server;

function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, (err) => { // eslint-disable-line
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                console.log(`Your app is listening on port ${PORT}`); // eslint-disable-line
                resolve();
            })
            .on('error', () => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('closing server'); // eslint-disable-line
        server.close((err) => { // eslint-disable-line
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

if (require.main === module) {
    runServer().catch(err => console.error(err)); // eslint-disable-line
}

module.exports = { app, runServer, closeServer };
