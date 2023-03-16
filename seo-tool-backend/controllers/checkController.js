const pageCheckService = require('../services/pageCheckService');

module.exports = {


    postCheckPages: async(req, res) => {
        try {
            const { url } = req.body;
            const userId = req.user._id;
            const results = await pageCheckService.checkPages(url, userId);

            res.json(results);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}