const path = require('path')
const express = require('express')
const checkTokenMiddleware = require('./jsonwebtoken/check')
const cors = require('cors')
const { sequelize } = require('sequelize')
const db = require('./db.config.js')
const User = db.User 
const Score = db.Score
const app = express()

require('dotenv').config();


const hostname = '127.0.0.1';
const port = 3000;

// on enregistre les différentes routes
const user_router = require('./routes/users')
const score_router = require('./routes/scores')
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
  
  /*** Start serveur avec test DB */
  db.sequelize.authenticate()
    .then(() => console.log('Database connection OK'));

    addTestUser()
    .then(() => {
      addTestScore();
      app.listen(process.env.PORT || 3000, () => {
        console.log(`This server is running on port ${process.env.SERVER_PORT}. Have fun !`)
        console.log(`Server running at http://${hostname}:${port}/`);

      })
    })
    .catch(err => console.log('Database Error', err))


    async function addTestUser() {
        try {
            const user = await User.findOneByUsername('test');
          if (!user) {
            const newUser = new User({ username: 'test', password: 'password' });
            await newUser.save();
            console.log('Test user created successfully');
          }
        } catch (err) {
          console.log(`Error creating test user: ${err.message}`);
        }
      }
      async function addTestScore() {
        try {
            const score = await Score.findOneById(1000);
          if (!score) {
            const newScore = new Score({name: 'scoretest', userId: 7, json: 'test', id: 1000});
            await newScore.save();
            console.log('Test score created successfully');
          }
        } catch (err) {
          console.log(`Error creating test score: ${err.message}`);
        }
      }