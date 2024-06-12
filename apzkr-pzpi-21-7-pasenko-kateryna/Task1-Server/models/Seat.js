const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    seatType: {
        type: String,
        enum: ['funzone', 'vip'],
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
