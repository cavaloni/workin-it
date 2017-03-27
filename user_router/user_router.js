import { User } from './user_model';
import mockData from '../js/components/mock-data';
import { Observable } from 'rxjs';

const passport = require('passport');
const O = Observable;
const jsonParser = require('body-parser').json();
const express = require('express');
const eJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.get('/init_profile',
    passport.authenticate('facebook', {
        failureRedirect: '/user/failed_auth',
    }),
    (req, res) => {
        User
            .findOne({
                fbId: req.user.id,
            })
            .exec()
            .then((user) => {
                console.log('this is first', user);
                if (!user) {
                    User
                        .create({
                            user: `${req.user.name.givenName} ${req.user.name.familyName}`,
                            friends: [],
                            profileImage: req.user.photos[0].value,
                            fbId: req.user.id,
                        })
                    .then()
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ err })
                    });
                }
            })
            .catch(err => {
                console.log('1111111111111111111111111111111111111')
                console.log(err)
            });
        res.redirect('/init_token');
    });

router.get('/failed_auth', (req, res) => {
    res.json({ failed: 'failed' });
});

router.get('/profile', (req, res) => {
    const userId = jwt.verify(req.headers.token, 'super stank').user;
    console.log(userId);
    User
        .find(userId)
        .exec()
        .then((profile) => {
            console.log('this is what come back', profile);
            res.status(201).json(profile[0].apiRepr());
        })
        .catch(err => {
            console.log(err);
            res.send(501, { err })
        });
});

module.exports = { router };
