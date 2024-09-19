# Utilise l'image officielle Node.js 18 comme image de base
FROM node:18

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tous les fichiers du projet dans le répertoire de travail du conteneur
COPY . .

# Expose le port sur lequel l'application écoutera (par exemple 3000)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
