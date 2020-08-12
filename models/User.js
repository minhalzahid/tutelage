const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const User = mongoose.model('users', new mongoose.Schema({
	name: {
		firstName: { type: String, minlength: 2, maxlength: 50, required: true },
		lastName: { type: String, minlength: 2, maxlength: 50, required: true },
	},

	age: {
		type: Number,
		max: 100,
		min: 17,
		required: true
	},

	emailAddress: {
		type: String,
		required: false,
	},

	country: {
		type: String,
		required: true
	},

	nationality: {
		type: String,
		required: true
	},

	phone: {
		type: String,
		maxlength: 11,
		minlength: 11,
		required: true
	},

	gender: {
		type: Number,
		min: 0,
		max: 2,
		required: true
	},

	userType: {
		type: Number,
		min: 0,
		max: 1,
		required: true
	},

	lectures: [{
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}],

	notifications: [{
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}],

	flag: {
        type: Boolean,
        required: false,
        default: true
    }
}));

function validateUser(user) {
	const schema = {
		firstName: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().min(2).max(50).required(),
		age: Joi.number().required(),
		phone: Joi.number().required(),
		emailAddress: Joi.string().regex(/^(([^<>()\[\]\\.,;:\s@“]+(\.[^<>()\[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
		country: Joi.string().required(),
		nationality: Joi.string().required(),
		gender: Joi.number().required(),
		userType: Joi.number().required(),
		lectures: Joi.array(),
		notifications: Joi.array(),
		password: Joi.string().required(),
		username: Joi.string().required(),
		_id: Joi.objectId()
	};

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
