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

var blacklist = { // this object is to keep the inital temporary tokens
    tokens: [0], // blacklisted, since they are sent in the url
    getRevokedToken: function getRevokedToken(tokenId, cb) {
        var _this = this;

        // the newToken below, is sent in a more secure way 
        this.tokens.forEach(function (curToken) {
            // and so is not limited to the session
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

var _require = __webpack_require__(0),
    PORT = _require.PORT,
    DATABASE_URL = _require.DATABASE_URL;

app.use(express.static(process.env.PWD + '/build'));

passport.use(new Strategy({
    clientID: '266134167169182',
    clientSecret: '636f0c825d31af79085033dc03a58a43',
    callbackURL: 'http://localhost:8081/login/facebook/return'
}, function (accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    profile.token = jwt.sign(profile, 'funky smell', {
        expiresIn: 10080,
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

var isAuthenticated = function isAuthenticated(req, res, next) {
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
    var newToken = jwt.sign({ foo: 'bar' }, 'super stank', { expiresIn: '7 days' });
    res.json({ newToken: newToken });
});

app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/init_token', function (req, res) {
    res.redirect('/auth/' + req.user.token);
});

app.get('/failed_auth', function (req, res) {
    res.json({ failed: 'failed' });
});

app.get('/verify_auth', eJwt({ secret: 'super stank',
    getToken: function fromQuery(req) {
        return req.headers.token;
    }
}), function (req, res) {
    res.sendStatus(201);
});

app.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/failed_auth' }), function (req, res) {
    res.redirect('/init_token');
});

app.get('*',
// eJwt({ secret: 'super stank' }),
function (request, response) {
    console.log('line 103');
    response.sendFile(process.env.PWD + '/build/index.html');
});

// TODO: implment express-jwt to protect all endpoints

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

/***/ })
/******/ ]);