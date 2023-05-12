const jwt = require('jsonwebtoken');

const { registerUser, loginUser } = require('../models/user');

const createToken = (user) => {
    return jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
};
const filterUserFields = (user) => {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        servicePlan: user.servicePlan,

    };
};
module.exports = {
    registerUser: async(req, res) => {
        try {
            const userData = req.body;


            const user = await registerUser(userData);
            const token = createToken(user);
            res.json({...filterUserFields(user), token });
        } catch (error) {

            res.status(500).json({ message: error.message });
        }
    },

    loginUser: async(req, res) => {
        try {
            const { email, password } = req.body;
            const user = await loginUser(email, password);
            const token = createToken(user);
            res.json({...filterUserFields(user), token });
        } catch (error) {

            res.status(500).json({ message: 'Error logging in user', error });
        }
    },
};