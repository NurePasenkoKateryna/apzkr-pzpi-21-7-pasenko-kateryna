const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    cardholderName: {
        type: String,
        required: true
    }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
