const express = require('express');
const router = express.Router();
const { validate } = require('../models/User');
const { Codes } = require('../models/Codes');
const { User } = require('../models/User');
const { Auth } = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var nodemailer = require("nodemailer");

/*For Log in*/
router.post('/login', async (req, res, next) => {
	console.log('LOGIn called')
	const { username, password } = req.body;

	const auth = await Auth.findOne({ username });
	if (!auth) {
		console.log('invalid username ')
		return res.status(404).send("Invalid username");
	}
	const validPassword = await bcrypt.compare(password, auth.password);
	if (!validPassword) return res.status(400).send('Invalid password.');

	const user = await User.findById(auth.user_id);
	if (!user) return res.status(404).send("The user data is missing");
	const data = { user, username }

	const token = jwt.sign({ data }, 'jwtPrivateKey');
	return res.header('x-auth-token', token).send(data);
});

router.get('/forgetPassword', async (req, res, next) => {
	res.json("GET : Forget Password");
});

router.post('/forgetPassword', async (req, res, next) => {
	// console.log('Forget Password Called...');
	const email = req.body.email;
	const username = req.body.usr;
	const hash = Math.floor(Math.random() * 90000) + 10000;

	let auth = await Auth.findOne({ username });
	if (auth) {

		var transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "tutelage321@gmail.com",
				pass: "tute123lage"
			}
		});

		var mailOptions = {
			from: "tutelage321@gmail.com",
			to: req.body.email,
			subject: "Verifivation Code",
			text: "HI...!",
			html:
				`<h2>Hi ` + username + `,</h2>
					 <h3>Please use this code `+ hash + ` to Verify.</h3>`
		};

		transport.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email Sent : " + info.response);
			}
		});

		let cod = new Codes({ email: email, code: hash });
		await cod.save();
		res.json({ sent: true })
	}
	else {
		res.json({ sent: false })
	}
});

router.post('/verifyCode', async (req, res, next) => {
	// console.log('Forget Password Called...');
	const email = req.body.email;
	const cod = req.body.code;

	const code = await Codes.findOne({ email: email, code: parseInt(cod) });

	if (!code) return res.json({ error: true })
	if (code) {
		res.json({ code, error: false })
	}
});

router.post('/updatePassword', async (req, res, next) => {
	// console.log('Forget Password Called...');
	const username = req.body.usr;
	const password = req.body.password;

	const salt = await bcrypt.genSalt(10);
	hashedPassword = await bcrypt.hash(password, salt);

	if (!hashedPassword) return res.status(400).send("Could not hash the password");

	const pass = await Auth.findOneAndUpdate({ username: username }, { $set: { password: hashedPassword } }, { new: true, useFindAndModify: false }, (err, doc) => {

		if (err) {
			console.log("Something wrong when updating data!");
			res.json({ pass, error: false })
		}

		if (doc) {
			return res.json({ error: false })
		}
	});

});

router.get('/codes', async (req, res, next) => {
	try {
		const code = await Codes.find();
		if (!code || code.length === 0) return res.status(404).send("No Codes found");
		return res.send(code);
	} catch (e) {
		return res.status(403).send('something went wrong');
	}
});

router.post('/signup', async (req, res, next) => {
	const { error } = validate(req.body);
	if (error) return res.status(403).send(error.details[0]);
	const { firstName, lastName, age, emailAddress, country, nationality, phone, gender, userType, lectures, notifications, username, password } = req.body;
	let hashedPassword;

	try {
		let user = await User.findOne({ phone });
		if (user) return res.status(409).send("This phone number already exists");

		user = await User.findOne({ emailAddress });
		if (user) return res.status(409).send("This email address already exists");


		let auth = await Auth.findOne({ username });
		if (auth) return res.status(409).send("This username already exists");

		const salt = await bcrypt.genSalt(10);
		hashedPassword = await bcrypt.hash(password, salt);

		if (!hashedPassword) return res.status(400).send("Could not hash the password");

		user = new User({ name: { firstName, lastName }, age, emailAddress, country, nationality, phone, gender, userType, lectures, notifications });
		await user.save();

		auth = new Auth({ username, password: hashedPassword, user_id: user._id });
		await auth.save();

		let r = {
			firstName,
			lastName,
			age,
			emailAddress,
			country,
			nationality,
			phone,
			gender,
			userType,
			username: auth.username
		}

		const token = jwt.sign({ r }, 'jwtPrivateKey');
		res.status(200).header('x-auth-token', token).send(r);
	} catch (e) {
		return res.status(400).send("Something went wrong");
	}
});

// router.post('/resetusername', async (req, res, next) => {
// 	const { _id, username } = req.body;

// 	try {
// 		let auth = await Auth.findOne({ username });
// 		if (auth) return res.status(409).send("This name already exists");

// 		auth = await Auth.findByIdAndUpdate(_id, { username }, { new: true });

// 		return res.status(200).send("The username was updated")

// 	} catch (e) {

// 	}
// });

// router.post('/resetpassword', async (req, res, next) => {
// 	const { username, password } = req.body;
// 	let hashedPassword;
// 	console.log(req.body);

// 	try {
// 		let auth = await Auth.findOne({ username });
// 		if (!auth) return res.status(404).send("Invalid username");;

// 		const salt = await bcrypt.genSalt(10);
// 		hashedPassword = await bcrypt.hash(password, salt);
// 		if (!hashedPassword) return res.status(400).send("Could not hash the password");

// 		auth = await Auth.findByIdAndUpdate(auth._id, { password: hashedPassword }, { new: true });
// 		return res.status(200).send("Password successfully updated");
// 	} catch (e) {
// 		return res.status(403).send("Something went wrong");
// 	}

// });



// router.post('/getUsername', async (req, res, next) => {
// 	const { user_id } = req.body;

// 	const auth = await Auth.findOne({ user_id });
// 	if (!auth) return res.status(404).send("Invalid username");

// 	return res.send(auth.username);
// });


module.exports = router; 
