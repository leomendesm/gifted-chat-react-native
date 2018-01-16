module.exports = function (sequelize, DataTypes) {
	var Message = sequelize.define('message', {
		text: DataTypes.TEXT,
    user: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    chatId: DataTypes.INTEGER,
	});
	return Message;
}