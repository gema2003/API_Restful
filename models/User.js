const mongoose = require('mongoose');
const Crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type:String,
		require:true,
		unique:true
	},
	email: {
		type:String,
		require:true,
		unique:true
	},
	hashePassword: {
		type:String,
		default: ''
	},
	name: {
		type:String,
		require:true,
	},
	photo:String,
	// posts: {
	// 	type:[{
	// 		type:mongoose.Schema.Types.ObjectId,
	// 		ref: 'Post'
	// 	}]
	// },
	savePosts: {
		type:[{
			type:mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}]
	},
	validToken: [String]
}, {
	timestamps: true
});

UserSchema
	.virtual('password')
	.set(function (password) {
		this.hashePassword = Crypto.createHmac('sha256', password).digest('hex');
	});

UserSchema.methods = {
	comparePassword: function (password) {
		return (Crypto.createHmac('sha256', password).digest('hex') === this.hashePassword);
	}
};

module.exports = mongoose.model('User', UserSchema);