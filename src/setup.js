const { pickRandom, randomDate } = require('./back/helpers');
const sequelize = require('./back/model');

async function reset() {
	console.log('Will rewrite the SQLite example database, adding some dummy data.');

    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    
	await sequelize.sync({ force: true });

	await sequelize.models.user.bulkCreate([
		{ name: 'admin', password: 'admin', games: 0, winrate: 0.0, x1: 0, x2: 0, x3: 0, x4: 0 },
	]);

	console.log('Done!');
    
    sequelize.close()
}

reset();
