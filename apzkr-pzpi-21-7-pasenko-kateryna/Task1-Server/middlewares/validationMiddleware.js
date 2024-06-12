const validateRegistrationFields = (req, res, next) => {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: 'Заповніть всі поля' });
    }

    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Неправильний формат телефону' });
    }

    const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
    if (req.body.date && !dateRegex.test(req.body.date)) {
        return res.status(400).json({ error: 'Неправильний формат дати' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_])[a-zA-Z\d!@#$%^&*?_]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Неправильний формат паролю' });
    }

    next();
};

module.exports = validateRegistrationFields;