const jwt = require('jsonwebtoken');
const { Check, performPageCheck } = require('../services/pageCheckService');
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
                .lean();

            // Keep only the last 3 checks
            const latestChecks = checks.slice(0, 3);

            // Delete older checks
            const olderChecksIds = checks.slice(3).map((check) => check._id);
            await Check.deleteMany({ userId, _id: { $in: olderChecksIds } });

            const summaries = latestChecks.map(check => ({
                url: check.url,
                id: check._id,
                createdAt: check.createdAt,
                score: check.checkData.score,
                title: check.checkData.title,
                description: check.checkData.description,
                keywords: check.checkData.keywords,
                screenshot: check.checkData.screenshot,
            }));

            res.json(summaries);
        } catch (error) {
            console.error("Error getting latest checks:", error);
            res.status(500).json({ message: 'Error getting latest checks', error });
        }
    },
    deleteChecks: async(req, res) => {
        try {
            const userId = req.user._id;
            const idsToDelete = req.body.ids;
            await Check.deleteMany({ userId, _id: { $in: idsToDelete } });
            res.json({ message: "Checks deleted successfully." });
        } catch (error) {
            console.error("Error deleting checks:", error);
            res.status(500).json({ message: "Error deleting checks", error });
        }
    },

    deleteAllChecks: async(req, res) => {
        try {
            const userId = req.user._id;
            await Check.deleteMany({ userId });
            res.json({ message: "All checks deleted successfully." });
        } catch (error) {
            console.error("Error deleting all checks:", error);
            res.status(500).json({ message: "Error deleting all checks", error });
        }
    },
    getCheckDetails: async(req, res) => {
        try {
            const userId = req.user._id;
            const checkId = req.params.id;

            if (!checkId) {
                return res.status(400).json({ message: "Invalid check ID" });
            }

            const check = await Check.findOne({ userId: userId, _id: checkId }).lean();

            if (!check) {
                return res.status(404).json({ message: "Check not found" });
            };
            res.json(check);
        } catch (error) {
            console.error("Error getting check details:", error);
            res.status(500).json({ message: "Error getting check details", error });
        }
    },

    createCheck: async(req, res) => {
        try {
            const userId = req.user._id;
            const { url } = req.body;

            // Überprüfen, ob die URL bereits zwei Mal für den Benutzer hinzugefügt wurde
            const existingChecks = await Check.find({ url, userId });

            // Wenn die URL bereits zwei Mal für den Benutzer hinzugefügt wurde, wird eine Fehlermeldung zurückgegeben
            if (existingChecks.length >= 1) {
                return res.status(400).json({ message: "A URL cannot be added more than two times for the same user." });
            }



            // Überprüfen, ob die URL bereits einmal für einen anderen Benutzer hinzugefügt wurde
            const checkData = await performPageCheck(url, userId);

            const responseObject = {
                id: checkData._id,
                ...checkData,
            };


            // ausgabe der checkdaten
            res.json(responseObject);

        } catch (error) {
            console.error("Error creating check:", error);
            res.status(500).json({ message: "Error creating check", error });
        }
    },

};