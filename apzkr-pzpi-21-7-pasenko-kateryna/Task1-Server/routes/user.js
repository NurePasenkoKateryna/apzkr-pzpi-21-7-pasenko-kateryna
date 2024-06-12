const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:userId', getUser, (req, res) => {
    res.json(res.user);
});

router.get('/role/member', async (req, res) => {
    try {
        const members = await User.find({ role: 'member' });
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:userId', getUser, async (req, res) => {
    if (req.body.firstName != null) {
        res.user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.user.lastName = req.body.lastName;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.phone != null) {
        res.user.phone = req.body.phone;
    }
    if (req.body.password != null) {
        res.user.password = bcrypt.hashSync(req.body.password, 8); // Хешування пароля
    }
    if (req.body.role != null) {
        res.user.role = req.body.role;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:userId', getUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        res.json({ message: 'Користувач був видалений' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.userId);
        if (user == null) {
            return res.status(404).json({ message: 'Користувач не знайдений' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;
