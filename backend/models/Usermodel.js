import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'seller', 'buyer', 'guest'],
        default: 'buyer',
    },
    phone: {
        type: String,
    },

    photo: {
        type: String,
        default: 'no-photo.jpg',
    },
    avatar: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    bio: {
        type: String,
        default: '',
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],

    resetToken: { type: String },
    resetTokenExpire: { type: Date },
    hasCompletedQuestionnaire: {
        type: Boolean,
        default: false
    },
    questionnaireAnswers: {
        userType: String,
        propertyTypes: [String],
        budget: String,
        bedrooms: String,
        locationPreferences: String,
        timeframe: String
    }
},
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', UserSchema);

export default User;