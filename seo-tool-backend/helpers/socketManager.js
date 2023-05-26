let userSockets = new Map();

module.exports = {
    getUserSocket: function(userId) {
        return userSockets.get(userId);
    },
    setUserSocket: function(userId, socket) {
        userSockets.set(userId, socket);
    },
    deleteUserSocket: function(userId) {
        userSockets.delete(userId);
    }
};