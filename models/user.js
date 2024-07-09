const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: {type: String, required: true},
    password: {type: String, required: true},
    membership: {type: String, required: true}
})

module.exports = mongoose.model("User", UserSchema);