/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(2);

var exerciseDataSchema = mongoose.Schema({
    userId: { type: String, required: true },
    exerciseData: { type: Object, required: true }
}, { minimize: false });

var ExerciseData = mongoose.model('exercise_datas', exerciseDataSchema);

module.exports = ExerciseData;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(2);

var UserSchema = mongoose.Schema({
    user: { type: String, required: true },
    friends: { type: Array },
    profileImage: { type: String },
    fbId: { type: String, rqeuired: true }
});

var User = mongoose.model('user_data', UserSchema);

module.exports = { User: User };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/workout';
exports.PORT = process.env.PORT || 8081;
exports.SECRET1 = 'kitty bear';
exports.SECRET2 = 'bear kit kat';

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = __webpack_require__(15);

var _moment2 = _interopRequireDefault(_moment);

var _lodash = __webpack_require__(14);

var _lodash2 = _interopRequireDefault(_lodash);

var _bodyParser = __webpack_require__(3);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _expressJwt = __webpack_require__(1);

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _ex_model = __webpack_require__(6);

var _ex_model2 = _interopRequireDefault(_ex_model);

var _user_model = __webpack_require__(7);

var _config = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var eJwt = _expressJwt2.default;
var router = _express2.default.Router();

router.use(_bodyParser2.default.json());
router.use(eJwt({ secret: _config.SECRET2,
    getToken: function fromQuery(req) {
        return req.headers.token;
    },
    requestProperty: 'auth'
}));

function getExerciseData(req, res) {
    var user = void 0;
    if (req.body.friendFbId) {
        user = req.body.friendFbId;
    } else {
        user = req.body.user;
    }
    var allUserData = void 0;
    _ex_model2.default.findOne({
        userId: user
    }).then(function (data) {
        allUserData = data;
        if (_lodash2.default.isEmpty(allUserData)) {
            res.status(201).json({
                data: 'no data'
            });
        } else {
            var yearQuery = void 0;
            var weekQuery = void 0;
            var _allUserData = allUserData,
                exerciseData = _allUserData.exerciseData;


            if (req.body.year === 'undefined') {
                yearQuery = (0, _moment2.default)().year().toString();
            } else {
                yearQuery = req.body.year;
            }

            if (req.body.week === 'undefined') {
                weekQuery = (0, _moment2.default)().week().toString();
            } else {
                weekQuery = req.body.week;
            }

            var userRangeData = void 0;

            if (_lodash2.default.isEmpty(exerciseData)) {
                userRangeData = 'no data';
            } else {
                userRangeData = Object.keys(exerciseData).filter(function (years) {
                    return years === yearQuery;
                }).map(function (year) {
                    return Object.keys(exerciseData[year]);
                })[0].filter(function (weeks) {
                    if (req.body.oneWeek === 'true') {
                        return weeks === weekQuery;
                    }
                    var weekRangeMax = weekQuery + 1;
                    var weekRangeMin = weekQuery - 4;
                    return _lodash2.default.inRange(weeks, weekRangeMin, weekRangeMax);
                }).reduce(function (weekSet, week) {
                    return _extends({}, weekSet, _defineProperty({}, week, exerciseData[2017][week]));
                }, {});
            }

            res.status(200).json({
                data: userRangeData
            });
        }
    }).catch(function () {
        res.status(500);
    });
}

router.put('/', function (req, res) {
    var requiredFields = ['user', 'dataToSave'];
    requiredFields.forEach(function (field) {
        if (!(field in req.body)) {
            res.status(400).json({
                error: 'Missing "' + field + '" in request body'
            });
        }
    });

    _ex_model2.default.findOne({
        userId: req.body.user
    }).exec().then(function (prevData) {
        var newData = _lodash2.default.cloneDeep(prevData);
        var year = req.body.year;
        var week = req.body.week;

        // This sequence sets the data on the object copy from the mongoose object

        var exercisesInDataToSave = [];
        req.body.dataToSave.forEach(function (data) {
            var i = req.body.dataToSave.indexOf(data);
            var exSets = req.body.dataToSave[i].exerciseData;
            var numSets = req.body.dataToSave[i].sets;
            var exName = req.body.dataToSave[i].exercise;
            var camelName = _lodash2.default.camelCase(req.body.dataToSave[i].exercise);
            var exGroup = req.body.dataToSave[i].exerciseGroup;
            exercisesInDataToSave.push(camelName);

            newData = _lodash2.default.setWith(newData, 'exerciseData.' + year + '.' + week + '.' + exGroup + '.' + camelName + '.data', exSets, Object);
            newData = _lodash2.default.setWith(newData, 'exerciseData.' + year + '.' + week + '.' + exGroup + '.' + camelName + '.sets', numSets, Object);
            newData = _lodash2.default.setWith(newData, 'exerciseData.' + year + '.' + week + '.' + exGroup + '.' + camelName + '.fullName', exName, Object);
        });

        // The following sequence is to eliminate items that are deleted by the user.
        // Since whole exercises are saved only on user selecting save, additions and
        // deletions are done simeltaneously.

        var exercisesInDatabase = _lodash2.default.uniq(_lodash2.default.flatten(Object.keys(newData.exerciseData[year][week]).map(function (exGroup) {
            return Object.keys(newData.exerciseData[year][week][exGroup]).map(function (exercise) {
                return exercise;
            });
        })));
        var exercisesToDelete = _lodash2.default.difference(exercisesInDatabase, exercisesInDataToSave);
        Object.keys(newData.exerciseData[year][week]).filter(function (exGroup) {
            var groupsInDataToSave = Object.keys(req.body.dataToSave).map(function (data) {
                return req.body.dataToSave[data].exerciseGroup;
            });
            return groupsInDataToSave.includes(exGroup);
        }).forEach(function (exGroup) {
            return Object.keys(newData.exerciseData[year][week][exGroup]).forEach(function (exercise) {
                if (exercisesToDelete.includes(exercise)) {
                    delete newData.exerciseData[year][week][exGroup][exercise];
                }
            });
        });

        _ex_model2.default.findOneAndUpdate({
            userId: req.body.user
        }, {
            $set: {
                exerciseData: newData.exerciseData
            }
        }, {
            new: true
        }).exec().then(function (profile) {
            return res.status(201).json(profile);
        }).catch(function () {
            res.status(500);
        });
    });
});

router.post('/get_friend_data', function (req, res) {
    var _req$body = req.body,
        user = _req$body.user,
        friendFbId = _req$body.friendFbId;

    _user_model.User.findOne({
        fbId: user
    }).then(function (userProfile) {
        _user_model.User.findOne({
            fbId: friendFbId
        }).then(function (friendProfile) {
            var userStatusOfFriend = _lodash2.default.find(userProfile.friends, function (friend) {
                return friend.fbId === friendFbId;
            }).status;
            var friendStatusOfUser = _lodash2.default.find(friendProfile.friends, function (friend) {
                return friend.fbId === user;
            }).status;
            if (userStatusOfFriend === 'active' && friendStatusOfUser === 'active') {
                getExerciseData(req, res);
            } else {
                res.status(202).json({ reason: 'friend not accepted' });
            }
        });
    }).catch(function () {
        res.status(500);
    });
});

router.post('/get_data', getExerciseData);

