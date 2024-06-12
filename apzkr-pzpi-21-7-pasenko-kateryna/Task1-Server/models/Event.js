const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    band: {
        type: Schema.Types.ObjectId,
        ref: 'Band',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    seats: [{
        type: Schema.Types.ObjectId,
        ref: 'Seat'
    }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
