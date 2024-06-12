const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const User = require('../models/User');

router.post('/create', async (req, res) => {
    const { userId, cardNumber, expiryDate, cvv, cardholderName } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const card = new Card({
            user: userId,
            cardNumber,
            expiryDate,
            cvv,
            cardholderName
        });

        await card.save();

        res.status(201).json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const cards = await Card.find({ user: userId });

        res.status(200).json(cards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// router.put('/cards/:cardId', async (req, res) => {
//     const cardId = req.params.cardId;
//     const updates = req.body;
//
//     try {
//         const card = await Card.findByIdAndUpdate(cardId, updates, { new: true });
//
//         if (!card) {
//             return res.status(404).json({ message: 'Картку не знайдено' });
//         }
//
//         res.status(200).json(card);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.delete('/:cardId', async (req, res) => {
    const cardId = req.params.cardId;

    try {
        const card = await Card.findByIdAndDelete(cardId);

        if (!card) {
            return res.status(404).json({ message: 'Картку не знайдено' });
        }

        res.status(200).json({ message: 'Картку видалено' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