router.put('/get_weeks', function (req, res) {
    _ex_model2.default.findOne({
        userId: req.body.user
    }).then(function (data) {
        var years = Object.keys(data.exerciseData);
        var weekRanges = years.map(function (year) {
            return _defineProperty({}, year, Object.keys(data.exerciseData[year]).map(function (week) {
                var weekStart = (0, _moment2.default)().startOf('week').week(week).format('MMM DD YY');
                var weekEnd = (0, _moment2.default)().endOf('week').week(week).format('MMM DD YY');
                return weekStart + ' to ' + weekEnd;
            }));
        });
        res.status(200).json({ weekRanges: weekRanges });
    }).catch(function () {
        res.status(500);
    });
});

module.exports = { router: router };

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _rxjs = __webpack_require__(16);

var _passport = __webpack_require__(5);

var _passport2 = _interopRequireDefault(_passport);

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _expressJwt = __webpack_require__(1);

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _jsonwebtoken = __webpack_require__(4);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user_model = __webpack_require__(7);

var _ex_model = __webpack_require__(6);

var _ex_model2 = _interopRequireDefault(_ex_model);

var _exercisesList = __webpack_require__(18);

var _exercisesList2 = _interopRequireDefault(_exercisesList);

var _config = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eJwt = _expressJwt2.default;
var jwt = _jsonwebtoken2.default;

var router = _express2.default.Router();

router.use(eJwt({ secret: _config.SECRET2,
    getToken: function fromQuery(req) {
        return req.headers.token;
    },
    requestProperty: 'auth'
}).unless({ path: ['/user/init_profile'] }));

router.get('/', function (req, res) {
    _user_model.User.find().exec().then(function (users) {
        var allUsers = users.map(function (user) {
            return { user: user.user, fbId: user.fbId };
        });
        res.status(201).json({ allUsers: allUsers });
    }).catch(function () {
        res.status(500);
    });
});

router.get('/init_profile', _passport2.default.authenticate('facebook', {
    failureRedirect: '/user/failed_auth'
}), function (req, res) {
    _user_model.User.findOne({
        fbId: req.user.id
    }).exec().then(function (user) {
        if (!user) {
            _user_model.User.create({
                user: req.user.name.givenName + ' ' + req.user.name.familyName,
                friends: [],
                profileImage: req.user.photos[0].value,
                fbId: req.user.id
            }).then(function () {
                _ex_model2.default.create({
                    userId: req.user.id,
                    exerciseData: {}
                }).then().catch(function () {
                    res.status(500);
                });
            }).catch(function () {
                res.status(500);
            });
        }
    }).catch(function () {
        res.status(500);
    });

    res.redirect('/init_token?token=' + req.user.token);
});

router.get('/failed_auth', function (req, res) {
    res.json({ failed: 'failed' });
});

router.get('/profile', function (req, res) {
    var userId = jwt.verify(req.headers.token, _config.SECRET2).user;
    _user_model.User.findOne({
        fbId: userId
    }).exec().then(function (profile) {
        var prof = profile.toObject();
        res.status(201).json(_extends({}, prof, { exercisesList: _exercisesList2.default }));
    }).catch(function (err) {
        res.send(500, { err: err });
    });
});

router.put('/add_friend', function (req, res) {
    var user = req.body.user;
    var friend = req.body.friend;

    var friendProfile = void 0;
    var friendProfileUpdate = _rxjs.Observable.fromPromise(_user_model.User.findOneAndUpdate({ fbId: friend.fbId }, { $push: {
            friends: {
                name: user.name,
                fbId: user.fbId,
                status: 'pending',
                sentByUser: false,
                avatar: user.profileImage
            }
        } }).exec().then(function (profile) {
        friendProfile = profile;
    }));
    var userProfileUpdate = function userProfileUpdate(fProfile) {
        return _rxjs.Observable.fromPromise(_user_model.User.findOneAndUpdate({ fbId: user.fbId }, { $push: {
                friends: {
                    name: fProfile.user,
                    fbId: fProfile.fbId,
                    status: 'pending',
                    sentByUser: true,
                    avatar: fProfile.profileImage
                }
            } }, { new: true }).exec().then(function (profile) {
            return profile;
        }));
    };

    friendProfileUpdate.map(function () {
        return userProfileUpdate(friendProfile);
    }).concatAll().subscribe(function (profile) {
        res.status(201).json(profile);
    }, function () {
        res.status(500);
    });
});

router.put('/accept_friend', function (req, res) {
    _user_model.User.findOneAndUpdate({
        fbId: req.body.friendFbId,
        friends: {
            $elemMatch: {
                fbId: req.body.userFbId
            }
        }
    }, {
        $set: {
            'friends.$.status': 'active'
        }
    }, {
        new: true
    }).exec().then().catch(function (err) {
        res.status(500).json({
            err: err
        });
    });

    _user_model.User.findOneAndUpdate({
        fbId: req.body.userFbId,
        friends: {
            $elemMatch: {
                fbId: req.body.friendFbId
            }
        }
    }, {
        $set: {
            'friends.$.status': 'active'
        }
    }, {
        new: true
    }).exec().then(function (profile) {
        res.status(200).json(profile);
    }).catch(function (err) {
        return res.status(500).json({
            err: err
        });
    });
});

router.put('/delete_friend', function (req, res) {
    var userId = req.body.user;
    var friendId = req.body.friend.fbId;

    _user_model.User.findOneAndUpdate({ fbId: userId }, { $pull: { friends: { fbId: friendId } } }, { new: true }).exec().then(function (profile) {
        res.status(200).json(profile);
    }).catch(function (err) {
        return res.status(500).json({ err: err });
    });

    _user_model.User.findOneAndUpdate({ fbId: friendId }, { $pull: { friends: { fbId: userId } } }, { new: true }).exec().then().catch(function (err) {
        return res.status(500).json({ err: err });
    });
});

module.exports = { router: router };

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("passport-facebook");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("shortid");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var passport = __webpack_require__(5);
var bodyParser = __webpack_require__(3);
var mongoose = __webpack_require__(2);
var express = __webpack_require__(0);
var Strategy = __webpack_require__(12).Strategy;
var jwt = __webpack_require__(4);
var eJwt = __webpack_require__(1);
var shortid = __webpack_require__(13);

var _require = __webpack_require__(9),
    exerciseDataRouter = _require.router;

var _require2 = __webpack_require__(10),
    userRouter = _require2.router;

var blacklist = { // this object is to keep the inital temporary tokens
    tokens: [0], // blacklisted, since they are sent in the url.
    getRevokedToken: function getRevokedToken(tokenId, cb) {
        var _this = this;

        // The newToken below, is sent in a more secure way
        this.tokens.forEach(function (curToken) {
            // and so is not limited to the session.
            if (curToken === tokenId) {
                return cb(null, true);
            }
            _this.tokens.push(tokenId);
            return cb(null, false);
        });
    }
};

var isRevokedCallback = function isRevokedCallback(req, payload, done) {
    var tokenId = payload.jti;

    blacklist.getRevokedToken(tokenId, function (err, isRevoked) {
        if (err) {
            return done(err);
        }
        return done(null, isRevoked);
    });
};

process.env.PWD = process.cwd();

mongoose.Promise = global.Promise;

var app = express();

var _require3 = __webpack_require__(8),
    PORT = _require3.PORT,
    DATABASE_URL = _require3.DATABASE_URL,
    SECRET1 = _require3.SECRET1,
    SECRET2 = _require3.SECRET2;

