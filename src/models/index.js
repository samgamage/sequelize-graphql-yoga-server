import Sequelize from 'sequelize';

const sequelize = new Sequelize('test2_db', 'samgamage', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  operatorsAliases: Sequelize.Op,
  define: {
    underscored: true,
  },
});

const models = {
  User: sequelize.import('./user'),
};

Object.keys(models).forEach((modelName) => {
  if ('associated' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
