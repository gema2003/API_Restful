const { verifyToken } = require('./../utils/JWTUtil');
const { verifyId } = require('./../utils/MongoUtils');
const UserService = require('../services/User');
const middleware = {};

middleware.verifyAuth = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(403).json({
			error: 'Authorization is required'
		});
	}
	const [prefix, token] = authorization.split(' ');
	if (prefix !== 'Bearer') {
		return res.status(400).json({
			error: 'Incorrect Prefix'
		});
	}
	const tokenObject = verifyToken(token);
	if (!tokenObject) {
		return res.status(401).json({
			error: 'Invalid Token!!!'
		});
	}
	const userId = tokenObject._id;
	if (!verifyId(userId)) {
		return res.status(400).json({
			error: 'Error in Id!!!'
		});
	}
	const userExists = await UserService.findOneById(userId);
	if (!userExists.success) {
		return res.status(404).json(userExists.content);
	}
	const user = userExists.content;
	const indexOfToken = user.validToken.findIndex((userToken) => userToken === token);
	if (indexOfToken < 0) {
		return res.status(403).json({
			error: 'Unregistered Token!!!'
		});
	}
	req.user = user
	next();
};	

module.exports = middleware;