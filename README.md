![Groupomania](https://repository-images.githubusercontent.com/464880164/ef82ac37-4c94-41a3-82da-5289d07388af)

# Démarrer l'API Groupomania

Cloner le repo avec le lien suivant [GitHub Groupomania API](https://github.com/yanncls/backend_groupomania.git)

Exécuter la commande `npm init` pour initialiser et donner comme point d'entrée ici `server.js`

Exécuter ensuite la commande `npm install` pour installer toutes les dépendances de l'API

Créer un fichier .env contenant l'url du serveur MongoDB ayant pour nom `MONGO_DB="votre_database"`
Ajouter une clé secrète pour authentifier les token ayant pour nom `ACCESS_TOKEN_SECRET="votre_cle_screte"`

Démarrer le server avec la commande `node server`
ou `nodemon server`

L'API utilise l'adresse et le port `http://localhost:8081`

# Dépendance de l'API

- bcrypt
- dotenv
- cors
- express
- file-system
- jwt
- mongoose
- mongoose unique validator
- nodemon
- path
- multer
