const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

//to get a user
router.get('/', async (req, res, next) => {
	try {
		const user = await User.find();
		if (!user) return res.status(404).send("No user found");
		return res.status(200).send(user);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});

router.get('/:id/username', async (req, res, next) => {
	const { id } = req.params
	try {
		const user = await User.findById(id);
		if (!user) return res.status(404).send("No user found");

		return res.status(200).send(user.name);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});

module.exports = router; 
