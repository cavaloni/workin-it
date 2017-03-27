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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/transcriptions';
exports.PORT = process.env.PORT || 8081;

/***/ }),
/* 1 */,
/* 2 */
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
/* 3 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("passport-facebook");

/***/ }),
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var passport = __webpack_require__(11);
var bodyParser = __webpack_require__(3);
var cookieParser = __webpack_require__(4);
var mongoose = __webpack_require__(9);
var express = __webpack_require__(6);
var Strategy = __webpack_require__(12).Strategy;
var morgan = __webpack_require__(10)('combined');
var expressSession = __webpack_require__(7);
var jwt = __webpack_require__(8);
var cors = __webpack_require__(5);
var eJwt = __webpack_require__(16);
var shortid = __webpack_require__(19);

var _require = __webpack_require__(28),
    exerciseDataRouter = _require.router;

var _require2 = __webpack_require__(48),
    userRouter = _require2.router;

var JwtStrategy = __webpack_require__(33).Strategy;
var ExtractJwt = __webpack_require__(33).ExtractJwt;
var JsonCircular = __webpack_require__(41);
var codein = __webpack_require__(43);

// TODO: So the user is not being attached to req 

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

var _require3 = __webpack_require__(0),
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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

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
    var newToken = jwt.sign({ user: req.user.id }, 'super stank', { expiresIn: '7 days' });
    res.json({ newToken: newToken });
});

app.get('/login/facebook', passport.authenticate('facebook', { scope: 'public_profile' }));

