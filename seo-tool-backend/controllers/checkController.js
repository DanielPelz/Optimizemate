const { performPageCheck } = require('../services/pageCheckService');
const { Check } = require('../models/check');
const { User } = require('../models/user');
const moment = require('moment');


module.exports = {
    getLatestChecks: async(req, res) => {
        try {
            const userId = req.user._id;
            const checks = await Check.find({ userId: userId })
                .sort({ createdAt: -1 })
                .lean();

            // Keep only the last 3 checks
            const latestChecks = checks;

            // Delete older checks
            /*       const olderChecksIds = checks.map((check) => check._id); */
            /*   await Check.deleteMany({ userId, _id: { $in: olderChecksIds } }); */

            const summaries = latestChecks.map(check => ({
                url: check.url,
                id: check._id,
                createdAt: check.createdAt,
                title: check.title,
                description: check.description,
                screenshot: check.screenshot,
                urlCounter: check.urlCounter,
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

    renewCheck: async(req, res) => {
        try {
            const userId = req.user._id;
            const checkId = req.body.id; // Get the ID from the request body

            // Find the existing check
            const check = await Check.findOne({ userId: userId, _id: checkId });

            if (!check) {
                return res.status(404).json({ message: "Check not found" });
            }

            // Perform the page check again
            const { pageData, urlCounter, homepageData, crawlerLogs } = await performPageCheck(check.url, userId, req.app.get('socket'));

            // Update the check with the new data
            check.pageData = pageData;
            check.urlCounter = urlCounter;
            check.homepageData = homepageData;

            check.title = homepageData.title;
            check.description = homepageData.description;
            check.screenshot = homepageData.screenshot;
            check.logs = crawlerLogs;

            await check.save();



            // Send the updated check data
            res.status(200).json({ message: "Check renewed successfully." });

        } catch (error) {
            console.error("Error renewing check:", error);
            res.status(500).json({ message: "Error renewing check", error });
        }
    },

    createCheck: async(req, res) => {
        try {
            const userId = req.user._id;
            const { url } = req.body;
            // Erstellen von Title und Description

            // User rausfinden für die Pläne
            const user = await User.findById(userId);

            let planLimits = {
                free: { per24Hours: 1, total: 1 },
                standard: { per24Hours: 3, total: 12 },
                premium: { per24Hours: 6, total: Infinity },
            }

            // User PLan rausfinden und die Limits setzen
            const userPlan = user.servicePlan;
            const limits = planLimits[userPlan];

            // Zeitraum für die Checks
            const checksLast24Hours = await Check.countDocuments({
                userId: userId,
                createdAt: { $gte: moment().subtract(24, 'hours').toDate() }
            })

            const totalChecks = await Check.countDocuments({ userId: userId });

            if (checksLast24Hours >= limits.per24Hours || totalChecks >= limits.total) {
                return res.status(400).json({ message: "You have exceeded your plan's limits." });
            }

            // Überprüfen, ob die URL bereits für den Benutzer hinzugefügt wurde
            const existingCheck = await Check.findOne({ url, userId });

            // Wenn die URL bereits für den Benutzer hinzugefügt wurde, wird eine Fehlermeldung zurückgegeben
            if (existingCheck) {
                return res
                    .status(400)
                    .json({ message: "A URL cannot be added more than once for the same user." });
            }

            // Überprüfen, ob die URL bereits einmal für einen anderen Benutzer hinzugefügt wurde
            const { pageData, urlCounter, homepageData, crawlerLogs } = await performPageCheck(url, userId, req.app.get('socket'));

            // Speichere die Check-Daten in der Datenbank
            const createdCheck = new Check({
                pageData: pageData,
                url,
                title: homepageData.title,
                description: homepageData.description,
                userId,
                screenshot: homepageData.screenshot,
                urlCounter: urlCounter,
                homepageData: homepageData,
                logs: crawlerLogs,


            });
            await createdCheck.save();

            const responseObject = {
                id: createdCheck._id,
                url: url,
                title: homepageData.title,
                description: homepageData.description,
                userId: userId,
                screenshot: homepageData.screenshot,
                urlCounter: urlCounter,
                homepageData: homepageData,




            };

            // ausgabe der checkdaten
            res.json(responseObject);

        } catch (error) {
            console.error("Error creating check:", error);
            res.status(500).json({ message: "Error creating check", error });
        }
    },
}