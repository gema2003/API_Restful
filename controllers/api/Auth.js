const UserService = require('../../services/User');
const { createToken } = require('../../utils/JWTUtil');
const controller = {};

controller.register = async (req, res) => {
	const fildValidation = UserService.verifyRegisterFields(req.body);
	if (!fildValidation.success) {
		return res.status(400).json(fildValidation.content);
	}
	try {
		const { username, email } = req.body;
		const userExists = await UserService.findOneUsernameEmail(username, email);
		if (userExists.success) {
			return res.status(409).json({
				error: 'User Already Exists'
			});
		}
		const userRegistered = await UserService.register(req.body);
		if (!userRegistered.success) {
			return res.status(409).json(userRegistered.content);
		}
		return res.status(201).json(userRegistered.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.login = async (req, res) => {
	const fildValidation = UserService.verifyLoginFields(req.body);
	if (!fildValidation.success) {
		return res.status(400).json(fildValidation.content);
	}
	try {
		const { identifier, password } = req.body;
		const userExists = await UserService.findOneUsernameEmail(identifier, identifier);
		if (!userExists.success) {
			return res.status(404).json(userExists.content);
		}
		const user = userExists.content;
		if (!user.comparePassword(password)) {
			return res.status(401).json({
				error: 'Incorret Password!!!'
			})
		}
		const token = createToken(user._id);
		const tokenRegistered = await UserService.registerToken(user, token);
		if (!tokenRegistered.success) {
			return res.status(409).json(tokenRegistered.content);
		}
		return res.status(200).json({
			token: token
		})
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

module.exports = controller;