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
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

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


var mongoose = __webpack_require__(3);

var UserSchema = mongoose.Schema({
    user: { type: String, required: true },
    friends: { type: Array },
    profileImage: { type: String },
    fbId: { type: String, rqeuired: true }
});

UserSchema.methods.apiRepr = function apiRepr() {
    return {
        fbId: this.fbId,
        user: this.user,
        profileImage: this.profileImage,
        friends: this.friends
    };
};

var User = mongoose.model('user_data', UserSchema);

module.exports = { User: User };

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/workout';
exports.PORT = process.env.PORT || 8081;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = __webpack_require__(20);

var _moment2 = _interopRequireDefault(_moment);

var _lodash = __webpack_require__(19);

var _lodash2 = _interopRequireDefault(_lodash);

var _ex_model = __webpack_require__(18);

var _ex_model2 = _interopRequireDefault(_ex_model);

var _user_model = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var jsonParser = __webpack_require__(0).json();
var express = __webpack_require__(1);
var eJwt = __webpack_require__(2);

var router = express.Router();

router.use(jsonParser);
router.use(eJwt({ secret: 'super stank',
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

            var userRangeData = Object.keys(exerciseData).filter(function (years) {
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

            res.status(200).json({
                data: userRangeData
            });
        }
    });
}

router.put('/', function (req, res) {
    console.log(req.body);
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
        console.log(prevData);
        console.log('222222222222222222222222222');
        var newData = _lodash2.default.cloneDeep(prevData);
        var year = void 0;
        var week = void 0;

        if (req.body.year === 'undefined') {
            year = (0, _moment2.default)().year().toString();
        } else {
            year = req.body.year;
        }

        if (req.body.week === 'undefined') {
            week = (0, _moment2.default)().week().toString();
        } else {
            week = req.body.week;
        }

        var exercisesInDataToSave = [];
        req.body.dataToSave.forEach(function (data) {
            var i = req.body.dataToSave.indexOf(data);
            var exSets = req.body.dataToSave[i].exerciseData;
            var exName = req.body.dataToSave[i].exercise;
            var camelName = _lodash2.default.camelCase(req.body.dataToSave[i].exercise);
            var exGroup = req.body.dataToSave[i].exerciseGroup;
            exercisesInDataToSave.push(camelName);

            newData = _lodash2.default.setWith(newData, 'exerciseData.' + year + '.' + week + '.' + exGroup + '.' + camelName + '.data', exSets, Object);
            newData = _lodash2.default.setWith(newData, 'exerciseData.' + year + '.' + week + '.' + exGroup + '.' + camelName + '.sets', exSets.length, Object);
            newData = _lodash2.default.setWith(newData, 'exerciseData.' + year + '.' + week + '.' + exGroup + '.' + camelName + '.fullName', exName, Object);
        });

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
        }).catch(function (err) {
            console.log(err);
            res.status(500).json(err);
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
            }
        });
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
    });
});

module.exports = { router: router };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _rxjs = __webpack_require__(21);

var _user_model = __webpack_require__(6);

var _ex_model = __webpack_require__(18);

