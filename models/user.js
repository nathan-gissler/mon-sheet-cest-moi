const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  }
}, { paranoid: true });

User.associate = function(models) {
  // associations can be defined here
};

User.beforeCreate(async (user, options) => {
  let hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND))
  user.password = hash
})

User.checkPassword = async (password, originel) => {
  return await bcrypt.compare(password, originel)
}

User.findOneByUsername = function (username, callback) {
  this.findOne({ where: { username: username } }, callback);
}

return User;
}






