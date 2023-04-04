/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const user = require('../controllers/user')

    /***************************************/
    /*** Récupération du routeur d'express */
    let router = express.Router()

    /*********************************************/
    /*** Middleware pour logger dates de requete */
    router.use( (req, res, next) => {
        const event = new Date()
        console.log('User Time:', event.toString())
        next()
    })


    /**********************************/
    /*** Routage de la ressource User */

    router.get('/', user.getAllUsers)

    router.get('/:id', user.getUser)

    router.put('', user.addUser)

    router.patch('/:id', user.updateUser)

    router.post('/signup', user.addUser)

    router.post('/login', user.getUser)

    router.delete('/trash/:id', user.trashUser)
        
    router.delete('/:id', user.deleteUser)

    module.exports = router