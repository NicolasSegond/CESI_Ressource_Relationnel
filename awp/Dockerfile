# Utilise l'image officielle Node.js comme image de base
FROM node:18 AS build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie les fichiers de l'application
COPY . .

# Exécute le build de l'application (si nécessaire)
RUN npm run build

# Expose le port sur lequel ton application Node.js écoute (3040 dans ton cas)
EXPOSE 3040

# Commande de démarrage de l'application (en supposant que "npm start" démarre le serveur)
CMD ["npm", "start"]
