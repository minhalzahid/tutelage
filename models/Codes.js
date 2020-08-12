const mongoose = require('mongoose');
// const Joi = require('@hapi/joi');

const Codes = mongoose.model('codes', new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    }
}));

exports.Codes = Codes;