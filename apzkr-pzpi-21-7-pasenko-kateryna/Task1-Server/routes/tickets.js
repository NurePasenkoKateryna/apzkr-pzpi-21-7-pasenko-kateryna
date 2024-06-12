const express = require('express');
const axios = require('axios');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Event = require('../models/Event');
const Seat = require('../models/Seat');
const Card = require('../models/Card');
const QRCode = require('qrcode');

router.post('/buy', async (req, res) => {
    const { userId, eventId, seatId, cardId } = req.body;

    try {
        const user = await User.findById(userId);
        const event = await Event.findById(eventId);
        const seat = await Seat.findById(seatId);
        const card = await Card.findById(cardId);

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        if (!event) {
            return res.status(404).json({ message: 'Подію не знайдено' });
        }

        if (!seat) {
            return res.status(404).json({ message: 'Місце не знайдено' });
        }

        if (!card) {
            return res.status(404).json({ message: 'Картку не знайдено' });
        }

        const ticket = new Ticket({
            user: userId,
            event: eventId,
            seat: seatId,
            purchaseDate: new Date().toISOString()
        });

        await ticket.save();

        user.tickets.push(ticket._id);
        await user.save();

        const seatTypeTranslation = {
            funzone: 'Фан-зона',
            vip: 'ВІП-зона'
        };

        const qrData = `${userId}-${eventId}-${seatId}`;

        console.log('QR Data:', qrData);

        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

        console.log('QR Code:', qrCode);

        ticket.qrCode = qrCode;
        await ticket.save();

        res.status(201).json(ticket);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const tickets = await Ticket.find({ user: userId })
            .populate('event')
            .populate('seat')
            .exec();

        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:ticketId/seat', async (req, res) => {
    const ticketId = req.params.ticketId;

    try {
        // Знайти квиток за його ідентифікатором
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Квиток не знайдено' });
        }

        const seatId = ticket.seat;

        const seat = await Seat.findById(seatId);

        if (!seat) {
            return res.status(404).json({ message: 'Місце не знайдено' });
        }

        const seatType = seat.seatType;
        const price = seat.price;

        res.json({ seatType, price });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
