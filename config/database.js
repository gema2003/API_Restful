const Mongoose = require('mongoose');
const dbhost = process.env.DBHOST || 'localhost';
const dbport = process.env.DBPORT || '27017';
const dbname = process.env.DBNAME || 'CeiiFeed';

const uri = process.env.DBURI || `mongodb://${dbhost}:${dbport}/${dbname}`;

const connect = async ()=>{
	try{
		await Mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		console.log('DB connection successfully')
	}catch (error){
		console.log('Erro in BD connection');
		process.exit(1);
	}
};

module.exports = {
	connect
};