const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../services/modules/user');

const createToken = (user) => {
    return jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

module.exports = {
    registerUser: async(req, res) => {
        try {
            const userData = req.body;
            const result = await registerUser(userData);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
        const result = await registerUser(userData);
        const token = createToken(result);
        res.json({...result, token });
    },

    loginUser: async(req, res) => {
        try {
            const { username, password } = req.body;
            const result = await loginUser(username, password);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error logging in user', error });
        }
        const result = await loginUser(username, password);
        const token = createToken(result);
        res.json({...result, token });
    },

};