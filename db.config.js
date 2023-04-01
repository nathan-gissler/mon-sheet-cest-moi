/*** Import des modules nécessaires */
const { Sequelize } = require('sequelize')

/************************************/
/*** Connexion à la base de données */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

/*** Mise en place des relations */
const db = {}

db.sequelize = sequelize
db.User = require('./models/user')(sequelize)
db.Score = require('./models/score')(sequelize)

db.User.hasMany(db.Score, {foreignKey: 'user_id', onDelete: 'cascade'}) //supprime les partitions d'un utilisateur s'il est supprimé
db.Cocktail.belongsTo(db.User, {foreignKey: 'user_id'})
/*** Synchronisation des modèles */

db.sequelize.sync({alter: true})

module.exports = db