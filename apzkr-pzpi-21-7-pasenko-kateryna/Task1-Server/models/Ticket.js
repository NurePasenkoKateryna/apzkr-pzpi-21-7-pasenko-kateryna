const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    seat: {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true
    },
    purchaseDate: {
        type: String,
        default: () => new Date().toISOString()
    },
    qrCode: {
        type: String
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
