const jwt = require('jsonwebtoken');
const { Check } = require('../services/modules/check');
const { registerUser, loginUser } = require('../services/modules/user');

const createToken = (user) => {
    return jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};
const filterUserFields = (user) => {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
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
    getLatestChecks: async(req, res) => {
        try {
            const userId = req.user._id;
            const checks = await Check.find({ userId: userId })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();

            const summaries = checks.map(check => ({
                url: check.url,
                createdAt: check.createdAt,
                score: check.checkData.score,
                title: check.checkData.title,
                description: check.checkData.description,
                keywords: check.checkData.keywords
            }));

            res.json(summaries);
        } catch (error) {
            console.error("Error getting latest checks:", error);
            res.status(500).json({ message: 'Error getting latest checks', error });
        }
    },

};