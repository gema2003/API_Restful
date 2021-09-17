const UserService = require('./../../services/User');
const PostService = require('./../../services/Post');
const { verifyId } = require('./../../utils/MongoUtils');
const controller = {};

controller.getUser = (req, res) => {
	const { user } = req;
	if (!user) {
		return res.status(404).json({
			error: 'User no Found'
		});
	}
	return res.status(200).json({...user._doc, validToken: undefined});
}

controller.updateById = async (req, res) => {
	const { user } = req;
	const verifyField = UserService.verifyUpdateFields(req.body);
	if (!verifyField.success) {
		return res.status(400).json(verifyField.content);
	}
	if (!user) {
		return res.status(404).json({
			error: 'User not Found'
		});
	}
	try {
		const userUpdated = await UserService.updateById(user, verifyField.content);
		if (!userUpdated.success) {
			return res.status(409).json(userUpdated.content);
		}
		return res.status(200).json(userUpdated.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Serve Error'
		});
	}
};

controller.savePost = async (req, res) => {
	const { postId } = req.body;
	const { user } = req;
	if (!verifyId(postId)) {
		return res.status(400).json({
			error: 'Error in Id!!!'
		})
	};
	try {
		const postExists = await PostService.findOneById(postId);
		if (!postExists) {
			return res.status(404).json(postExists.content);
		}
		const userUpdated = await UserService.registerSavePost(user, postId);
		if (!userUpdated) {
			return res.status(409).json(userUpdated.content);
		}
		return res.status(200).json(userUpdated.content);
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Serve Error'
		})
	};
};

controller.getProfile = async (req, res) => {
	const { _id } = req.params;
	if (!verifyId(_id)) {
		return res.status(400).json({
			error: 'Error in Id!!!'
		})
	};
	try {
		const userExists = await UserService.findOneById(_id);
		if (!userExists.success) {
			return res.status(404).json(userExists.content);
		}
		const user = userExists.content;
		const posts = await PostService.findAllByUserId(user._id);
		return res.status(200).json({
			...user._doc,
			savePosts: undefined,
			validToken: undefined,
			createdAt: undefined,
			updatedAt: undefined,
			posts: posts.content
		});
	}catch (error) {
		return res.status(500).json({
			error: 'Internal Serve Error'
		})
	};
};

module.exports = controller;