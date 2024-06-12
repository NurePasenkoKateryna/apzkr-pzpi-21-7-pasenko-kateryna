const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    concertOrganizer: {
        type: Schema.Types.ObjectId,
        ref: 'ConcertOrganizer',
        required: true
    },
    formationDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Band = mongoose.model('Band', bandSchema);

module.exports = Band;
