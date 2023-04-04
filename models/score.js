/************************************/
/*** Import des modules nécessaires */
const { DataTypes } = require('sequelize')

/*******************************/
/*** Définition du modèle Score */
module.exports = (sequelize) => {
    const Score = sequelize.define('Score', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          json: {
            type: DataTypes.TEXT,
            allowNull: false
          },
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
          },
          sharedwithId: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
            },
          updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
}
    }, { paranoid: true });           // Ici pour faire du softDelete
    
    Score.associate = function(models) {
      // associations can be defined here
    };
    
    Score.findOneById = function (id, callback) {
    this.findOne({ where: { id: id } }, callback);
}
return Score;
  }