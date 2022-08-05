const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('user', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        name: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true
		},
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        games: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        winrate: {
            allowNull: false,
            type: DataTypes.REAL
        },
        x1: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        x2: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        x3: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        x4: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
	});
};