var _ex_model2 = _interopRequireDefault(_ex_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passport = __webpack_require__(5);

var O = _rxjs.Observable;
var jsonParser = __webpack_require__(0).json();
var express = __webpack_require__(1);
var eJwt = __webpack_require__(2);
var jwt = __webpack_require__(4);

var router = express.Router();

router.use(eJwt({ secret: 'super stank',
    getToken: function fromQuery(req) {
        return req.headers.token;
    },
    requestProperty: 'auth'
}).unless({ path: ['/user/init_profile'] }));

router.get('/', function (req, res) {
    _user_model.User.find({}).exec().then(function (users) {
        var allUsers = users.map(function (user) {
            return { user: user.user, fbId: user.fbId };
        });
        res.status(201).json({ allUsers: allUsers });
    });
});

// TODO: trying to send the token from req.user into the params for /init_token

router.get('/init_profile', passport.authenticate('facebook', {
    failureRedirect: '/user/failed_auth'
}), function (req, res) {
    _user_model.User.findOne({
        fbId: req.user.id
    }).exec().then(function (user) {
        if (!user) {
            console.log('this works');
            _user_model.User.create({
                user: req.user.name.givenName + ' ' + req.user.name.familyName,
                friends: [],
                profileImage: req.user.photos[0].value,
                fbId: req.user.id
            }).then(function () {
                _ex_model2.default.create({
                    userId: req.user.id,
                    exerciseData: {}
                }).then(function (profile) {
                    console.log('ExerciseData created: ', profile);
                }).catch(function (err) {
                    res.status(500).json({});
                });
            }).catch(function (err) {
                res.status(500);
            });
            console.log('but does this?');
        }
    }).catch(function (err) {
        res.status(500);
    });

    res.redirect('/init_token?token=' + req.user.token);
});

router.get('/failed_auth', function (req, res) {
    res.json({ failed: 'failed' });
});

router.get('/profile', function (req, res) {
    var userId = jwt.verify(req.headers.token, 'super stank').user;
    _user_model.User.findOne({
        fbId: userId
    }).exec().then(function (profile) {
        res.status(201).json(profile);
    }).catch(function (err) {
        console.log(err);
        res.send(401, { err: err });
    });
});

router.put('/add_friend', function (req, res) {
    var user = req.body.user;
    var friend = req.body.friend;

    var friendProfile = void 0;
    var friendProfileUpdate = O.fromPromise(_user_model.User.findOneAndUpdate({ fbId: friend.fbId }, { $push: {
            friends: {
                name: user.name,
                fbId: user.fbId,
                status: 'pending',
                sentByUser: false
            }
        } }).exec().then(function (profile) {
        console.log(profile);
        friendProfile = profile;
    }));
    var userProfileUpdate = function userProfileUpdate(fProfile) {
        return O.fromPromise(_user_model.User.findOneAndUpdate({ fbId: user.fbId }, { $push: {
                friends: {
                    name: fProfile.user,
                    fbId: fProfile.fbId,
                    status: 'pending',
                    sentByUser: true
                }
            } }, { new: true }).exec().then(function (profile) {
            return profile;
        }));
    };

    friendProfileUpdate.map(function () {
        return userProfileUpdate(friendProfile);
    }).concatAll().subscribe(function (profile) {
        res.status(201).json(profile);
    }, function (err) {
        console.log(err);
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
    }).exec().then(function (profile) {
        console.log('at least this happened');
    }).catch(function (err) {
        console.log(err);
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
        console.log(profile);
        res.status(200).json(profile);
    }).catch(function (err) {
        return res.status(500).json({ err: err });
    });

    _user_model.User.findOneAndUpdate({ fbId: friendId }, { $pull: { friends: { fbId: userId } } }, { new: true }).exec().then(function (profile) {
        console.log(profile);
    }).catch(function (err) {
        return res.status(500).json({ err: err });
    });
});

module.exports = { router: router };

/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("node-codein");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("passport-facebook");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("shortid");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(3);

var exerciseDataSchema = mongoose.Schema({
    userId: { type: String, required: true },
    exerciseData: { type: Object, required: true }
}, { minimize: false });

exerciseDataSchema.methods.apiRepr = function () {
    return {
        id: undefined.id,
        userId: undefined.projectName,
        exerciseData: undefined.exerciseData
    };
};

var ExerciseData = mongoose.model('exercise_datas', exerciseDataSchema);

module.exports = ExerciseData;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var passport = __webpack_require__(5);
var bodyParser = __webpack_require__(0);
var cookieParser = __webpack_require__(11);
var mongoose = __webpack_require__(3);
var express = __webpack_require__(1);
var Strategy = __webpack_require__(16).Strategy;
var morgan = __webpack_require__(14)('combined');
var expressSession = __webpack_require__(13);
var jwt = __webpack_require__(4);
var cors = __webpack_require__(12);
var eJwt = __webpack_require__(2);
var shortid = __webpack_require__(17);

var _require = __webpack_require__(8),
    exerciseDataRouter = _require.router;

var _require2 = __webpack_require__(9),
    userRouter = _require2.router;

var codein = __webpack_require__(15);

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

var _require3 = __webpack_require__(7),
    PORT = _require3.PORT,
    DATABASE_URL = _require3.DATABASE_URL;

app.use(express.static(process.env.PWD + '/build'));

passport.use(new Strategy({
    clientID: '266134167169182',
    clientSecret: '636f0c825d31af79085033dc03a58a43',
    callbackURL: 'http://localhost:8081/user/init_profile',
    profileFields: ['picture', 'first_name', 'last_name']
}, function (accessToken, refreshToken, profile, cb) {
    profile.token = jwt.sign(profile, 'funky smell', {
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

// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         console.log('***********AUTHORIZED');
//         return next();
//     }
//     console.log('~~~~not authenticated~~~~~');
// };

// app.use(morgan('combined'));
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(cors());

app.use(passport.initialize());
// app.use(passport.session());

app.use('/exercise_data', exerciseDataRouter);
app.use('/user', userRouter);

app.get('/', function (request, response) {
    response.sendFile(process.env.PWD + '/build/index.html');
});

app.get('/success', function (req, res) {
    res.status(200).json({ request: req, response: res, user: req.user });
});

app.get('/new_token', eJwt({ secret: 'funky smell',
    getToken: function fromQuery(req) {
        return req.query.initToken;
    },
    isRevoked: isRevokedCallback
}), function (req, res) {
    console.log('req.user.id: ', req.user.id);
    var newToken = jwt.sign({ user: req.user.id }, 'super stank', { expiresIn: '7 days' });
    res.json({ newToken: newToken });
});

app.get('/login/facebook', passport.authenticate('facebook', { scope: 'public_profile' }));

app.get('/init_token', function (req, res) {
    console.log(req.params);
    res.redirect('/auth/' + req.query.token);
});

app.get('/verify_auth', eJwt({ secret: 'super stank',
    getToken: function fromQuery(req) {
        return req.headers.token;
    },
    requestProperty: 'auth'
}), function (req, res) {
    res.send(201);
});

app.get('*', function (request, response) {
    response.sendFile(process.env.PWD + '/build/index.html');
});

var server = void 0;

function runServer() {
    return new Promise(function (resolve, reject) {
        mongoose.connect(DATABASE_URL, function (err) {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, function () {
                console.log('Your app is listening on port ' + PORT);
                resolve();
            }).on('error', function (err) {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(function () {
        return new Promise(function (resolve, reject) {
            console.log('closing server');
            server.close(function (err) {
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
    });
}

module.exports = { app: app, runServer: runServer, closeServer: closeServer };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ })
/******/ ]);