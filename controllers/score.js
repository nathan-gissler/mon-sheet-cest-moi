/*** Import des module nécessaires */
const DB = require('../db.config')
const Score = DB.Score
const User = DB.User

/**************************************/
/*** Routage de la ressource Score */

exports.getAllScores = (req, res) => {
    Score.findAll({paranoid: false})
        .then(scores => res.json({ data: scores }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getScore = async (req, res) => {
    let scoreId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!scoreId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try {
        // Récupération de la partition
        let score = await Score.findOne({ where: { id: scoreId } })

        // Test si résultat
        if (score === null) {
            return res.status(404).json({ message: 'This score does not exist !' })
        }

        // Renvoi de la partition trouvée
        return res.json({ data: score })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.addScore = async (req, res) => {
    const { name, userId, json } = req.body

    // Validation des données reçues
    if ( !name || !userId || !json ) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try{
        // Vérification si la partition exite
        let score = await Score.findOne({ where: { name: name }, raw: true })
        if (score !== null) {
            return res.status(409).json({ message: `La partition ${name} exite déjà !` })
        }
        
        const jsonString = JSON.stringify(json)

        // Création de la partition
        score = await Score.create({ name, userId: userId, json: jsonString })
        return res.json({ message: 'Partition créée', data: score })
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.updateScore = async (req, res) => {
    let scoreId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!scoreId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche de la partition et vérification
        let score = await Score.findOne({ where: { id: scoreId }, raw: true })
        if (score === null) {
            return res.status(404).json({ message: 'Cette partition n\'existe pas!' })
        }

        // Mise à jour du score
        await Score.update(req.body, { where: { id: scoreId } })
        return res.json({ message: 'Partition mise à jour' })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.untrashScore = (req, res) => {
    let scoreId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!scoreId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    Score.restore({ where: { id: scoreId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.trashScore = (req, res) => {
    let scoreId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!scoreId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de la partition
    Score.destroy({ where: { id: scoreId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.deleteScore = (req, res) => {
    let scoreId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!scoreId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de la partition
    Score.destroy({ where: { id: scoreId }, force: true })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}