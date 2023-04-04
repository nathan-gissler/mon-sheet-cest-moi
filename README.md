# Mon sheet c'est moi
Site web permettant d'écrire de la musique sur une partition intéractive.

## Edition de la partition
Sur la page `Ma partition` :
- changer de mode d'édition en appuyant sur `a` (add note) ou `d` (delete note)
- en mode ajout, cliquer sur la portée pour ajouter des notes
- en mode suppression, cliquer sur les notes pour les supprimer

## Sources
[Un exemple Github utilisant Sequelize avec Express](https://github.com/FaisonsLePoint/api_rest_express)


# Ce qui a été fait
- Synchroniser la base de données avec sequelize, la vérifier avec Mysql Workbench.
- Pouvoir créer un user ou vérifier un user (username, password) dans la page login et accéder à la page saves.html avec l'information du user.
- 
# Ce qui pourrait être fait
- Améliorer la présentation des boutons qui se font automatiquement sur saves.html
- Si on crée un utilisateur avec des mdp différents, qu'on ait une interaction meilleure que celle affichée
- faire des token pour mieux gérer la connexion : si un utilisateur revient en arrière, il est oublié dans mon site à l'heure actuelle