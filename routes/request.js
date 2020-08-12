const express = require('express');
const router = express.Router();
const { Request, validate } = require('../models/Request');
const { User } = require('../models/User');
const { Lecture } = require('../models/Lecture');

router.get('/', async (req, res, next) => {
	try {
		const request = await Request.find();
		if (!request || request.length === 0) return res.status(404).send("No Requests found");
		return res.send(request);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});

router.get('/:id', async (req, res, next) => {
	const { id } = req.params;

	try {
		let user = await User.findById(id);
		if (!user) return res.status(404).send('no user found');

		let request = await Request.find({ receiver: id })
		let requestList = []
		for (let x = 0; x < request.length; x++) {
			let sender = await User.findById(request[x].sender)
			let lecture = await Lecture.findById(request[x].lecture_id)
			requestList.push({
				...request[x]._doc,
				sender: {
					name: `${sender.name.firstName} ${sender.name.lastName}`,
					_id: sender._id
				},
				lecture: {
					course: lecture.course,
					topic: lecture.topic,
					_id: lecture._id
				}
			})
		}
		return res.status(200).send(requestList)
	}
	catch (e) {
		return res.status(403).send('something went wrong');

	}
});

router.post('/', async (req, res, next) => {
	const { lecture_id, sender, receiver } = req.body;
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0])
	try {
		let request = await Request.find({ sender, receiver, lecture_id });
		// console.log((await request).length)
		if (request.length > 0) return res.status(403).send("You have already requested for this lecture")
		request = new Request({ status: 0, lecture_id, sender, receiver });
		await request.save();
		return res.status(200).send(request);
	} catch (e) {
		return res.status(403).send(e.message);
	}
});

router.put('/updateStatus', async (req, res, next) => {
	const { id, status } = req.body;
	try {
		let _request = await Request.findById(id);
		if (_request && _request.status!== 0) return res.status(409).send("Already entertained")

		let request = await Request.findByIdAndUpdate(id, { status: status })

		return res.status(204).send(request)
	} catch (e) {
		return res.status(403).send(e.message)
	}
})

router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		let request = await Request.findByIdAndDelete(id);
		if (!request) return res.status(404).send('No request found')
		return res.status(200).send(request);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});


module.exports = router; 