app.get('/init_token', function (req, res) {
    res.redirect('/auth/' + req.user.token);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(25);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(24);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(22);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(18);
var alphabet = __webpack_require__(17);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(17);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(17);
var encode = __webpack_require__(18);
var decode = __webpack_require__(21);
var build = __webpack_require__(20);
var isValid = __webpack_require__(23);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(26) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(17);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = __webpack_require__(27);
var randomBytes = crypto.randomBytes;

function randomByte() {
    return randomBytes(1)[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = parseInt(process.env.NODE_UNIQUE_ID || 0, 10);


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = __webpack_require__(32);

var _moment2 = _interopRequireDefault(_moment);

var _lodash = __webpack_require__(31);

var _lodash2 = _interopRequireDefault(_lodash);

var _ex_model = __webpack_require__(29);

var _ex_model2 = _interopRequireDefault(_ex_model);

var _mockData = __webpack_require__(30);

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var jsonParser = __webpack_require__(3).json();
var express = __webpack_require__(6);
var eJwt = __webpack_require__(16);

var router = express.Router();

router.use(jsonParser);
router.use(eJwt({ secret: 'super stank',
    getToken: function fromQuery(req) {
        return req.headers.token;
    }
}));

router.post('/', function (req, res) {
    var requiredFields = ['user', 'exerciseData'];
    requiredFields.forEach(function (field) {
        if (!(field in req.body)) {
            res.status(400).json({
                error: 'Missing "' + field + '" in request body'
            });
        }
    });

    _ex_model2.default.create({
        user: req.body.user,
        ExerciseData: req.body.exerciseData
    }).then(function (data) {
        return res.status(201).json(data.apiRepr());
    }).catch(function (err) {
        res.status(500).json({
            error: 'something went wrong',
            errData: err
        });
    });
});

router.put('/', function (req, res) {
    var requiredFields = ['user', 'exerciseData'];
    requiredFields.forEach(function (field) {
        if (!(field in req.body)) {
            res.status(400).json({
                error: 'Missing "' + field + '" in request body'
            });
        }
    });

    var prevData = void 0;

    _ex_model2.default.find(req.body.user).exec().then(function (ed) {
        prevData = ed.map(function (userData) {
            return userData.apiRepr;
        });
    });

    var newData = _extends({}, prevData[0], _defineProperty({}, Object.keys(req.body.exerciseData)[0], req.body.exerciseData));

    _ex_model2.default.findByIdAndUpdate(req.params.id, { $set: newData }) // TODO: need to figure out what the id is going to be
    .then(function (data) {
        return res.status(201).json(data.apiRepr());
    }).catch(function (err) {
        res.status(500).json({
            error: 'something went wrong',
            errData: err
        });
    });
});

router.get('/', function (req, res) {
    var allUserData = void 0;
    _ex_model2.default.findOne({
        user: req.body.user
    }).then(function (data) {
        allUserData = data.apiRepr();
    });

    var yearQuery = void 0;
    var weekQuery = void 0;

    if (!req.body.yearQuery) {
        yearQuery = (0, _moment2.default)().year();
    } else {
        yearQuery = req.body.year;
    }

    if (!req.body.weekQuery) {
        weekQuery = _moment2.default.week();
    } else {
        weekQuery = req.body.week;
    }

    var userRangeData = Object.keys(allUserData).filter(function (years) {
        return years === yearQuery;
    }).map(function (year) {
        return Object.keys(allUserData[year]);
    })[0].filter(function (weeks) {
        var weekRangeMax = weekQuery + 1;
        var weekRangeMin = weekQuery - 4;
        return _lodash2.default.inRange(weeks, weekRangeMin, weekRangeMax);
    }).reduce(function (weekSet, week) {
        return _extends({}, weekSet, _defineProperty({}, week, allUserData[2017][week]));
    }, {});

    res.status(201).json({ data: userRangeData });
});

module.exports = { router: router };

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(9);

var exerciseDataSchema = mongoose.Schema({
    user: { type: String, required: true },
    exerciseData: {}
});

exerciseDataSchema.methods.apiRepr = function () {
    return {
        id: undefined.id,
        user: undefined.projectName,
        exerciseData: undefined.exerciseData
    };
};

var ExerciseData = mongoose.model('exercise_data', exerciseDataSchema);

module.exports = ExerciseData;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var mockData = {
    10: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 180,
                    reps: 4
                }, {
                    weight: 180,
                    reps: 5
                }, {
                    weight: 180,
                    reps: 6
                }]
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 80,
                    reps: 4
                }]
            }
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 280,
                    reps: 1
                }, {
                    weight: 280,
                    reps: 2
                }]
            }
        }
    },
    11: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 185,
                    reps: 4
                }, {
                    weight: 185,
                    reps: 5
                }, {
                    weight: 185,
                    reps: 6
                }]
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 85,
                    reps: 4
                }]
            }
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 280,
                    reps: 1
                }, {
                    weight: 280,
                    reps: 2
                }]
            }
        }
    },
    12: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 190,
                    reps: 4
                }, {
                    weight: 190,
                    reps: 5
                }, {
                    weight: 190,
                    reps: 6
                }]
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 90,
                    reps: 4
                }]
            }
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 290,
                    reps: 1
                }, {
                    weight: 290,
                    reps: 2
                }]
            }
        }
    },
    13: {
        arms: {
            pullUps: {
                fullName: 'Pull Ups',
                sets: 3,
                data: [{
                    weight: 200,
                    reps: 5
                }, {
                    weight: 200,
                    reps: 4
                }, {
                    weight: 200,
                    reps: 4
                }]
            },
            tricepPullDown: {
                fullName: 'Tricep Pull Down',
                sets: 3,
                data: [{
                    weight: 100,
                    reps: 4
                }]
            }
        },
        back: {
            cockPushUps: {
                fullName: 'Cock Push Ups',
                sets: 2,
                data: [{
                    weight: 310,
                    reps: 1
                }, {
                    weight: 300,
                    reps: 2
                }]
            }
        }
    }
};

var fakePeople = [{
    name: 'Bubba Jones',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData
}, {
    name: 'Jesus Christ',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData
}, {
    name: 'Milford WaxPaddy',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData
}, {
    name: 'Who Bo Fo Ducky',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData
}];

exports.default = mockData;

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Strategy = __webpack_require__(37),
    ExtractJwt = __webpack_require__(36);


