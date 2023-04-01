/************************************/
/*** Import des modules nécessaires */
const { DataTypes } = require('sequelize')

/*******************************/
/*** Définition du modèle Score */
module.exports = (sequelize) => {
    return Score = sequelize.define('Score', {
        name: {
            type: DataTypes.STRING,
            allowNull: false  
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          json: {
            type: DataTypes.STRING,
            allowNull: false
          },
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
          }
    }, { paranoid: true })           // Ici pour faire du softDelete
}