const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

const registerUser = async(userData) => {
    const { username, password, email } = userData;

    // überprüfen ob user schon existiert
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new Error('User with this username or email already exists');
    }

    // neuen user erstellen
    const newUser = await User.create({ username, password, email });

    return newUser;
}

const loginUser = async(email, password) => {
    // user suchen
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    // Return user data
    return user;
}




module.exports = {
    User,
    registerUser,
    loginUser,
}