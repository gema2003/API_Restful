const tools = {};

tools.verifyTypeNumber = (...nums) => {
	const auxArray = nums.map(num => isNaN(parseInt(num)));
	return !auxArray.some(el => el === true);
};

module.exports = tools;