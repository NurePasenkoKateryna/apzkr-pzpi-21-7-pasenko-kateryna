const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const User = require("../models/User");
const Ticket = require("../models/Ticket");

router.post('/:eventId/create', async (req, res) => {
    try {
        const eventId = req.params.eventId;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Неправильний ідентифікатор події' });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Подія не знайдена' });
        }

        const seatsData = req.body.seats;

        if (!seatsData || !Array.isArray(seatsData) || seatsData.length === 0) {
            return res.status(400).json({ message: 'Необхідно надати масив даних про місця' });
        }

        const existingSeats = await Seat.find({ event: eventId, seatType: { $in: seatsData.map(seat => seat.seatType) } });
        if (existingSeats.length > 0) {
            return res.status(400).json({ message: 'Місце з цим типом вже існує для даної події' });
        }

        const createdSeats = await Seat.create(seatsData.map(seat => ({
            event: eventId,
            seatType: seat.seatType,
            price: seat.price
        })));

        event.seats.push(...createdSeats.map(seat => seat._id));
        await event.save();

        res.status(201).json(createdSeats);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:seatId', async (req, res) => {
    try {
        const seatId = req.params.seatId;
        const updates = req.body;

        const seat = await Seat.findById(seatId);

        if (!seat) {
            return res.status(404).json({ message: 'Місце не знайдено' });
        }

        if (updates.seatType != null) {
            seat.seatType = updates.seatType;
        }
        if (updates.price != null) {
            seat.price = updates.price;
        }

        await seat.save();
        res.json(seat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:seatId', getSeat, async (req, res) => {
    try {
        const seat = res.seat;
        const eventId = seat.event;
        const event = await Event.findById(eventId);

        if (event) {
            event.seats = event.seats.filter(seatId => seatId.toString() !== seat._id.toString());
            await event.save();
        }

        await Seat.deleteOne({ _id: seat._id });
        res.json({ message: 'Місце було видалено' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Неправильний ідентифікатор події' });
        }

        const seats = await Seat.find({ event: eventId });
        res.json(seats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:eventId/:seatId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const seatId = req.params.seatId;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Неправильний ідентифікатор події' });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Подія не знайдена' });
        }

        const seat = await Seat.findOne({ _id: seatId, event: eventId });

        if (!seat) {
            return res.status(404).json({ message: 'Місце не знайдено' });
        }

        res.json(seat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// router.get('/:userId', async (req, res) => {
//     const userId = req.params.userId;
//
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'Користувача не знайдено' });
//         }
//
//         const tickets = await Ticket.find({ user: userId }).populate('seat').exec();
//
//         const seats = tickets.map(ticket => ticket.seat);
//
//         res.json(seats);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.get('/:ticketId', async (req, res) => {
    const ticketId = req.params.ticketId;

    try {
        const ticket = await Ticket.findById(ticketId).populate('seat').exec();
        if (!ticket) {
            return res.status(404).json({ message: 'Квиток не знайдено' });
        }

        const seatType = ticket.seat.seatType;
        const seatPrice = ticket.seat.price;

        console.log(seatType);
        console.log(seatPrice);

        res.json({ seatType, seatPrice });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getSeat(req, res, next) {
    let seat;
    try {
        seat = await Seat.findById(req.params.seatId);
        if (seat == null) {
            return res.status(404).json({ message: 'Місце не знайдено' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.seat = seat;
    next();
}

module.exports = router;
