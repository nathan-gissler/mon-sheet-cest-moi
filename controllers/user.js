/*** Import des module nécessaires */
const db = require('../db.config.js');
const User = db.User
const bcrypt = require('bcrypt')
/*** Routage de la ressource User */

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getUser = async (req, res) => {
    const { username, password } = req.body
  
    // Vérification si le champ username est présent et cohérent
    if (!username) {
      return res.status(400).json({ message: 'Missing Parameter' })
    }
  
    try {
      const user = await User.findOne({ where: { username }, attributes: ['username', 'id', 'password'] })
  
      if (!user) {
        return res.status(404).json({ message: 'This user does not exist !' })
      }
  
      // Comparaison des mots de passe
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(401).json({ message: 'Invalid password' })
      }
  
      return res.redirect(`../static/postlogin.html?id=${user.id}`)
    } catch (err) {
      return res.status(500).json({ message: 'Database Error', error: err })
    }
  }

exports.addUser = async (req, res) => {
    const { username, password, password2 } = req.body

    // Validation des données reçues
    if (!username || !password || password !== password2) {
        return res.status(400).json({ message: 'Missing or incorrect data' })
    }

    try{
        // Vérification si l'utilisateur existe déjà
        const user = await User.findOne({ where: { username: username }, raw: true })
        if (user !== null) {
            return res.status(409).json({ message: `L'utilisateur ${username} existe déjà !` })
        }

        // Création de l'utilisateur
        let userc = await User.create({username: username, password: password})
        
        return res.redirect('../static/postlogin.html?id=${user.id}') // redirection vers la page index.html

    }catch(err){
        console.error(err); // Affiche l'erreur dans la console pour le débogage
        return res.status(500).json({ message: 'Error', error: err.message })
    }
}


exports.updateUser = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: {id: userId}, raw: true})
        if(user === null){
            return res.status(404).json({ message: 'This user does not exist !'})
        }

        // Mise à jour de l'utilisateur
        await User.update(req.body, { where: {id: userId}})
        return res.json({ message: 'User Updated'})
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.untrashUser =  (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    
    User.restore({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.trashUser = (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.deleteUser =  (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}