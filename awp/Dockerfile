# Utilise l'image officielle Node.js comme image de base pour la constructions
FROM node:18 AS build

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installe les dépendances de l'application
RUN npm install

# Copie le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Compile l'application pour la production
RUN npm run build

# Utilise l'image officielle Apache pour servir le contenu de l'application
FROM httpd:alpine

# Copie les fichiers compilés depuis l'étape de build vers le répertoire de contenu statique d'Apache
COPY --from=build /app/build /usr/local/apache2/htdocs/

# Copie le fichier de configuration du Virtual Host Apache
COPY myapp.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf

# Inclut le fichier de configuration du Virtual Host dans le fichier httpd.conf principal
RUN echo "Include /usr/local/apache2/conf/extra/httpd-vhosts.conf" >> /usr/local/apache2/conf/httpd.conf

# Expose le port sur lequel Apache écoutera
EXPOSE 3040

# Démarre Apache
CMD ["httpd-foreground"]
