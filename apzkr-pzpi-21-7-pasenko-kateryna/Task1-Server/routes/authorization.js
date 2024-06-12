const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRegistrationFields = require('../middlewares/validationMiddleware');


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const authResult = await authMiddleware.authenticateUser(email, password);

        if (!authResult.success) {
            return res.status(401).send({ auth: false, token: null, message: authResult.message });
        }

        const { user } = authResult;

        const roleName = user.role;

        console.log(roleName);

        const token = jwt.sign({ id: user._id, role: roleName }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        console.log(token);

        res.status(200).send({ auth: true, token: token });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


router.post('/registration', validateRegistrationFields, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body;

        if (!['user', 'admin', 'member'].includes(role)) {
            return res.status(400).send({ message: 'Невірна роль' });
        }

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: bcrypt.hashSync(password, 8),
            role
        });

        const newUser = await user.save();

        const roleName = newUser.role;

        console.log(roleName)

        const token = jwt.sign({ id: newUser._id, role: roleName }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


module.exports = router;
