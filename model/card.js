const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    phone: String,
    type: String,
    website: String,
    business_email: String,
    image_filename: String,
    image: Buffer
});

const Card = mongoose.model('card', cardSchema);

module.exports = Card;