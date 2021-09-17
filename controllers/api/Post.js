const PostService = require('../../services/Post');
const UserService = require('../../services/User');
const { verifyId } = require('../../utils/MongoUtils');
const { verifyTypeNumber } = require('../../utils/MisUtil');
const controller = {};

controller.create = async (req, res) => {
	const { body } = req;
	const fieldsValidation =  PostService.verifyCreateFields(body);
	if (!fieldsValidation.success) {
		return res.status(400).json(fieldsValidation.content);
	}
	try {
		const { user } = req;
		const createPost =  await PostService.create(req.body, user._id);
	if (!createPost.success) {
		return res.status(409).json(createPost.content);
		}
	res.status(201).json(createPost.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
	
};

controller.findOneById = async (req, res) => {
	const { _id } = req.params;
	if (!verifyId(_id)) {
		return res.status(400).json({
			error: 'Error in Id'
		});
	}
	try {
		const postExists = await PostService.findOneById(_id);
		if (!postExists) {
			return res.status(400).json(postExists.content);
		}
		return res.status(200).json(postExists.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.findAllByUser = async (req, res) => {
	const { id = req.user._id } = req.query;
	if (!verifyId(id)) {
		return res.status(400).json({
			error: 'Error in Id!!!'
		})
	};
	try {
		const userExists = await UserService.findOneById(id);
		if (!userExists.success)  {
			return res.status(404).json(userExists.content);
		}
		const postByUser = await PostService.findAllByUserId(id);
		return res.status(200).json(postByUser.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		})
	};
};

controller.findAll = async (req, res) => {
	const { page = 0, limit = 10 } = req.query;
	if (!verifyTypeNumber(page, limit)) {
		return res.status(400).json({
			error: 'Mistype in query'
		})
	}
	try {
		const postResponse = await PostService.findAll(parseInt(page), parseInt(limit));
		res.status(200).json(postResponse.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.addLike = async (req, res) => {
	const { _id } = req.body;
	if (!verifyId(_id)) {
		return res.status(400).json({
			error: 'Error in Id'
		});
	}
	try {
		const postExists = await PostService.findOneById(_id);
		if (!postExists.success) {
			return res.status(404).json(postExists.content);
		}
		const likeAdded = await PostService.addLike(postExists.content);
		if (!likeAdded.success) {
			return res.status(409).json(likeAdded.content);
		}
		return res.status(200).json(likeAdded.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.updatePost = async (req, res) => {
	const { _id } = req.body;
	if (!verifyId(_id)) {
		return res.status(400).json({
			error: 'Error in Id'
		})
	};
	const fielVerified = PostService.verifyUpdateFields(req.body);
	if (!fielVerified.success) {
		return res.status(400).json(fielVerified.content);
	}
	try {
		const postExists = await PostService.findOneById(_id);
		if (!postExists.success) {
			return res.status(404).json(postExists.content);
		}
		const { user } = req;
		const userAuthority = PostService.verifyUserAuthority(postExists.content, user);
		if (!userAuthority.success) {
			return res.status(401).json(userAuthority.content);
		}
		const postUpdate = await PostService.updateOneById(postExists.content, fielVerified.content);
		if (!postUpdate.success) {
			return res.status(409).json(postUpdate.content);
		}
		return res.status(200).json(postUpdate.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	};
};

controller.deleteOneById = async (req, res) => {
	const { _id } = req.body;
	if (!verifyId(_id)) {
		return res.status(400).json({
			error: 'Error in Id'
		})
	};
	try {
		const postExists = await PostService.findOneById(_id);
		if (!postExists.success) {
			return res.status(404).json(postExists.content);
		}
		const { user } = req;
		const userAuthority = PostService.verifyUserAuthority(postExists.content, user);
		if (!userAuthority.success) {
			return res.status(401).json(userAuthority.content);
		}
		const deleted = await PostService.deleteOneById(_id);
		if (!deleted.success) {
			return res.status(409).json(deleted.content);
		}
		res.status(200).json(deleted.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

module.exports = controller;