app.use(express.static(process.env.PWD + '/build'));

passport.use(new Strategy({
    clientID: '266134167169182',
    clientSecret: '636f0c825d31af79085033dc03a58a43',
    callbackURL: '/user/init_profile',
    profileFields: ['picture', 'first_name', 'last_name']
}, function (accessToken, refreshToken, profile, cb) {
    profile.token = jwt.sign(profile, SECRET1, { // eslint-disable-line
        expiresIn: 10,
        jwtid: shortid.generate()
    });
    cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/exercise_data', exerciseDataRouter);
app.use('/user', userRouter);

app.get('/', function (request, response) {
    response.sendFile(process.env.PWD + '/build/index.html');
});

app.get('/success', function (req, res) {
    res.status(200).json({ request: req, response: res, user: req.user });
});

app.get('/new_token', eJwt({ secret: SECRET1,
    getToken: function fromQuery(req) {
        return req.query.initToken;
    },
    isRevoked: isRevokedCallback
}), function (req, res) {
    var newToken = jwt.sign({ user: req.user.id }, SECRET2, { expiresIn: '7 days' });
    res.json({ newToken: newToken });
});

app.get('/login/facebook', passport.authenticate('facebook', { scope: 'public_profile' }));

app.get('/init_token', function (req, res) {
    res.redirect('/auth/' + req.query.token);
});

app.get('/verify_auth', eJwt({ secret: SECRET2,
    getToken: function fromQuery(req) {
        return req.headers.token;
    },
    requestProperty: 'auth'
}), function (req, res) {
    res.send(201);
}, function (req, res) {
    console.log(req.headers.token);
});

app.get('*', function (request, response) {
    response.sendFile(process.env.PWD + '/build/index.html');
});

var server = void 0;

function runServer() {
    return new Promise(function (resolve, reject) {
        mongoose.connect(DATABASE_URL, function (err) {
            // eslint-disable-line
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, function () {
                console.log('Your app is listening on port ' + PORT); // eslint-disable-line
                resolve();
            }).on('error', function () {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(function () {
        return new Promise(function (resolve, reject) {
            console.log('closing server'); // eslint-disable-line
            server.close(function (err) {
                // eslint-disable-line
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (__webpack_require__.c[__webpack_require__.s] === module) {
    runServer().catch(function (err) {
        return console.error(err);
    }); // eslint-disable-line
}

module.exports = { app: app, runServer: runServer, closeServer: closeServer };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__(14);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var list = JSON.stringify({
    'ab crunch machine': 'abdominals',
    'ab roller': 'abdominals',
    adductor: 'adductors',
    'adductor/groin': 'adductors',
    'advanced kettlebell windmill': 'abdominals',
    'air bike': 'abdominals',
    'all fours quad stretch': 'quadriceps',
    'alternate hammer curl': 'biceps',
    'alternate heel touchers': 'abdominals',
    'alternate incline dumbbell curl': 'biceps',
    'alternate leg diagonal bound': 'quadriceps',
    'alternating cable shoulder press': 'shoulders',
    'alternating deltoid raise': 'shoulders',
    'alternating floor press': 'chest',
    'alternating hang clean': 'hamstrings',
    'alternating kettlebell press': 'shoulders',
    'alternating kettlebell row': 'middle back',
    'alternating renegade row': 'middle back',
    'ankle circles': 'calves',
    'ankle on the knee': 'glutes',
    'anterior tibialis-smr': 'calves',
    'anti-gravity press': 'shoulders',
    'arm circles': 'shoulders',
    'arnold dumbbell press': 'shoulders',
    'around the worlds': 'chest',
    'atlas stone trainer': 'lower back',
    'atlas stones': 'lower back',
    'axle deadlift': 'lower back',
    'back flyes - with bands': 'shoulders',
    'backward drag': 'quadriceps',
    'backward medicine ball throw': 'shoulders',
    'balance board': 'calves',
    'ball leg curl': 'hamstrings',
    'band assisted pull-up': 'lats',
    'band good morning': 'hamstrings',
    'band good morning (pull through)': 'hamstrings',
    'band hip adductions': 'adductors',
    'band pull apart': 'shoulders',
    'band skull crusher': 'triceps',
    'barbell ab rollout': 'abdominals',
    'barbell ab rollout - on knees': 'abdominals',
    'barbell bench press - medium grip': 'chest',
    'barbell curl': 'biceps',
    'barbell curls lying against an incline': 'biceps',
    'barbell deadlift': 'lower back',
    'barbell full squat': 'quadriceps',
    'barbell glute bridge': 'glutes',
    'barbell guillotine bench press': 'chest',
    'barbell hack squat': 'quadriceps',
    'barbell hip thrust': 'glutes',
    'barbell incline bench press - medium grip': 'chest',
    'barbell incline shoulder raise': 'shoulders',
    'barbell lunge': 'quadriceps',
    'barbell rear delt row': 'shoulders',
    'barbell rollout from bench': 'abdominals',
    'barbell seated calf raise': 'calves',
    'barbell shoulder press': 'shoulders',
    'barbell shrug': 'traps',
    'barbell shrug behind the back': 'traps',
    'barbell side bend': 'abdominals',
    'barbell side split squat': 'quadriceps',
    'barbell squat': 'quadriceps',
    'barbell squat to a bench': 'quadriceps',
    'barbell step ups': 'quadriceps',
    'barbell walking lunge': 'quadriceps',
    'battling ropes': 'shoulders',
    'bear crawl sled drags': 'quadriceps',
    'behind head chest stretch': 'chest',
    'bench dips': 'triceps',
    'bench jump': 'quadriceps',
    'bench press - powerlifting': 'triceps',
    'bench press - with bands': 'chest',
    'bench press with chains': 'triceps',
    'bench sprint': 'quadriceps',
    'bent over barbell row': 'middle back',
    'bent over dumbbell rear delt raise with head on bench': 'shoulders',
    'bent over low-pulley side lateral': 'shoulders',
    'bent over one-arm long bar row': 'middle back',
    'bent over two-arm long bar row': 'middle back',
    'bent over two-dumbbell row': 'middle back',
    'bent over two-dumbbell row with palms in': 'middle back',
    'bent press': 'abdominals',
    'bent-arm barbell pullover': 'lats',
    'bent-arm dumbbell pullover': 'chest',
    'bent-knee hip raise': 'abdominals',
    bicycling: 'stationary',
    'board press': 'triceps',
    'body tricep press': 'triceps',
    'body-up': 'triceps',
    'bodyweight flyes': 'chest',
    'bodyweight mid row': 'middle back',
    'bodyweight squat': 'quadriceps',
    'bodyweight walking lunge': 'quadriceps',
    'bosu ball cable crunch with side bends': 'abdominals',
    'bottoms up': 'abdominals',
    'bottoms-up clean from the hang position': 'forearms',
    'box jump (multiple response)': 'hamstrings',
    'box skip': 'hamstrings',
    'box squat': 'quadriceps',
    'box squat with bands': 'quadriceps',
    'box squat with chains': 'quadriceps',
    'brachialis-smr': 'biceps',
    'bradford/rocky presses': 'shoulders',
    'butt lift (bridge)': 'glutes',
    'butt-ups': 'abdominals',
    butterfly: 'chest',
    'cable chest press': 'chest',
    'cable crossover': 'chest',
    'cable crunch': 'abdominals',
    'cable deadlifts': 'quadriceps',
    'cable hammer curls - rope attachment': 'biceps',
    'cable hip adduction': 'quadriceps',
    'cable incline pushdown': 'lats',
    'cable incline triceps extension': 'triceps',
    'cable internal rotation': 'shoulders',
    'cable iron cross': 'chest',
    'cable judo flip': 'abdominals',
    'cable lying triceps extension': 'triceps',
    'cable one arm tricep extension': 'triceps',
    'cable preacher curl': 'biceps',
    'cable rear delt fly': 'shoulders',
    'cable reverse crunch': 'abdominals',
    'cable rope overhead triceps extension': 'triceps',
    'cable rope rear-delt rows': 'shoulders',
    'cable russian twists': 'abdominals',
    'cable seated crunch': 'abdominals',
    'cable seated lateral raise': 'shoulders',
    'cable shoulder press': 'shoulders',
    'cable shrugs': 'traps',
    'cable tuck reverse crunch': 'abdominals',
    'cable wrist curl': 'forearms',
    'calf press': 'calves',
    'calf press on the leg press machine': 'calves',
    'calf raise on a dumbbell': 'calves',
    'calf raises - with bands': 'calves',
    'calf stretch elbows against wall': 'calves',
    'calf stretch hands against wall': 'calves',
    'calf-machine shoulder shrug': 'traps',
    'calves-smr': 'calves',
    'car deadlift': 'quadriceps',
    'car drivers': 'shoulders',
    'carioca quick step': 'adductors',
    'cat stretch': 'lower back',
    'catch and overhead throw': 'lats',
    'chain handle extension': 'triceps',
    'chain press': 'chest',
    'chair leg extended stretch': 'hamstrings',
    'chair lower back stretch': 'lats',
    'chair squat': 'quadriceps',
    'chair upper body stretch': 'shoulders',
    'chest and front of shoulder stretch': 'chest',
    'chest push (multiple response)': 'chest',
    'chest push (single response)': 'chest',
    'chest push from 3 point stance': 'chest',
    'chest push with run release': 'chest',
    'chest stretch on stability ball': 'chest',
    'child\'s pose': 'lower back',
    'chin to chest stretch': 'neck',
    'chin-up': 'lats',
    'circus bell': 'shoulders',
    clean: 'hamstrings',
    'clean and jerk': 'shoulders',
    'clean and press': 'shoulders',
    'clean deadlift': 'hamstrings',
    'clean from blocks': 'quadriceps',
    'clean pull': 'quadriceps',
    'clean shrug': 'traps',
    'clock push-up': 'chest',
    'close-grip barbell bench press': 'triceps',
    'close-grip dumbbell press': 'triceps',
    'close-grip ez bar curl': 'biceps',
    'close-grip ez-bar curl with band': 'biceps',
    'close-grip ez-bar press': 'triceps',
    'close-grip front lat pulldown': 'lats',
    'close-grip push-up off of a dumbbell': 'triceps',
    'close-grip standing barbell curl': 'biceps',
    cocoons: 'abdominals',
    'conan\'s wheel': 'quadriceps',
    'concentration curls': 'biceps',
    'cross body hammer curl': 'biceps',
    'cross over - with bands': 'chest',
    'cross-body crunch': 'abdominals',
    'crossover reverse lunge': 'lower back',
    crucifix: 'shoulders',
    'crunch - hands overhead': 'abdominals',
    'crunch - legs on exercise ball': 'abdominals',
    crunches: 'abdominals',
    'cuban press': 'shoulders',
    'dancer\'s stretch': 'lower back',
    'deadlift with bands': 'lower back',
    'deadlift with chains': 'lower back',
    'decline barbell bench press': 'chest',
    'decline close-grip bench to skull crusher': 'triceps',
    'decline crunch': 'abdominals',
    'decline dumbbell bench press': 'chest',
    'decline dumbbell flyes': 'chest',
    'decline dumbbell triceps extension': 'triceps',
    'decline ez bar triceps extension': 'triceps',
    'decline oblique crunch': 'abdominals',
    'decline push-up': 'chest',
    'decline reverse crunch': 'abdominals',
    'decline smith press': 'chest',
    'deficit deadlift': 'lower back',
    'depth jump leap': 'quadriceps',
    'dip machine': 'triceps',
    'dips - chest version': 'chest',
    'dips - triceps version': 'triceps',
    'donkey calf raises': 'calves',
    'double kettlebell alternating hang clean': 'hamstrings',
    'double kettlebell jerk': 'shoulders',
    'double kettlebell push press': 'shoulders',
    'double kettlebell snatch': 'shoulders',
    'double kettlebell windmill': 'abdominals',
    'double leg butt kick': 'quadriceps',
    'downward facing balance': 'glutes',
    'drag curl': 'biceps',
    'drop push': 'chest',
    'dumbbell alternate bicep curl': 'biceps',
    'dumbbell bench press': 'chest',
    'dumbbell bench press with neutral grip': 'chest',
    'dumbbell bicep curl': 'biceps',
    'dumbbell clean': 'hamstrings',
    'dumbbell floor press': 'triceps',
    'dumbbell flyes': 'chest',
    'dumbbell incline row': 'middle back',
    'dumbbell incline shoulder raise': 'shoulders',
    'dumbbell lunges': 'quadriceps',
    'dumbbell lying one-arm rear lateral raise': 'shoulders',
    'dumbbell lying pronation': 'forearms',
    'dumbbell lying rear lateral raise': 'shoulders',
    'dumbbell lying supination': 'forearms',
    'dumbbell one-arm shoulder press': 'shoulders',
    'dumbbell one-arm triceps extension': 'triceps',
    'dumbbell one-arm upright row': 'shoulders',
    'dumbbell prone incline curl': 'biceps',
    'dumbbell raise': 'shoulders',
    'dumbbell rear lunge': 'quadriceps',
    'dumbbell scaption': 'shoulders',
    'dumbbell seated box jump': 'quadriceps',
    'dumbbell seated one-leg calf raise': 'calves',
    'dumbbell shoulder press': 'shoulders',
    'dumbbell shrug': 'traps',
    'dumbbell side bend': 'abdominals',
    'dumbbell squat': 'quadriceps',
    'dumbbell squat to a bench': 'quadriceps',
    'dumbbell step ups': 'quadriceps',
    'dumbbell tricep extension -pronated grip': 'triceps',
    'dynamic back stretch': 'lats',
    'dynamic chest stretch': 'chest',
    'elbow circles': 'shoulders',
    'elbow to knee': 'abdominals',
    'elbows back': 'chest',
    'elevated back lunge': 'quadriceps',
    'elevated cable rows': 'lats',
    'elliptical trainer': 'quadriceps',
    'exercise ball crunch': 'abdominals',
    'exercise ball pull-in': 'abdominals',
    'extended range one-arm kettlebell floor press': 'chest',
    'external rotation': 'shoulders',
    'external rotation with band': 'shoulders',
    'external rotation with cable': 'shoulders',
    'ez-bar curl': 'biceps',
    'ez-bar skullcrusher': 'triceps',
    'face pull': 'shoulders',
    'farmer\'s walk': 'forearms',
    'fast skipping': 'quadriceps',
    'finger curls': 'forearms',
    'flat bench cable flyes': 'chest',
    'flat bench leg pull-in': 'abdominals',
    'flat bench lying leg raise': 'abdominals',
    'flexor incline dumbbell curls': 'biceps',
    'floor glute-ham raise': 'hamstrings',
    'floor press': 'triceps',
    'floor press with chains': 'triceps',
    'flutter kicks': 'glutes',
    'foot-smr': 'calves',
    'forward drag with press': 'chest',
    'frankenstein squat': 'quadriceps',
    'freehand jump squat': 'quadriceps',
    'frog hops': 'quadriceps',
    'frog sit-ups': 'abdominals',
    'front barbell squat': 'quadriceps',
    'front barbell squat to a bench': 'quadriceps',
    'front box jump': 'hamstrings',
    'front cable raise': 'shoulders',
    'front cone hops (or hurdle hops)': 'quadriceps',
    'front dumbbell raise': 'shoulders',
    'front incline dumbbell raise': 'shoulders',
    'front leg raises': 'hamstrings',
    'front plate raise': 'shoulders',
    'front raise and pullover': 'chest',
    'front squat (clean grip)': 'quadriceps',
    'front squats with two kettlebells': 'quadriceps',
    'front two-dumbbell raise': 'shoulders',
    'full range-of-motion lat pulldown': 'lats',
    'gironda sternum chins': 'lats',
    'glute ham raise': 'hamstrings',
    'glute kickback': 'glutes',
    'goblet squat': 'quadriceps',
    'good morning': 'hamstrings',
    'good morning off pins': 'hamstrings',
    'gorilla chin/crunch': 'abdominals',
    'groin and back stretch': 'adductors',
    groiners: 'adductors',
    'hack squat': 'quadriceps',
    'hammer curls': 'biceps',
    'hammer grip incline db bench press': 'chest',
    'hamstring stretch': 'hamstrings',
    'hamstring-smr': 'hamstrings',
    'handstand push-ups': 'shoulders',
    'hang clean': 'quadriceps',
    'hang clean - below the knees': 'quadriceps',
    'hang snatch': 'hamstrings',
    'hang snatch - below knees': 'hamstrings',
    'hanging bar good morning': 'hamstrings',
    'hanging leg raise': 'abdominals',
    'hanging pike': 'abdominals',
    'heaving snatch balance': 'quadriceps',
    'heavy bag thrust': 'chest',
    'high cable curls': 'biceps',
    'hip circles (prone)': 'abductors',
    'hip crossover': '',
    'hip extension with bands': 'glutes',
    'hip flexion with band': 'quadriceps',
    'hip lift with band': 'glutes',
    'hug a ball': 'lower back',
    'hug knees to chest': 'lower back',
    'hurdle hops': 'hamstrings',
    'hyperextensions (back extensions)': 'lower back',
    'hyperextensions with no hyperextension bench': 'lower back',
    'iliotibial tract-smr': 'abductors',
    'incline barbell triceps extension': 'triceps',
    'incline bench pull': 'middle back',
    'incline cable chest press': 'chest',
    'incline cable flye': 'chest',
    'incline dumbbell bench with palms facing in': 'chest',
    'incline dumbbell curl': 'biceps',
    'incline dumbbell flyes': 'chest',
    'incline dumbbell flyes - with a twist': 'chest',
    'incline dumbbell press': 'chest',
    'incline hammer curls': 'biceps',
    'incline inner biceps curl': 'biceps',
    'incline push-up': 'chest',
    'incline push-up close-grip': 'triceps',
    'incline push-up depth jump': 'chest',
    'incline push-up medium': 'chest',
    'incline push-up reverse grip': 'chest',
    'incline push-up wide': 'chest',
    'intermediate groin stretch': 'hamstrings',
    'intermediate hip flexor and quad stretch': 'quadriceps',
    'internal rotation with band': 'shoulders',
    'inverted row': 'middle back',
    'inverted row with straps': 'middle back',
    'iron cross': 'shoulders',
    'iron crosses (stretch)': 'quadriceps',
    'isometric chest squeezes': 'chest',
    'isometric neck exercise - front and back': 'neck',
    'isometric neck exercise - sides': 'neck',
    'isometric wipers': 'chest',
    'it band and glute stretch': 'abductors',
    'jackknife sit-up': 'abdominals',
    'janda sit-up': 'abdominals',
    'jefferson squats': 'quadriceps',
    'jerk balance': 'shoulders',
    'jerk dip squat': 'quadriceps',
    'jm press': 'triceps',
    'jogging-treadmill': 'quadriceps',
    'keg load': 'lower back',
    'kettlebell arnold press': 'shoulders',
    'kettlebell dead clean': 'hamstrings',
    'kettlebell figure 8': 'abdominals',
    'kettlebell hang clean': 'hamstrings',
    'kettlebell one-legged deadlift': 'hamstrings',
    'kettlebell pass between the legs': 'abdominals',
    'kettlebell pirate ships': 'shoulders',
    'kettlebell pistol squat': 'quadriceps',
    'kettlebell seated press': 'shoulders',
    'kettlebell seesaw press': 'shoulders',
    'kettlebell sumo high pull': 'traps',
    'kettlebell thruster': 'shoulders',
    'kettlebell turkish get-up (lunge style)': 'shoulders',
    'kettlebell turkish get-up (squat style)': 'shoulders',
    'kettlebell windmill': 'abdominals',
    'kipping muscle up': 'lats',
    'knee across the body': 'glutes',
    'knee circles': 'calves',
    'knee tuck jump': 'hamstrings',
    'knee/hip raise on parallel bars': 'abdominals',
    'kneeling arm drill': 'shoulders',
    'kneeling cable crunch with alternating oblique twists': 'abdominals',
    'kneeling cable triceps extension': 'triceps',
    'kneeling forearm stretch': 'forearms',
    'kneeling high pulley row': 'lats',
    'kneeling hip flexor': 'quadriceps',
    'kneeling jump squat': 'glutes',
    'kneeling single-arm high pulley row': 'lats',
    'kneeling squat': 'glutes',
    'landmine 180\'s': 'abdominals',
    'landmine linear jammer': 'shoulders',
    'lateral bound': 'adductors',
    'lateral box jump': 'adductors',
    'lateral cone hops': 'adductors',
    'lateral raise - with bands': 'shoulders',
    'latissimus dorsi-smr': 'lats',
    'leg extensions': 'quadriceps',
    'leg lift': 'glutes',
    'leg press': 'quadriceps',
    'leg pull-in': 'abdominals',
    'leg-over floor press': 'chest',
    'leg-up hamstring stretch': 'hamstrings',
    'leverage chest press': 'chest',
    'leverage deadlift': 'quadriceps',
    'leverage decline chest press': 'chest',
    'leverage high row': 'middle back',
    'leverage incline chest press': 'chest',
    'leverage iso row': 'lats',
    'leverage shoulder press': 'shoulders',
    'leverage shrug': 'traps',
    'linear 3-part start technique': 'hamstrings',
    'linear acceleration wall drill': 'hamstrings',
    'linear depth jump': 'quadriceps',
    'log lift': 'shoulders',
    'london bridges': 'lats',
    'looking at ceiling': 'quadriceps',
    'low cable crossover': 'chest',
    'low cable triceps extension': 'triceps',
    'low pulley row to neck': 'shoulders',
    'lower back curl': 'abdominals',
    'lower back-smr': 'lower back',
    'lunge pass through': 'hamstrings',
    'lunge sprint': 'quadriceps',
    'lying bent leg groin': 'adductors',
    'lying cable curl': 'biceps',
    'lying cambered barbell row': 'middle back',
    'lying close-grip bar curl on high pulley': 'biceps',
    'lying close-grip barbell triceps extension behind the head': 'triceps',
    'lying close-grip barbell triceps press to chin': 'triceps',
    'lying crossover': 'abductors',
    'lying dumbbell tricep extension': 'triceps',
    'lying face down plate neck resistance': 'neck',
    'lying face up plate neck resistance': 'neck',
    'lying glute': 'glutes',
    'lying hamstring': 'hamstrings',
    'lying high bench barbell curl': 'biceps',
    'lying leg curls': 'hamstrings',
    'lying machine squat': 'quadriceps',
    'lying one-arm lateral raise': 'shoulders',
    'lying prone quadriceps': 'quadriceps',
    'lying rear delt raise': 'shoulders',
    'lying supine dumbbell curl': 'biceps',
    'lying t-bar row': 'middle back',
    'lying triceps press': 'triceps',
    'machine bench press': 'chest',
    'machine bicep curl': 'biceps',
    'machine preacher curls': 'biceps',
    'machine shoulder (military) press': 'shoulders',
    'machine triceps extension': 'triceps',
    'medicine ball chest pass': 'chest',
    'medicine ball full twist': 'abdominals',
    'medicine ball scoop throw': 'shoulders',
    'middle back shrug': 'middle back',
    'middle back stretch': 'middle back',
    'mixed grip chin': 'middle back',
    'monster walk': 'abductors',
    'mountain climbers': 'quadriceps',
    'moving claw series': 'hamstrings',
    'muscle snatch': 'hamstrings',
    'muscle up': 'lats',
    'narrow stance hack squats': 'quadriceps',
    'narrow stance leg press': 'quadriceps',
    'narrow stance squats': 'quadriceps',
    'natural glute ham raise': 'hamstrings',
    'neck press': 'chest',
    'neck-smr': 'neck',
    'oblique crunches': 'abdominals',
    'oblique crunches - on the floor': 'abdominals',
    'olympic squat': 'quadriceps',
    'on your side quad stretch': 'quadriceps',
    'on-your-back quad stretch': 'quadriceps',
    'one arm against wall': 'lats',
    'one arm chin-up': 'middle back',
    'one arm dumbbell bench press': 'chest',
    'one arm dumbbell preacher curl': 'biceps',
    'one arm floor press': 'triceps',
    'one arm lat pulldown': 'lats',
    'one arm pronated dumbbell triceps extension': 'triceps',
    'one arm supinated dumbbell triceps extension': 'triceps',
    'one half locust': 'quadriceps',
    'one handed hang': 'lats',
    'one knee to chest': 'glutes',
    'one leg barbell squat': 'quadriceps',
    'one-arm dumbbell row': 'middle back',
    'one-arm flat bench dumbbell flye': 'chest',
    'one-arm high-pulley cable side bends': 'abdominals',
    'one-arm incline lateral raise': 'shoulders',
    'one-arm kettlebell clean': 'hamstrings',
    'one-arm kettlebell clean and jerk': 'shoulders',
    'one-arm kettlebell floor press': 'chest',
    'one-arm kettlebell jerk': 'shoulders',
    'one-arm kettlebell military press to the side': 'shoulders',
    'one-arm kettlebell para press': 'shoulders',
    'one-arm kettlebell push press': 'shoulders',
    'one-arm kettlebell row': 'middle back',
    'one-arm kettlebell snatch': 'shoulders',
    'one-arm kettlebell split jerk': 'shoulders',
    'one-arm kettlebell split snatch': 'shoulders',
    'one-arm kettlebell swings': 'hamstrings',
    'one-arm long bar row': 'middle back',
    'one-arm medicine ball slam': 'abdominals',
    'one-arm open palm kettlebell clean': 'hamstrings',
    'one-arm overhead kettlebell squats': 'quadriceps',
    'one-arm side deadlift': 'quadriceps',
    'one-arm side laterals': 'shoulders',
    'one-legged cable kickback': 'glutes',
    'open palm kettlebell clean': 'hamstrings',
    'otis-up': 'abdominals',
    'overhead cable curl': 'biceps',
    'overhead lat': 'lats',
    'overhead slam': 'lats',
    'overhead squat': 'quadriceps',
    'overhead stretch': 'abdominals',
    'overhead triceps': 'triceps',
    'pallof press with rotation': 'abdominals',
    'palms-down dumbbell wrist curl over a bench': 'forearms',
    'palms-down wrist curl over a bench': 'forearms',
    'palms-up barbell wrist curl over a bench': 'forearms',
    'palms-up dumbbell wrist curl over a bench': 'forearms',
    'parallel bar dip': 'triceps',
    'pelvic tilt into bridge': 'lower back',
    'peroneals stretch': 'calves',
    'peroneals-smr': 'calves',
    'physioball hip bridge': 'glutes',
    'pin presses': 'triceps',
    'piriformis-smr': 'glutes',
    plank: 'abdominals',
    'plank with twist': '',
    'plate pinch': 'forearms',
    'plate twist': 'abdominals',
    'platform hamstring slides': 'hamstrings',
    'plie dumbbell squat': 'quadriceps',
    'plyo kettlebell pushups': 'chest',
    'plyo push-up': 'chest',
    'posterior tibialis stretch': 'calves',
    'power clean': 'hamstrings',
    'power clean from blocks': 'hamstrings',
    'power jerk': 'quadriceps',
    'power partials': 'shoulders',
    'power snatch': 'hamstrings',
    'power snatch from blocks': 'quadriceps',
    'power stairs': 'hamstrings',
    'preacher curl': 'biceps',
    'preacher hammer dumbbell curl': 'biceps',
    'press sit-up': 'abdominals',
    'prone manual hamstring': 'hamstrings',
    'prowler sprint': 'hamstrings',
    'pull through': 'glutes',
    pullups: 'lats',
    'push press': 'shoulders',
    'push press - behind the neck': 'shoulders',
    'push up to side plank': 'chest',
    'push-up wide': 'chest',
    'push-ups - close triceps position': 'triceps',
    'push-ups with feet elevated': 'chest',
    'push-ups with feet on an exercise ball': 'chest',
    pushups: 'chest',
    'pushups (close and wide hand positions)': 'chest',
    pyramid: 'lower back',
    'quad stretch': 'quadriceps',
    'quadriceps-smr': 'quadriceps',
    'quick leap': 'quadriceps',
    'rack delivery': 'shoulders',
    'rack pull with bands': 'lower back',
    'rack pulls': 'lower back',
    'rear leg raises': 'quadriceps',
    'recumbent bike': 'quadriceps',
    'return push from stance': 'shoulders',
    'reverse band bench press': 'triceps',
    'reverse band box squat': 'quadriceps',
    'reverse band deadlift': 'lower back',
    'reverse band power squat': 'quadriceps',
    'reverse band sumo deadlift': 'hamstrings',
    'reverse barbell curl': 'biceps',
    'reverse barbell preacher curls': 'biceps',
    'reverse cable curl': 'biceps',
    'reverse crunch': 'abdominals',
    'reverse flyes': 'shoulders',
    'reverse flyes with external rotation': 'shoulders',
    'reverse grip bent-over rows': 'middle back',
    'reverse grip triceps pushdown': 'triceps',
    'reverse hyperextension': 'hamstrings',
    'reverse machine flyes': 'shoulders',
    'reverse plate curls': 'biceps',
    'reverse triceps bench press': 'triceps',
    'rhomboids-smr': 'middle back',
    'rickshaw carry': 'forearms',
    'rickshaw deadlift': 'quadriceps',
    'ring dips': 'triceps',
    'rocket jump': 'quadriceps',
    'rocking standing calf raise': 'calves',
    'rocky pull-ups/pulldowns': 'lats',
    'romanian deadlift': 'hamstrings',
    'romanian deadlift from deficit': 'hamstrings',
    'rope climb': 'lats',
    'rope crunch': 'abdominals',
    'rope jumping': 'quadriceps',
    'rope straight-arm pulldown': 'lats',
    'round the world shoulder stretch': 'shoulders',
    rowing: 'stationary',
    'runner\'s stretch': 'hamstrings',
    running: 'treadmill',
    'russian twist': 'abdominals',
    'sandbag load': 'quadriceps',
    'scapular pull-up': 'traps',
    'scissor kick': 'abdominals',
    'scissors jump': 'quadriceps',
    'seated band hamstring curl': 'hamstrings',
    'seated barbell military press': 'shoulders',
    'seated barbell twist': 'abdominals',
    'seated bent-over one-arm dumbbell triceps extension': 'triceps',
    'seated bent-over rear delt raise': 'shoulders',
    'seated bent-over two-arm dumbbell triceps extension': 'triceps',
    'seated biceps': 'biceps',
    'seated cable rows': 'middle back',
    'seated cable shoulder press': 'shoulders',
    'seated calf raise': 'calves',
    'seated calf stretch': 'calves',
    'seated close-grip concentration barbell curl': 'biceps',
    'seated dumbbell curl': 'biceps',
    'seated dumbbell inner biceps curl': 'biceps',
    'seated dumbbell palms-down wrist curl': 'forearms',
    'seated dumbbell palms-up wrist curl': 'forearms',
    'seated dumbbell press': 'shoulders',
    'seated flat bench leg pull-in': 'abdominals',
    'seated floor hamstring stretch': 'hamstrings',
    'seated front deltoid': 'shoulders',
    'seated glute': 'glutes',
    'seated good mornings': 'lower back',
    'seated hamstring': 'hamstrings',
    'seated hamstring and calf stretch': 'hamstrings',
    'seated head harness neck resistance': 'neck',
    'seated leg curl': 'hamstrings',
    'seated leg tucks': 'abdominals',
    'seated one-arm cable pulley rows': 'middle back',
    'seated one-arm dumbbell palms-down wrist curl': 'forearms',
    'seated one-arm dumbbell palms-up wrist curl': 'forearms',
    'seated overhead stretch': 'abdominals',
    'seated palm-up barbell wrist curl': 'forearms',
    'seated palms-down barbell wrist curl': 'forearms',
    'seated side lateral raise': 'shoulders',
    'seated triceps press': 'triceps',
    'seated two-arm palms-up low-pulley wrist curl': 'forearms',
    'see-saw press (alternating side press)': 'shoulders',
    'shotgun row': 'lats',
    'shoulder circles': 'shoulders',
    'shoulder press - with bands': 'shoulders',
    'shoulder raise': 'shoulders',
    'shoulder stretch': 'shoulders',
    'side bridge': 'abdominals',
    'side hop-sprint': 'quadriceps',
    'side jackknife': 'abdominals',
    'side lateral raise': 'shoulders',
    'side laterals to front raise': 'shoulders',
    'side leg raises': 'adductors',
    'side lying groin stretch': 'adductors',
    'side neck stretch': 'neck',
    'side standing long jump': 'quadriceps',
    'side to side box shuffle': 'quadriceps',
    'side to side chins': 'lats',
    'side wrist pull': 'shoulders',
    'side-lying floor stretch': 'lats',
    'single dumbbell raise': 'shoulders',
    'single leg butt kick': 'quadriceps',
    'single leg glute bridge': 'glutes',
    'single leg push-off': 'quadriceps',
    'single-arm cable crossover': 'chest',
    'single-arm linear jammer': 'shoulders',
    'single-arm push-up': 'chest',
    'single-cone sprint drill': 'quadriceps',
    'single-leg high box squat': 'quadriceps',
    'single-leg hop progression': 'quadriceps',
    'single-leg lateral hop': 'quadriceps',
    'single-leg leg extension': 'quadriceps',
    'single-leg stride jump': 'quadriceps',
    'sit squats': 'quadriceps',
    'sit-up': 'abdominals',
    skating: 'quadriceps',
    'sled drag - harness': 'quadriceps',
    'sled overhead backward walk': 'shoulders',
    'sled overhead triceps extension': 'triceps',
    'sled push': 'quadriceps',
    'sled reverse flye': 'shoulders',
    'sled row': 'middle back',
    'sledgehammer swings': 'abdominals',
    'smith incline shoulder raise': 'shoulders',
    'smith machine behind the back shrug': 'traps',
    'smith machine bench press': 'chest',
    'smith machine bent over row': 'middle back',
    'smith machine calf raise': 'calves',
    'smith machine close-grip bench press': 'triceps',
    'smith machine decline press': 'chest',
    'smith machine hang power clean': 'hamstrings',
    'smith machine hip raise': 'abdominals',
    'smith machine incline bench press': 'chest',
    'smith machine leg press': 'quadriceps',
    'smith machine one-arm upright row': 'shoulders',
    'smith machine overhead shoulder press': 'shoulders',
    'smith machine pistol squat': 'quadriceps',
    'smith machine reverse calf raises': 'calves',
    'smith machine shrug': 'traps',
    'smith machine squat': 'quadriceps',
    'smith machine stiff-legged deadlift': 'hamstrings',
    'smith machine upright row': 'traps',
    'smith single-leg split squat': 'quadriceps',
    snatch: 'quadriceps',
    'snatch balance': 'quadriceps',
    'snatch deadlift': 'hamstrings',
    'snatch from blocks': 'quadriceps',
    'snatch pull': 'hamstrings',
    'snatch shrug': 'traps',
    'speed band overhead triceps': 'triceps',
    'speed band pushdown': 'triceps',
    'speed box squat': 'quadriceps',
    'speed squats': 'quadriceps',
    'spell caster': 'abdominals',
    'spider crawl': 'abdominals',
    'spider curl': 'biceps',
    'spinal stretch': 'middle back',
    'split clean': 'quadriceps',
    'split jerk': 'quadriceps',
    'split jump': 'quadriceps',
    'split snatch': 'hamstrings',
    'split squat with dumbbells': 'quadriceps',
    'split squats': 'hamstrings',
    'squat jerk': 'quadriceps',
    'squat with bands': 'quadriceps',
    'squat with chains': 'quadriceps',
    'squat with plate movers': 'quadriceps',
    'squats - with bands': 'quadriceps',
    stairmaster: 'quadriceps',
    'standing alternating dumbbell press': 'shoulders',
    'standing barbell calf raise': 'calves',
    'standing barbell press behind neck': 'shoulders',
    'standing bent-over one-arm dumbbell triceps extension': 'triceps',
    'standing bent-over two-arm dumbbell triceps extension': 'triceps',
    'standing biceps cable curl': 'biceps',
    'standing biceps stretch': 'biceps',
    'standing bradford press': 'shoulders',
    'standing cable chest press': 'chest',
    'standing cable lift': 'abdominals',
    'standing cable wood chop': 'abdominals',
    'standing calf raises': 'calves',
    'standing concentration curl': 'biceps',
    'standing dumbbell calf raise': 'calves',
    'standing dumbbell press': 'shoulders',
    'standing dumbbell reverse curl': 'biceps',
    'standing dumbbell straight-arm front delt raise above head': 'shoulders',
    'standing dumbbell triceps extension': 'triceps',
    'standing dumbbell upright row': 'traps',
    'standing elevated quad stretch': 'quadriceps',
    'standing front barbell raise over head': 'shoulders',
    'standing gastrocnemius calf stretch': 'calves',
    'standing hamstring and calf stretch': 'hamstrings',
    'standing hip circles': 'abductors',
    'standing hip flexors': 'quadriceps',
    'standing inner-biceps curl': 'biceps',
    'standing lateral stretch': 'abdominals',
    'standing leg curl': 'hamstrings',
    'standing long jump': 'quadriceps',
    'standing low-pulley deltoid raise': 'shoulders',
    'standing low-pulley one-arm triceps extension': 'triceps',
    'standing military press': 'shoulders',
    'standing olympic plate hand squeeze': 'forearms',
    'standing one-arm cable curl': 'biceps',
    'standing one-arm dumbbell curl over incline bench': 'biceps',
    'standing one-arm dumbbell triceps extension': 'triceps',
    'standing overhead barbell triceps extension': 'triceps',
    'standing palm-in one-arm dumbbell press': 'shoulders',
    'standing palms-in dumbbell press': 'shoulders',
    'standing palms-up barbell behind the back wrist curl': 'forearms',
    'standing pelvic tilt': 'lower back',
    'standing rope crunch': 'abdominals',
    'standing soleus and achilles stretch': 'calves',
    'standing toe touches': 'hamstrings',
    'standing towel triceps extension': 'triceps',
    'standing two-arm overhead throw': 'shoulders',
    'star jump': 'quadriceps',
    'step mill': 'quadriceps',
    'step-up with knee raise': 'glutes',
    'stiff leg barbell good morning': 'lower back',
    'stiff-legged barbell deadlift': 'hamstrings',
    'stiff-legged dumbbell deadlift': 'hamstrings',
    'stomach vacuum': 'abdominals',
    'straight bar bench mid rows': 'middle back',
    'straight raises on incline bench': 'shoulders',
    'straight-arm dumbbell pullover': 'chest',
    'straight-arm pulldown': 'lats',
    'stride jump crossover': 'quadriceps',
    'sumo deadlift': 'hamstrings',
    'sumo deadlift with bands': 'hamstrings',
    'sumo deadlift with chains': 'hamstrings',
    superman: 'lower back',
    'supine chest throw': 'triceps',
    'supine one-arm overhead throw': 'abdominals',
    'supine two-arm overhead throw': 'abdominals',
    'suspended push-up': 'chest',
    'suspended reverse crunch': 'abdominals',
    'suspended row': 'middle back',
    'suspended split squat': 'quadriceps',
    't-bar row with handle': 'middle back',
    'tate press': 'triceps',
    'the straddle': 'hamstrings',
    'thigh abductor': 'abductors',
    'thigh adductor': 'adductors',
    'tire flip': 'quadriceps',
    'toe touchers': 'abdominals',
    'torso rotation': 'abdominals',
    'trail running/walking': 'quadriceps',
    'trap bar deadlift': 'quadriceps',
    'tricep dumbbell kickback': 'triceps',
    'tricep side stretch': 'triceps',
    'triceps overhead extension with rope': 'triceps',
    'triceps pushdown': 'triceps',
    'triceps pushdown - rope attachment': 'triceps',
    'triceps pushdown - v-bar attachment': 'triceps',
    'triceps stretch': 'triceps',
    'tuck crunch': 'abdominals',
    'two-arm dumbbell preacher curl': 'biceps',
    'two-arm kettlebell clean': 'shoulders',
    'two-arm kettlebell jerk': 'shoulders',
    'two-arm kettlebell military press': 'shoulders',
    'two-arm kettlebell row': 'middle back',
    'underhand cable pulldowns': 'lats',
    'upper back stretch': 'middle back',
    'upper back-leg grab': 'hamstrings',
    'upright barbell row': 'shoulders',
    'upright cable row': 'traps',
    'upright row - with bands': 'traps',
    'upward stretch': 'shoulders',
    'v-bar pulldown': 'lats',
    'v-bar pullup': 'lats',
    'vertical swing': 'hamstrings',
    walking: 'treadmill',
    'weighted ball hyperextension': 'lower back',
    'weighted ball side bend': 'abdominals',
    'weighted bench dip': 'triceps',
    'weighted crunches': 'abdominals',
    'weighted jump squat': 'quadriceps',
    'weighted pull ups': 'lats',
    'weighted sissy squat': 'quadriceps',
    'weighted sit-ups - with bands': 'abdominals',
    'weighted squat': 'quadriceps',
    'wide stance barbell squat': 'quadriceps',
    'wide stance stiff legs': 'hamstrings',
    'wide-grip barbell bench press': 'chest',
    'wide-grip decline barbell bench press': 'chest',
    'wide-grip decline barbell pullover': 'chest',
    'wide-grip lat pulldown': 'lats',
    'wide-grip pulldown behind the neck': 'lats',
    'wide-grip rear pull-up': 'lats',
    'wide-grip standing barbell curl': 'biceps',
    'wind sprints': 'abdominals',
    windmills: 'abductors',
    'world\'s greatest stretch': 'hamstrings',
    'wrist circles': 'forearms',
    'wrist roller': 'forearms',
    'wrist rotations with straight bar': 'forearms',
    'yoke walk': 'quadriceps',
    'zercher squats': 'quadriceps',
    'zottman curl': 'biceps',
    'zottman preacher curl': 'biceps'
});

var listToJS = JSON.parse(list);

var exercisesList = Object.keys(listToJS).reduce(function (acc, cur) {
    var currentExercise = _lodash2.default.capitalize(cur);
    var type = listToJS[cur];
    switch (type) {
        case 'abdominals':
        case 'adductors':
            {
                type = 'abs';
                break;
            }
        case 'quadriceps':
        case 'hamstrings':
        case 'glutes':
            {
                type = 'legs';
                break;
            }
        case 'biceps':
        case 'triceps':
        case 'forearms':
            type = 'arms';
            break;
        case 'shoulders':
        case 'traps':
        case 'neck':
            {
                type = 'shoulders';
                break;
            }
        case 'chest':
            {
                type = 'chest';
                break;
            }
        case 'middle back':
        case 'lower back':
        case 'lats':
            {
                type = 'back';
                break;
            }
        default:
            type = 'other';
    }

    if (acc[type]) {
        var arr = Array.from(acc[type]);
        arr.push(currentExercise);
        return _extends({}, acc, _defineProperty({}, type, arr));
    }
    return _extends({}, acc, _defineProperty({}, type, [currentExercise]));
}, {});

exports.default = exercisesList;

/***/ })
/******/ ]);