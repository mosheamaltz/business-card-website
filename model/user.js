const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    cards: [{type: mongoose.Schema.Types.ObjectId, ref: "Card"}]
});

const User = mongoose.model('user', userSchema);

module.exports = User;