const pageCheckService = require('../services/pageCheckService');

module.exports = {
    getCheck: (req, res) => {
        res.send("Hello World!");
    },

    postCheckPages: async(req, res) => {
        try {
            const { url } = req.body;
            const results = await pageCheckService.checkPages(url);

            res.json(results);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}