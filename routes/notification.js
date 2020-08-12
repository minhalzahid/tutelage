const express = require('express');
const router = express.Router();
const { Notification, validate } = require('../models/Notifications');

router.get('/', async (req, res, next) => {
	try {
		const notification = await Notification.find();
		if (!notification || notification.length === 0) return res.status(404).send("No notifications found");
		return res.send(notification);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});

router.get('/:id', async (req, res, next) => {
	const { id } = req.params;
	if (id.length != 24) return res.status(404).send('404 ... not found');
	try {
		let notification = await Notification.findById(id);
		if (!notification) return res.status(404).send('404 ... not found');
		return res.status(200).send(notification)
	}
	catch (e) {
		return res.status(403).send('something went wrong');

	}
});

router.post('/', async (req, res, next) => {
	const { topic, status, description, link } = req.body;
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0])

	try {
		let notification = new Notification({ topic, status, description, link });
		await notification.save();
		return res.status(200).send(notification);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});

router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		let notification = await Notification.findByIdAndDelete(id);
		if (!notification) return res.status(404).send('No notification found')
		return res.status(200).send(notification);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});


module.exports = router; 