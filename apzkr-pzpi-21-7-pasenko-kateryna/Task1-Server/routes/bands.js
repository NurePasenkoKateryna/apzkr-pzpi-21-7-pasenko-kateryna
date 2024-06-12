const express = require('express');
const router = express.Router();
const Band = require('../models/Band');
const Genre = require('../models/Genre');
const ConcertOrganizer = require('../models/ConcertOrganizator');
const Event = require('../models/Event');
const User = require('../models/User');
const Role = require("../models/Role");

async function getBand(req, res, next) {
    let band;
    try {
        band = await Band.findById(req.params.bandId)
            .populate('genre')
            .populate('concertOrganizer')
            .populate('events')
            .populate('members');
        if (band == null) {
            return res.status(404).json({ message: 'Гурт не знайдений' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.band = band;
    next();
}

router.get('/', async (req, res) => {
    try {
        const bands = await Band.find()
            .populate('genre')
            .populate('concertOrganizer')
            .populate('events')
            .populate('members');
        res.json(bands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:bandId', getBand, (req, res) => {
    res.json(res.band);
});

router.post('/create', async (req, res) => {
    const band = new Band({
        name: req.body.name,
        genre: req.body.genre,
        concertOrganizer: req.body.concertOrganizer,
        formationDate: req.body.formationDate,
        description: req.body.description,
        events: req.body.events,
        members: req.body.members
    });

    try {
        const newBand = await band.save();
        res.status(201).json(newBand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:bandId', getBand, async (req, res) => {
    if (req.body.name != null) {
        res.band.name = req.body.name;
    }
    if (req.body.genre != null) {
        res.band.genre = req.body.genre;
    }
    if (req.body.concertOrganizer != null) {
        res.band.concertOrganizer = req.body.concertOrganizer;
    }
    if (req.body.formationDate != null) {
        res.band.formationDate = req.body.formationDate;
    }
    if (req.body.description != null) {
        res.band.description = req.body.description;
    }
    if (req.body.events != null) {
        res.band.events = req.body.events;
    }
    if (req.body.members != null) {
        res.band.members = req.body.members;
    }

    try {
        const updatedBand = await res.band.save();
        res.json(updatedBand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:bandId/genre', async (req, res) => {
    try {
        const bandId = req.params.bandId;
        const band = await Band.findById(bandId);
        if (!band) {
            return res.status(404).json({ message: 'Гурт не знайдено' });
        }
        res.json({ genre: band.genre });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:bandId', getBand, async (req, res) => {
    try {
        await res.band.deleteOne();
        res.json({ message: 'Гурт був видалений' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.body.userId);
        if (user == null) {
            return res.status(404).json({ message: 'Користувач не знайдено' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}

router.patch('/:id/addMember', async (req, res) => {
    try {
        const band = await Band.findById(req.params.id);
        if (!band) {
            return res.status(404).json({ message: 'Band not found' });
        }
        const { memberId } = req.body;
        if (!memberId) {
            return res.status(400).json({ message: 'Member ID is required' });
        }

        if (band.members.includes(memberId)) {
            return res.status(400).json({ message: 'Member is already in the band' });
        }

        band.members.push(memberId);
        await band.save();

        res.status(200).json(band);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:bandId/removeMember/:userId', async (req, res) => {
    try {
        const band = await Band.findById(req.params.bandId);
        if (!band) return res.status(404).send({ message: 'Гурт не знайдено' });

        const userId = req.params.userId;

        // Перевірка, чи користувач є членом гурту
        const isMember = band.members.includes(userId);
        if (!isMember) {
            return res.status(400).send({ message: 'Цей користувач не є членом гурту' });
        }

        band.members = band.members.filter(memberId => memberId.toString() !== userId);

        await band.save();

        const user = await User.findById(userId);
        if (user) {
            user.bands = user.bands.filter(bandId => bandId.toString() !== req.params.bandId);
            await user.save();
        }

        res.status(200).send({ message: 'Користувача успішно видалено з гурту' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});



module.exports = router;
