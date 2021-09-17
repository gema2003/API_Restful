const PostModel = require('../models/Post');
const debug = require('debug')('log');
const service = {};

service.verifyCreateFields = ({ title, description, image }) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Fields Fine!!!'
		}
	}
	if (!title) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Title is require!!!'
			}
		}
		return serviceResponse;
	}
	return serviceResponse;
};

service.verifyUpdateFields = ({ title, description, image }) => {
	let serviceResponse = {
		success: true,
		content: {}
	};
	if (!title && !description && !image) {
		serviceResponse = {
			success: false,
			content: {
				error: 'All fields are empty'
			}
		};
		return serviceResponse;
	}
	if (title) serviceResponse.content.title = title; 
	if (image) serviceResponse.content.image = image;
	if (description) serviceResponse.content.description = description;
	return serviceResponse;  
};

service.verifyUserAuthority = (post, user) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'User Authority Verify'
		}
	};
	if (!post.user._id.equals(user._id)) {
		serviceResponse = {
			success: false,
			content: {
				error: 'This Post Dont Belong to You!!!'
			}
		};
	}
	return serviceResponse;
};

service.create = async ({ title, description, image }, userId) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Post Created Successfully!!!'
		}
	}
	try {
		const post = new PostModel({
			title,
			description,
			image,
			user: userId
		});
		const postSaved = await post.save();
		if (!postSaved) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Post not created'
				}
			}
		}
		return serviceResponse
	}catch (error) {
		throw error;
	}
};

service.findOneById = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Post Found'
		}
	};
	try {
		const post = await PostModel.findById(_id).populate('user', 'username _id').exec();
		if (!post) {
			serviceResponse = {
				success:false,
				content: {
					error: 'Post not found'
				}
			};
		}else {
			serviceResponse.content = post;
		}
		return serviceResponse;
	}catch (error) {
		throw error;
	}
};

service.findAllByUserId = async (userId) => {
	let serviceResponse = {
		success: true,
		content: {}
	};
	try {
		const posts = await PostModel.find({user: userId}).populate('user', 'username _id').exec();
		serviceResponse.content = posts;
		return serviceResponse;
	}catch (error) {
		throw error;
	}
};

service.findAll = async (page, limit) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Page Found'
		}
	};
	try {
		const posts = await PostModel.find({}, undefined, {
			skip: page * limit,
			limit: limit,
			sort: [{
				// updatedAt: -1
				createdAt: -1
			}]
		}).populate('user', 'username _id').exec();
		serviceResponse.content = {
			posts,
			count: posts.length,
			page,
			limit
		}
		return serviceResponse;
	}catch (error) {
		throw error;
	}
};

service.addLike = async (post) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Post Like!!!'
		}
	};
	try {
		post.likes += 1;
		const postUpdated = await post.save();
		if (!postUpdated) {
			serviceResponse = {
				success:false,
				content: {
					message: 'Post Not Liked!'
				}
			};
		}
		return serviceResponse;
	}catch (error) {
		throw error;
	}
};

service.updateOneById = async (post, contentToUpdate) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Post Updated!!!'
		}
	};
	try {
		post.history.push({
			title: post.title,
			description: post.description,
			image: post.image,
			modifiedAt: new Date()
		});

		Object.keys(contentToUpdate).forEach((key) => {
			post[key] = contentToUpdate[key];
		});

		const updatePost = await post.save();

		// const updatePost = await PostModel.findByIdAndUpdate(post._id, {
		// 	...contentToUpdate,
		// 	$push: {
		// 		history: {
		// 			title: post.title,
		// 			description: post.description,
		// 			image: post.image,
		// 			modifiedAt: new Date()
		// 		}
		// 	}
		// });
		
		if (!updatePost) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Post not update!'
				}
			}
		};
		return serviceResponse;
	}catch (error) {
		throw error;
	}
}

service.deleteOneById = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Post Deleted!!!'
		}
	};
	try {
		const postDelete = await PostModel.findByIdAndDelete(_id).exec();
		if (!postDelete) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Post Not Deleted!'
				}
			};
		}
		return serviceResponse;
	}catch (error) {
		debug(error);
		throw error;
	}
};

module.exports = service;