module.exports = {
    Strategy: Strategy,
    ExtractJwt : ExtractJwt
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var re = /(\S+)\s+(\S+)/;



function parseAuthHeader(hdrValue) {
    if (typeof hdrValue !== 'string') {
        return null;
    }
    var matches = hdrValue.match(re);
    return matches && { scheme: matches[1], value: matches[2] };
}



module.exports = {
    parse: parseAuthHeader
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(35),
    auth_hdr = __webpack_require__(34);

// Note: express http converts all headers
// to lower case.
var AUTH_HEADER = "authorization",
    DEFAULT_AUTH_SCHEME = "JWT";


var extractors = {};


extractors.fromHeader = function (header_name) {
    return function (request) {
        var token = null;
        if (request.headers[header_name]) {
            token = request.headers[header_name];
        }
        return token;
    };
};



extractors.fromBodyField = function (field_name) {
    return function (request) {
        var token = null;
        if (request.body && Object.prototype.hasOwnProperty.call(request.body, field_name)) {
            token = request.body[field_name];
        }
        return token;
    };
};



extractors.fromUrlQueryParameter = function (param_name) {
    return function (request) {
        var token = null,
            parsed_url = url.parse(request.url, true);
        if (parsed_url.query && Object.prototype.hasOwnProperty.call(parsed_url.query, param_name)) {
            token = parsed_url.query[param_name];
        }
        return token;
    };
};



extractors.fromAuthHeaderWithScheme = function (auth_scheme) {
    return function (request) {

        var token = null;
        if (request.headers[AUTH_HEADER]) {
            var auth_params = auth_hdr.parse(request.headers[AUTH_HEADER]);
            if (auth_params && auth_scheme === auth_params.scheme) {
                token = auth_params.value;
            }
        }
        return token;
    };
};



extractors.fromAuthHeader = function () {
    return extractors.fromAuthHeaderWithScheme(DEFAULT_AUTH_SCHEME);
};


extractors.fromExtractors = function(extractors) {
    if (!Array.isArray(extractors)) {
        throw new TypeError('extractors.fromExtractors expects an array')
    }
    
    return function (request) {
        var token = null;
        var index = 0;
        while(!token && index < extractors.length) {
            token = extractors[index].call(this, request);
            index ++;
        }
        return token;
    }
};


/**
 * This extractor mimics the behavior of the v1.*.* extraction logic.
 *
 * This extractor exists only to provide an easy transition from the v1.*.* API to the v2.0.0
 * API.
 *
 * This extractor first checks the auth header, if it doesn't find a token there then it checks the 
 * specified body field and finally the url query parameters.
 * 
 * @param options
 *          authScheme: Expected scheme when JWT can be found in HTTP Authorize header. Default is JWT. 
 *          tokenBodyField: Field in request body containing token. Default is auth_token.
 *          tokenQueryParameterName: Query parameter name containing the token. Default is auth_token.
 */
extractors.versionOneCompatibility = function (options) {
    var authScheme = options.authScheme || DEFAULT_AUTH_SCHEME,
        bodyField = options.tokenBodyField || 'auth_token',
        queryParam = options.tokenQueryParameterName || 'auth_token';

    return function (request) {
        var authHeaderExtractor = extractors.fromAuthHeaderWithScheme(authScheme);
        var token =  authHeaderExtractor(request);
        
        if (!token) {
            var bodyExtractor = extractors.fromBodyField(bodyField);
            token = bodyExtractor(request);
        }

        if (!token) {
            var queryExtractor = extractors.fromUrlQueryParameter(queryParam);
            token = queryExtractor(request);
        }

        return token;
    };
}



/**
 * Export the Jwt extraction functions
 */
module.exports = extractors;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var passport = __webpack_require__(39)
    , auth_hdr = __webpack_require__(34)
    , util = __webpack_require__(40)
    , url = __webpack_require__(35);



/**
 * Strategy constructor
 *
 * @param options
 *          secretOrKey: (REQUIRED) String or buffer containing the secret or PEM-encoded public key
 *          jwtFromRequest: (REQUIRED) Function that accepts a reqeust as the only parameter and returns the either JWT as a string or null
 *          issuer: If defined issuer will be verified against this value
 *          audience: If defined audience will be verified against this value
 *          algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
 *          ignoreExpiration: if true do not validate the expiration of the token.
 *          passReqToCallback: If true the, the verify callback will be called with args (request, jwt_payload, done_callback).
 * @param verify - Verify callback with args (jwt_payload, done_callback) if passReqToCallback is false,
 *                 (request, jwt_payload, done_callback) if true.
 */
function JwtStrategy(options, verify) {

    passport.Strategy.call(this);
    this.name = 'jwt';

    this._secretOrKey = options.secretOrKey;
    if (!this._secretOrKey) {
        throw new TypeError('JwtStrategy requires a secret or key');
    }

    this._verify = verify;
    if (!this._verify) {
        throw new TypeError('JwtStrategy requires a verify callback');
    }

    this._jwtFromRequest = options.jwtFromRequest;
    if (!this._jwtFromRequest) {
        throw new TypeError('JwtStrategy requires a function to retrieve jwt from requests (see option jwtFromRequest)');
    }

    this._passReqToCallback = options.passReqToCallback;
    this._verifOpts = {};

    if (options.issuer) {
        this._verifOpts.issuer = options.issuer;
    }

    if (options.audience) {
        this._verifOpts.audience = options.audience;
    }

    if (options.algorithms) {
        this._verifOpts.algorithms = options.algorithms;
    }

    if (options.ignoreExpiration != null) {
        this._verifOpts.ignoreExpiration = options.ignoreExpiration;
    }

};
util.inherits(JwtStrategy, passport.Strategy);



/**
 * Allow for injection of JWT Verifier.
 *
 * This improves testability by allowing tests to cleanly isolate failures in the JWT Verification
 * process from failures in the passport related mechanics of authentication.
 *
 * Note that this should only be replaced in tests.
 */
JwtStrategy.JwtVerifier = __webpack_require__(38);



/**
 * Authenticate request based on JWT obtained from header or post body
 */
JwtStrategy.prototype.authenticate = function(req, options) {
    var self = this;

    var token = self._jwtFromRequest(req);

    if (!token) {
        return self.fail(new Error("No auth token"));
    }

    // Verify the JWT
    JwtStrategy.JwtVerifier(token, this._secretOrKey, this._verifOpts, function(jwt_err, payload) {
        if (jwt_err) {
            return self.fail(jwt_err);
        } else {
            // Pass the parsed token to the user
            var verified = function(err, user, info) {
                if(err) {
                    return self.error(err);
                } else if (!user) {
                    return self.fail(info);
                } else {
                    return self.success(user, info);
                }
            };

            try {
                if (self._passReqToCallback) {
                    self._verify(req, payload, verified);
                } else {
                    self._verify(payload, verified);
                }
            } catch(ex) {
                self.error(ex);
            }
        }
    });
};



/**
 * Export the Jwt Strategy
 */
 module.exports = JwtStrategy;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var jwt = __webpack_require__(8);

module.exports  = function(token, secretOrKey, options, callback) { 
    return jwt.verify(token, secretOrKey, options, callback);
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("passport-strategy");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

var self;
module.exports = exports = self = {};

self.magicMarkerName = "@internal-ref";
self.deserializationError = {"@internal-error": "Invalid Deserialization Reference"};

self.stringify = function(obj, replacer){
	var returnStr = JSON.stringify(self.preprocess(obj), replacer);
	self.postprocess(obj);
	return returnStr;
};

self.parse = function(str, reviver){
	return self.postprocess(JSON.parse(str, reviver));
};

self.preprocess = function(obj){
	var visited = [obj];
	var paths = [""];
	var path = "";
	var process = function(lobj, lpath){
		for(var k in lobj){
			var localpath = lpath;
			if(localpath != "")
				localpath += ".";
			localpath += k;
			if(typeof(lobj[k]) == "object"){
				if(visited.indexOf(lobj[k]) >= 0){
					var targetPath = paths[visited.indexOf(lobj[k])];
					lobj[k] = {};
					lobj[k][self.magicMarkerName] = targetPath;
				}else{
					visited.push(lobj[k]);
					paths.push(localpath);
					process(lobj[k], localpath);
				}
			}
		}
	};
	process(obj, path);
	return obj;
};

self.postprocess = function(obj){
	var fetchTargetRef = function(lobj, targetPath){
		if(targetPath.indexOf('.') >= 0){
			var pathFragment = targetPath.substr(0, targetPath.indexOf('.'));
			if(pathFragment in lobj){
				var newPath = targetPath.substr(targetPath.indexOf('.')+1);
				return fetchTargetRef(lobj[pathFragment], newPath);
			}else{
				return self.deserializationError;
			}
		}else{
			if(targetPath == ""){
				return lobj;
			}else if(targetPath in lobj){
				return lobj[targetPath];
			}else{
				return self.deserializationError;
			}
		}
	};
	var process = function(lobj){
		for(var k in lobj){
			if(typeof(lobj[k]) == "object"){
				if(self.magicMarkerName in lobj[k]){
					var targetPath = lobj[k][self.magicMarkerName];
					lobj[k] = fetchTargetRef(obj, targetPath);
				}else{
					process(lobj[k]);
				}
			}
		}
	};
	process(obj);
	return obj;
};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname, module) {/* eslint no-console: 0, no-redeclare: 0 */
var file_exists = function(f){ try{ __webpack_require__(42).lstatSync(f); return true; }catch(e){ return false; }};
var file_get_contents = function(f,mode){return (!file_exists(f))? '' : __webpack_require__(42).readFileSync(f, mode); };
var get_constr = function(v){ return(v===null)?"[object Null]":Object.prototype.toString.call(v); };
var fnprefix  = 'TYPE_FUNC_'+(new Date().getTime());
var stringify = __webpack_require__(44);
var jsencr = function(o){ var e = []; return stringify(o, function(k,v){
	if(typeof(v)==='function') return fnprefix+v.toString();
	if(typeof(v)!=='object' || v===null)	return v;
	for(var i in e){ if(e[i]===v){ return "Circular"; }}
	e.push(v); return v;
}); };


var dbg = {

	// AVOIDS RUNNING TWICE
	isStarted: false,

	// SSE CONNECTIONS
	cons: [],

	// MIMES HANDLING
	mimes: {
		'html': 'text/html',
		'htm' : 'text/html',
		'txt' : 'text/plain',
		'js' : 'text/javascript',
		'ico' : 'image/vnd.microsoft.icon',
		'css' : 'text/css',
		'eot': 'application/vnd.bw-fontobject',
		'ttf': 'application/x-font-ttf',
		'woff':'font/opentype'
	},

	// SEND EVENT
	queued: [],
	pendingBroadcast: 0,
	broadcastLag: 500,
	broadcastSSE: function(t, a){
		clearTimeout(dbg.pendingBroadcast);

		var data = { t:t, a:a };
		dbg.queued.push(data);

		var sendFn = function(){
			if(!dbg.cons.length) return dbg.pendingBroadcast = setTimeout(function(){ sendFn(); },dbg.broadcastLag);

			var data = jsencr(dbg.queued);
			dbg.queued = [];
			for(var i=0; i < dbg.cons.length; i++){
				dbg.cons[i].writeHead(200,{
					'Content-type':dbg.mimes['txt'],
					'Content-length' : data.length,
					'Cache-control':'no-cache'
				});

				dbg.cons[i].write(data);
				dbg.cons[i].end("\r\n");
				dbg.cons[i] = null;
				dbg.cons.splice(i,1);
				i--;
			}
		};

		dbg.pendingBroadcast = setTimeout(function(){ sendFn(); },dbg.broadcastLag);
	},

	// ERROR HANDLERS
	serve500: function(s, err){try{
		console.warn(err);

		var ISE = 'Internal server error\r\n'+err+'\r\n';
		s.writeHead(404, {'Content-type':'text/plain', 'Content-length':ISE.length});
		s.end(ISE);

	}catch(e){ console.warn(e); }},

	serve404: function(s){try{
		var NF = 'Not found\r\n';
		s.writeHead(404, {'Content-type':'text/plain', 'Content-length':NF.length});
		s.end(NF);

	}catch(e){ dbg.serve500(s,e); }},

	// GET LOCAL FILENAME
	getlocalfn: function(path){
		var p = __webpack_require__(46).normalize(__dirname + "/../client/" + path);
		return p;
	},

	// STATIC RESOURCES
	servestatic: function(q,s){ try{
		var path = __webpack_require__(35).parse(q.url).pathname;
		if(path.charAt(0)==='/') path = path.substr(1);
		path = path.replace(/[\.]+(\/|\\)/gmi, '');

		switch(path){
			case "":
			case " ":
			case "index.html" :
			case "index.htm" :
				var fn = dbg.getlocalfn('./index.html');
				var c = file_get_contents(fn,'utf-8');

				s.writeHead(200, {'Content-type': dbg.mimes['html'], 'Content-length': c.length});
				s.end(c);
				break;

			case 'images/favicon.ico':
				var icon = file_get_contents(dbg.getlocalfn('./images/favicon.ico'));
				s.writeHead(200, {'Content-type': dbg.mimes['ico'], 'Content-length': icon.length});
				s.end(icon);
				break;

			case 'sse':
				q.socket.setTimeout(0);
				dbg.cons.push(s);
				break;

			default:
				var fn = dbg.getlocalfn('./'+path);
				if (!file_exists(fn)) {
					return dbg.serve404(s);
				}

				var c = file_get_contents(fn);
				var hdrs = {'Content-length': c.length};
				var ext = fn.split('.').pop();

				if(typeof(dbg.mimes[ext])==='string') hdrs['Content-type'] = dbg.mimes[ext];

				s.writeHead(200, hdrs);
				s.end(c);
				break;
		}

	}catch(e){ dbg.serve500(s,e); }},

	// EXECUTE COMMANDS
	execute: function(q,s){
		var post = '';
		q.on('data', function(c){ post+=c; });
		q.on('end', function(){
			post = __webpack_require__(47).parse(post);
			if(typeof(post.command)==='string'){
				var r = {error:false};

				try{
					r.fnprefix = fnprefix;
					r.cnt = eval.apply(global, [post.command]);
					r.type = (typeof(r.cnt)==='object' && r.cnt!==null) ?
						get_constr(r.cnt) :
						typeof(r.cnt);
				}catch(e){ r.error=e.toString(); }

				s.end(jsencr(r));
			} else if(typeof(post.getsug)==='string'){

				try{ var r = jsencr(dbg.getsug(JSON.parse(post.getsug)));	}
				catch(e){ var r = "[]"; }

				s.writeHead(200, {'Content-type': dbg.mimes['txt'], 'Content-length': r.length});
				s.end(r);
			}else{
				return dbg.serve500(s,'Command was not found');
			}
		});
	},

	// STD. REQUEST HANDLER LOGIC
	handle: function(q,s){
		if(typeof(q.method)!=='string' || (q.method!=='GET' && q.method!=='POST'))
			return dbg.serve404(s);

		return  (q.method==='GET') ? dbg.servestatic(q,s) :  dbg.execute(q,s);
	},

	// GET SUGGESTIONS
	getsug: function(o){
		var r = [];
		if(typeof(o)!=='object' || !o.length || o.length!=2) return r;
		if(typeof(o[0])!=='string' || o[0]===''){
			/* if(typeof(module)=='object') for(var i in module){
				if(o[1]===''){ r.push(i); continue; };
				if(i.split(o[1])[0]==='') r.push(i);
			}; */

			for(var i in global){
				if(o[1]===''){ r.push(i); continue; }
				if(i.split(o[1])[0]==='') r.push(i);
			}
		}else{try{
			var tgt = eval(o[0]); if(typeof(tgt)!=='object') return r;
			for(var i in tgt){
				if(o[1]===''){ r.push(i); continue; }
				if(i.split(o[1])[0]==='') r.push(i);
			}
		}catch(e){ return r; }}
		return r;
	},

	// WRAP CONSOLE.* API
	consolewrap: function(){
		console.__log = console.log;
		console.log = function(){ console.__log.apply(console, arguments); dbg.broadcastSSE('log', arguments);};

		console.__info = console.info;
		console.info = function(){ console.__info.apply(console, arguments); dbg.broadcastSSE('info', arguments);};

		console.__warn = console.warn;
		console.warn = function(){ console.__warn.apply(console, arguments); dbg.broadcastSSE('warn', arguments);};

		console.__error = console.error;
		console.error = function(){ console.__error.apply(console, arguments); dbg.broadcastSSE('error', arguments);};

		process.on('uncaughtException', function (e) {console.error.call(console, e + ""); });
		global.nodecodein = module;
	},

	// LOCAL DEBUGGER SERVER
	start: function(port, host, cb){

		cb = typeof(cb)==='function' ? cb : function(){};
		if(dbg.isStarted) return cb.call(null,false);

		var http = __webpack_require__(45);
		dbg.sv = http.createServer(dbg.handle);

		dbg.sv.listen(port||55281, host||null,function(){
			var add=dbg.sv.address();
			console.log('Debugger server started at: http://' + add.address + ':' + add.port);
			cb.call(null,dbg);
		});

		dbg.sv.on('error', function(e){
			console.warn('Failed to start debugger server. Error: '+e);
		});

		dbg.consolewrap();

		// free the port, on all ways of exiting the app
		var events = ['exit','uncaughtException','SIGTERM','SIGKILL'];
		for (var i in events){
			process.on(i, function(){ dbg.stopproc(); });
		}
	},
	stopproc: function(){

		console.log('Closing debug server');
		try{
			dbg.sv.close();
		} catch(e) {
			//
		}
	}
};

dbg.start();

setTimeout(function(){
	console.log('aaaa');
}, 1000);

/* WEBPACK VAR INJECTION */}.call(exports, "node_modules\\node-codein\\src\\server", __webpack_require__(2)(module)))

/***/ }),
/* 44 */
/***/ (function(module, exports) {

//
// Public domain
// This whole code come from Douglas Crockford's JSON2 library except some
// minor change on the first line of the str() function (see next comment)
//
//
(function() {
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;
    
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    
    function str(key, holder) {
        var i,
            k,
            v,
            length,
            mind = gap,
            partial,
            value;
        
        //
        // Changes from Douglas Crockford's version, the five next code lines
        // avoid errors when accessing a value through a getter that raise an
        // ulgy error
        // previously : value = holder[key];
        //
        
        try {
            value = holder[key];
        } catch (Error) {
            value = "accessor error";
        }
    
        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
    
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
    
        switch (typeof value) {
        case 'string':
            return quote(value);
    
        case 'number':
            return isFinite(value) ? String(value) : 'null';
    
        case 'boolean':
        case 'null':
            return String(value);
    
    
        case 'object':
            if (!value) {
                return 'null';
            }
    
    
            gap += indent;
            partial = [];
    
    
            if (Object.prototype.toString.apply(value) === '[object Array]') {
    
    
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
    
                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
    
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
    
            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    };
    
    stringify = function stringify(value, replacer, space) {
        var i;
        gap = '';
        indent = '';
    
        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (typeof space === 'string') {
            indent = space;
        }
    
        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }
    
        return str('', {'': value});
    };
    
    module.exports = stringify;
})();


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _user_model = __webpack_require__(49);

var _mockData = __webpack_require__(30);

var _mockData2 = _interopRequireDefault(_mockData);

var _rxjs = __webpack_require__(50);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passport = __webpack_require__(11);
var O = _rxjs.Observable;
var jsonParser = __webpack_require__(3).json();
var express = __webpack_require__(6);
var eJwt = __webpack_require__(16);
var jwt = __webpack_require__(8);

var router = express.Router();

router.get('/init_profile', passport.authenticate('facebook', {
    failureRedirect: '/user/failed_auth'
}), function (req, res) {
    _user_model.User.findOne({
        fbId: req.user.id
    }).exec().then(function (user) {
        console.log('this is first', user);
        if (!user) {
            _user_model.User.create({
                user: req.user.name.givenName + ' ' + req.user.name.familyName,
                friends: [],
                profileImage: req.user.photos[0].value,
                fbId: req.user.id
            }).then().catch(function (err) {
                console.log(err);
                res.status(500).json({ err: err });
            });
        }
    }).catch(function (err) {
        console.log('1111111111111111111111111111111111111');
        console.log(err);
    });
    res.redirect('/init_token');
});

router.get('/failed_auth', function (req, res) {
    res.json({ failed: 'failed' });
});

router.get('/profile', function (req, res) {
    var userId = jwt.verify(req.headers.token, 'super stank').user;
    console.log(userId);
    _user_model.User.find(userId).exec().then(function (profile) {
        console.log('this is what come back', profile);
        res.status(201).json(profile[0].apiRepr());
    }).catch(function (err) {
        console.log(err);
        res.send(501, { err: err });
    });
});

module.exports = { router: router };

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(9);

var UserSchema = mongoose.Schema({
    user: { type: String, required: true },
    friends: { type: Array },
    profileImage: { type: String },
    fbId: { type: String, rqeuired: true }
});

UserSchema.methods.apiRepr = function apiRepr() {
    return {
        id: this.fbId,
        user: this.user,
        profileImage: this.profileImage
    };
};

var User = mongoose.model('user_data', UserSchema);

module.exports = { User: User };

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ })
/******/ ]);