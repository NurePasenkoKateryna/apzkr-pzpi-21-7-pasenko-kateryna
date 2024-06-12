const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');
const Band = require("../models/Band");
const mongoose = require("mongoose");

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/create', async (req, res) => {
    const genre = new Genre({
        name: req.body.name,
        description: req.body.description
    });
    try {
        const newGenre = await genre.save();
        res.status(201).json(newGenre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

    console.log(req.body);

});

router.get('/:genreId', getGenre, (req, res) => {
    res.json(res.genre);
});

router.patch('/:genreId', getGenre, async (req, res) => {
    if (req.body.name != null) {
        res.genre.name = req.body.name;
    }
    if (req.body.description != null) {
        res.genre.description = req.body.description;
    }
    try {
        const updatedGenre = await res.genre.save();
        res.json(updatedGenre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:genreId', getGenre, async (req, res) => {
    try {
        await res.genre.deleteOne(); // або findByIdAndRemove()
        res.json({ message: 'Жанр був видалений' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:bandId', async (req, res) => {
    try {
        const bandId = req.params.bandId;

        if (!mongoose.Types.ObjectId.isValid(bandId)) {
            return res.status(400).json({ message: 'Неправильний ідентифікатор гурту' });
        }

        const band = await Band.findById(bandId).populate('genre').exec();

        if (!band) {
            return res.status(404).json({ message: 'Гурт не знайдено' });
        }

        console.log('Band found:', band);

        if (!band.genre) {
            return res.status(404).json({ message: 'Жанр не знайдено' });
        }

        res.json({ genre: band.genre.name });
    } catch (err) {
        console.error('Error fetching band or genre:', err);
        res.status(500).json({ message: err.message });
    }
});

async function getGenre(req, res, next) {
    let genre;
    try {
        genre = await Genre.findById(req.params.genreId);
        if (genre == null) {
            return res.status(404).json({ message: 'Жанр не знайдено' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.genre = genre;
    next();
}

module.exports = router;
