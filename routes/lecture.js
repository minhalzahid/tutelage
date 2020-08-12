const express = require('express');
const router = express.Router();
const { Lecture, validate } = require('../models/Lecture');
const { User } = require('../models/User');


router.get('/', async (req, res, next) => {
    try {
        const lecture = await Lecture.find();
        return res.send(lecture);
    } catch (e) {
        return res.status(500).send("Something went wrong");
    }
});

router.get('/search/:query', async (req, res, next) => {
    const { query } = req.params
    try {
        const lecture = await Lecture.fuzzySearch({ query: query });
        return res.send(lecture);
    } catch (e) {
        return res.status(500).send("Something went wrong");
    }
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const lecture = await Lecture.findOne({ _id: id });
        if (!lecture) return res.status(404).send("No lecture found");
        return res.send(lecture);
    } catch (e) {
        return res.status(500).send("Something went wrong");
    }
});

router.get('/myLectures/:user_id', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        let lectures = await Lecture.find({teacher_id: user_id });
        // if (!lectures) return res.status(404).send("No lecture found");
        return res.send(lectures);
    } catch (e) {
        return res.status(400).send("Something went wrong");
    }
});


router.get('/:id/getAllStudents', async (req, res, next) => {
    const { id } = req.params;
    try {
        const student = await User.find({ flag: true, userType: 0, lectures: { "$in": [id] } })
        return res.status(200).send(student);
    } catch (e) {
        return res.status(500).send("Something went wrong");
    }
});

//get teacher
router.get('/:id/getTeacher', async (req, res, next) => {
    const { id } = req.params;
    try {
        const teacher = await User.findById(id)
        return res.status(200).send(teacher);
    } catch (e) {
        return res.status(500).send("Something went wrong");
    }
});


//For enrolling studnets
router.post('/enroll', async (req, res, next) => {
    const { lectureId, userId } = req.body;
    try {
        //find the lecture
        let lecture = await Lecture.findOne({ _id: lectureId, flag: true })
        if (!lecture) return res.status(404).send('Lecture not fonud')

        //find the user
        let user = await User.findOne({ _id: userId, userType: 0, flag: true });
        if (!user) return res.status(404).send("No student found");

        //check if this student is already enrolled
        user = await User.findOne({ _id: userId, userType: 0, lectures: { "$in": [lectureId] }, flag: true })
        if (user) return res.status(409).send("This user is already enrolled");

        //adding the lecture to student
        user = await User.findByIdAndUpdate(userId, { $push: { lectures: lectureId } }, { new: true });
        return res.status(200).send(user);
    } catch (e) {
        return res.status(403).send('something went wrong');
    }
});

//For enrolling teacher
router.post('/enrollTeacher', async (req, res, next) => {
    const { lectureId, userId } = req.body;
    try {
        //find the lecture
        let lecture = await Lecture.findOne({ _id: lectureId, flag: true })
        if (!lecture) return res.status(404).send('Lecture not fonud')

        //find the user
        let user = await User.findOne({ _id: userId, userType: 1, flag: true });
        if (!user) return res.status(404).send("No teacher found");

        //check if this student is already enrolled
        user = await User.findOne({ userType: 1, lectures: { "$in": [lectureId] }, flag: true })
        if (user) return res.status(409).send("This lecture already has a teacher");

        //adding the lecture to student
        user = await User.findByIdAndUpdate(userId, { $push: { lectures: lectureId } }, { new: true });
        return res.status(200).send(user);
    } catch (e) {
        return res.status(403).send('something went wrong');
    }
});

router.post('/', async (req, res, next) => {
    const { schedule, topic, description, link, course, teacher_id } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(403).send(error.details[0]);
    try {
        //find the user
        let user = await User.findOne({ _id: teacher_id, userType: 1, flag: true });
        if (!user) return res.status(404).send("No teacher found");

        let lecture = new Lecture({ schedule, topic, description, link, course, teacher_id });
        await lecture.save();

        return res.status(200).send(lecture);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});


router.put('/', async (req, res, next) => {
    const { id, timing, recursive, topic, description, link } = req.body;
    if (!id || id != 24) return res.status(404).send('404 not found');
    try {
        let lecture = await Lecture.findOneAndUpdate(id, { timing, recursive, topic, description, link });
        if (!lecture) return res.status(403).send('something went wrong');
        return res.status(200).send('lecture updated');
    }
    catch (e) {
        return res.status(403).send('something went wrong');
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        let lecture = await Lecture.findByIdAndDelete(id);
        if (!lecture) return res.status(404).send('No notification found')
        return res.status(200).send(lecture);
    } catch (e) {
        return res.status(403).send('something went wrong');
    }
});


module.exports = router; 