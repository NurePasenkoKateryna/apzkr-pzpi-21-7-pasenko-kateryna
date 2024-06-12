const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const concertOrganizerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    }
});

const ConcertOrganizer = mongoose.model('ConcertOrganizer', concertOrganizerSchema);

module.exports = ConcertOrganizer;
