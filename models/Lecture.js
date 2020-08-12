const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
Joi.objectId = require('joi-objectid')(Joi);

const lectureSchema = new mongoose.Schema({
    schedule: [
        {
            timing: { type: Date, required: true },
            recursive: { type: Boolean, required: true }
        }
    ],
    course: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    topic: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        minlength: 0,
        required: true
    },
    link: {
        type: String,
        maxlength: 500,
        minlength: 3,
        required: true
    },

    teacher_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},

    flag: {
        type: Boolean,
        required: false,
        default: true
    }
});

lectureSchema.plugin(mongoose_fuzzy_searching, { fields: ['course', 'topic'] });

const Lecture = mongoose.model('lecture', lectureSchema);


function validateLecture(lecture) {
    const schema = {
        course: Joi.string().required(),
        schedule: Joi.array().required(),
        teacher_id: Joi.objectId().required(),
        topic: Joi.string().required(),
        description: Joi.string().required(),
        link: Joi.string().required(),
        _id: Joi.objectId()
    };

    return Joi.validate(lecture, schema);
}

exports.Lecture = Lecture;
exports.validate = validateLecture