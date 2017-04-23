import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/observable/fromPromise';
import passport from 'passport';
import express from 'express';
import expressJwt from 'express-jwt';
import jsonWebToken from 'jsonwebtoken';
import { User } from './user_model';
import ExerciseData from '../exercise_router/ex_model';
import exercisesList from '../exercises-list';
import { SECRET2 } from '../config';

const O = Observable;

const eJwt = expressJwt;
const jwt = jsonWebToken;

const router = express.Router();

router.use(
    eJwt({ secret: SECRET2,
        getToken: function fromQuery(req) { return req.headers.token; },
        requestProperty: 'auth',
    }).unless({ path: ['/user/init_profile'] }),
    );

router.get('/', (req, res) => {
    User
        .find()
        .exec()
        .then((users) => {
            const allUsers = users.map(user => ({ user: user.user, fbId: user.fbId }));
            res.status(201).json({ allUsers });
        })
        .catch(() => {
            res.status(500);
        });
});

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
                if (!user) {
                    User
                        .create({
                            user: `${req.user.name.givenName} ${req.user.name.familyName}`,
                            friends: [],
                            profileImage: req.user.photos[0].value,
                            fbId: req.user.id,
                        })
                        .then(() => {
                            ExerciseData
                                .create({
                                    userId: req.user.id,
                                    exerciseData: {},
                                })
                                .then()
                                .catch(() => {
                                    res.status(500);
                                });
                        })
                        .catch(() => {
                            res.status(500);
                        });
                }
            })
            .catch(() => {
                res.status(500);
            });

        res.redirect(`/init_token?token=${req.user.token}`);
    });



router.get('/failed_auth', (req, res) => {
    res.json({ failed: 'failed' });
});

router.get('/profile', (req, res) => {
    console.log(jwt.verify(req.headers.token, SECRET2))
    const userId = jwt.verify(req.headers.token, SECRET2).user;
    console.log(userId);
    User
        .findOne({
            fbId: userId,
        })
        .exec()
        .then((profile) => {
            const prof = profile.toObject();
            res.status(201).json({ ...prof, exercisesList });
        })
        .catch((err) => {
            res.send(500, { err });
        });
});

router.put('/add_friend', (req, res) => {
    const user = req.body.user;
    const friend = req.body.friend;

    let friendProfile;
    const friendProfileUpdate = O.fromPromise(
        User
            .findOneAndUpdate({ fbId: friend.fbId },
            { $push: {
                friends: {
                    name: user.name,
                    fbId: user.fbId,
                    status: 'pending',
                    sentByUser: false,
                    avatar: user.profileImage,
                },
            } })
            .exec()
            .then((profile) => {
                friendProfile = profile;
            }),
    );
    const userProfileUpdate = fProfile => O.fromPromise(
        User
            .findOneAndUpdate({ fbId: user.fbId },
            { $push: {
                friends: {
                    name: fProfile.user,
                    fbId: fProfile.fbId,
                    status: 'pending',
                    sentByUser: true,
                    avatar: fProfile.profileImage,
                },
            } },
            { new: true })
            .exec()
            .then(profile => profile),
        );

    friendProfileUpdate
        .map(() => userProfileUpdate(friendProfile))
            .concatAll()
            .subscribe((profile) => {
                res.status(201).json(profile);
            },
            (() => {
                res.status(500);
            }));
});

router.put('/accept_friend', (req, res) => {
    User
        .findOneAndUpdate({
            fbId: req.body.friendFbId,
            friends: {
                $elemMatch: {
                    fbId: req.body.userFbId,
                },
            },
        }, {
            $set: {
                'friends.$.status': 'active',
            },
        }, {
            new: true,
        })
        .exec()
        .then()
        .catch((err) => {
            res.status(500)
                .json({
                    err,
                });
        });


    User
        .findOneAndUpdate({
            fbId: req.body.userFbId,
            friends: {
                $elemMatch: {
                    fbId: req.body.friendFbId,
                },
            },
        }, {
            $set: {
                'friends.$.status': 'active',
            },
        }, {
            new: true,
        })
        .exec()
        .then((profile) => {
            res.status(200)
                .json(profile);
        })
        .catch(err => res.status(500)
            .json({
                err,
            }));
});

router.put('/delete_friend', (req, res) => {
    const userId = req.body.user;
    const friendId = req.body.friend.fbId;

    User
        .findOneAndUpdate(
        { fbId: userId },
        { $pull: { friends: { fbId: friendId } } },
        { new: true })
        .exec()
        .then((profile) => {
            res.status(200).json(profile);
        })
        .catch(err => res.status(500).json({ err }));

    User
        .findOneAndUpdate(
        { fbId: friendId },
        { $pull: { friends: { fbId: userId } } }, { new: true })
        .exec()
        .then()
        .catch(err => res.status(500).json({ err }));
});

module.exports = { router };
