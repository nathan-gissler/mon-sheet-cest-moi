/*** Import des module nécessaires */
const express = require('express')
const ScoreCtrl = require('../controllers/score')

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

router.get('', ScoreCtrl.getAllScores)

router.get('/:id', ScoreCtrl.getScore)

router.put('', Score, ScoreCtrl.addScore)

router.patch('/:id', Score, ScoreCtrl.updateScore)

router.post('/untrash/:id', Score, ScoreCtrl.untrashScore)
    
router.delete('/trash/:id', Score, ScoreCtrl.trashScore)

router.delete('/:id', Score, ScoreCtrl.deleteScore)

module.exports = router