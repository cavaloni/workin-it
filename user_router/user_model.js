const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    user: { type: String, required: true },
    friends: { type: Array },
    profileImage: { type: String },
    fbId: { type: String, rqeuired: true },
});

const User = mongoose.model('user_data', UserSchema);

module.exports = { User };
