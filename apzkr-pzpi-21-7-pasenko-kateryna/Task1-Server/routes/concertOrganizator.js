const express = require('express');
const router = express.Router();
const ConcertOrganizer = require('../models/ConcertOrganizator');

async function getConcertOrganizer(req, res, next) {
    try {
        const concertOrganizer = await ConcertOrganizer.findById(req.params.id);
        if (concertOrganizer == null) {
            return res.status(404).json({ message: 'Concert organizer not found' });
        }
        res.concertOrganizer = concertOrganizer;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

router.post('/create', async (req, res) => {
    const { name, contactInfo } = req.body;
    const concertOrganizer = new ConcertOrganizer({
        name,
        contactInfo
    });
    try {
        const newConcertOrganizer = await concertOrganizer.save();
        res.status(201).json(newConcertOrganizer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const concertOrganizers = await ConcertOrganizer.find();
        res.json(concertOrganizers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getConcertOrganizer, (req, res) => {
    res.json(res.concertOrganizer);
});

router.patch('/:id', getConcertOrganizer, async (req, res) => {
    if (req.body.name != null) {
        res.concertOrganizer.name = req.body.name;
    }
    if (req.body.contactInfo != null) {
        res.concertOrganizer.contactInfo = req.body.contactInfo;
    }
    try {
        const updatedConcertOrganizer = await res.concertOrganizer.save();
        res.json(updatedConcertOrganizer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getConcertOrganizer, async (req, res) => {
    try {
        await res.concertOrganizer.deleteOne();
        res.json({ message: 'Concert organizer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
