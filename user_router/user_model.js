const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    user: { type: String, required: true },
    friends: { type: Array },
    profileImage: { type: String },
    fbId: { type: String, rqeuired: true },
});

UserSchema.methods.apiRepr = function apiRepr() {
    return {
        id: this.fbId,
        user: this.user,
        profileImage: this.profileImage,
    };
};

const User = mongoose.model('user_data', UserSchema);

module.exports = { User };
