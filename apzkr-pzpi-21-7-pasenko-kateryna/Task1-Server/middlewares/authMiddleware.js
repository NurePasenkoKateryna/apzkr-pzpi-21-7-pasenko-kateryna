const bcrypt = require('bcrypt');
const User = require('../models/User');

async function authenticateUser(email, password) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) return { success: false, message: "Користувач з такою електронною поштою не знайдений." };

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return { success: false, message: "Невірний пароль." };

        return { success: true, user: user };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

module.exports = {
    authenticateUser: authenticateUser
};

