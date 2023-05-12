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
    servicePlan: {
        type: String,
        default: 'free',
        required: true,
    }
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

UserSchema.methods.updateServicePlan = async function(newPlan) {
    this.servicePlan = newPlan;
    await this.save();
    return this;
};

const User = mongoose.model('User', UserSchema, 'users');

const registerUser = async(userData) => {
    const { username, password, email } = userData;
    const servicePlan = 'free'; // set default plan to 'free'

    // überprüfen ob user schon existiert
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new Error('User with this username or email already exists');
    }

    // neuen user erstellen
    const newUser = await User.create({ username, password, email, servicePlan });

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

const purchasePlan = async(userId, newPlan) => {
    // find user
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // update user's plan
    user.updateServicePlan(newPlan);

    return user;
}

module.exports = {
    User,
    registerUser,
    loginUser,
    purchasePlan,
}