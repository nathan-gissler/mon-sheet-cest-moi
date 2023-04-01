const path = require('path')

const express = require('express')
const checkTokenMiddleware = require('./jsonwebtoken/check')
const cors = require('cors')

const app = express()

//const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = new Sequelize('sqlite::memory:');

/*** Import de la connexion à la DB */
let DB = require('./db.config')

const hostname = '127.0.0.1';
const port = 3000;

// on enregistre les différentes routes
const user_router = require('./routes/users')
const cocktail_router = require('./routes/scores')

const auth_router = require('./routes/auth')

app.post('/testing', async (req, res) => {
    await sequelize.sync({ force: true });
  })

app.use("/static", express.static(path.join(__dirname, '/static')))

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', user_router)
app.use('/scores', score_router)

app.use('/auth', auth_router)

app.get('/', (req, res) => {
    res.redirect(301, '/static/index.html')
})


app.use(function (req, res) {
    console.log("404 : " + req.url);

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');

    res.end("<html><head><title>404</title></head><body>404</body></html>");

})

app.listen(port, hostname);
console.log(`Server running at http://${hostname}:${port}/`);

/*
const User = sequelize.define('User', {
    // Model attributes are defined here
    username: {
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
  }, {
    // Other model options go here
  });

  
const user = new User({
    username: 'nathan',
    password: 'gissler'
  })

const Score = sequelize.define('Score', {
  // Model attributes are defined here
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
}, {
  // Other model options go here
});
*/
/*** Start serveur avec test DB */
DB.sequelize.authenticate()
    .then(() => console.log('Database connection OK'))
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`This server is running on port ${process.env.SERVER_PORT}. Have fun !`)
        })
    })
    .catch(err => console.log('Database Error', err))