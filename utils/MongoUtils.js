const mongoose = require('mongoose');
const tools = {};

tools.verifyId = (_id) => {
	return _id && mongoose.Types.ObjectId.isValid(_id);
};

module.exports = tools;