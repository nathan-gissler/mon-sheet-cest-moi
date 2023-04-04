/*** Import des module nécessaires */
const express = require('express')
const score = require('../controllers/score')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */
router.use( (req, res, next) => {
    const event = new Date()
    console.log('Score Time:', event.toString())
    next()
})

/**************************************/
/*** Routage de la ressource Score */

router.get('/', score.getAllScores)

router.get('/:id', score.getScore)

router.post('', score.addScore)

router.patch('/:id', score.updateScore)

router.post('/untrash/:id', score.untrashScore)
    
router.delete('/trash/:id', score.trashScore)

router.delete('/:id', score.deleteScore)

module.exports = router