const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Genre = require('../models/Genre');
const Band = require('../models/Band');
const Seat = require('../models/Seat');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('genre')
            .populate('band');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:eventId', getEvent, (req, res) => {
    res.json(res.event);
});

router.post('/create', async (req, res) => {
    try {
        const { name, description, genre, location, band, date, seatCount, seats } = req.body;

        const event = new Event({
            name,
            description,
            genre,
            location,
            band,
            date,
            seatCount
        });

        const newEvent = await event.save();

        if (seats && seats.length > 0) {
            const createdSeats = await Seat.insertMany(seats.map(seat => ({ event: newEvent._id, ...seat })));
            newEvent.seats = createdSeats.map(seat => seat._id);
            await newEvent.save();
        }

        const bandObject = await Band.findById(band);
        if (!bandObject) {
            return res.status(404).json({ message: 'Гурт не знайдено' });
        }
        bandObject.events.push(newEvent._id);
        await bandObject.save();

        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:eventId', getEvent, async (req, res) => {
    if (req.body.name != null) {
        res.event.name = req.body.name;
    }
    if (req.body.description != null) {
        res.event.description = req.body.description;
    }
    if (req.body.genre != null) {
        res.event.genre = req.body.genre;
    }
    if (req.body.location != null) {
        res.event.location = req.body.location;
    }
    if (req.body.band != null) {
        res.event.band = req.body.band;
    }
    if (req.body.date != null) {
        res.event.date = req.body.date;
    }
    if (req.body.seatCount != null) {
        res.event.seatCount = req.body.seatCount;
    }
    if (req.body.seats != null) {
        const updatedSeats = await Seat.updateMany(
            { _id: { $in: req.body.seats.map(seat => seat._id) } },
            { $set: req.body.seats },
            { new: true }
        );
        res.event.seats = updatedSeats.map(seat => seat._id);
    }

    try {
        const updatedEvent = await res.event.save();
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Неправильний ідентифікатор події' });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Подія не знайдена' });
        }

        await Seat.deleteMany({ event: eventId });

        const bands = await Band.find({ events: eventId });

        for (const band of bands) {
            band.events = band.events.filter(id => id.toString() !== eventId);
            await band.save();
        }

        await event.deleteOne();

        res.json({ message: 'Подія була видалена' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getEvent(req, res, next) {
    let event;
    try {
        event = await Event.findById(req.params.eventId).populate('genre').populate('band');
        if (event == null) {
            return res.status(404).json({ message: 'Подія не знайдена' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.event = event;
    next();
}

module.exports = router;
