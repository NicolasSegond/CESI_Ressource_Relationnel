# Utiliser une image PHP avec Apache basée sur PHP 8.1
FROM php:8.1-apache

# Définir l'environnement APP_ENV à prod
ENV APP_ENV prod

# Installer les dépendances nécessaires
RUN apt-get update

# Installer les paquets nécessaires
RUN apt-get install -y \
    libicu-dev \
    git \
    unzip \
    sudo

# Installer les extensions PHP nécessaires
RUN docker-php-ext-install \
    intl \
    pdo_mysql

# Activer le module rewrite d'Apache
RUN a2enmod rewrite

# Créer un utilisateur non root
RUN useradd -ms /bin/bash dockeruse

# Copier les fichiers de l'application Symfony dans le conteneur
COPY . /var/www/html

# Définir le répertoire de travail
WORKDIR /var/www/html

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installer les dépendances PHP avec Composer en mode production
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Installer Symfony Runtime
RUN composer require symfony/runtime

# Remplacer APP_ENV=dev par APP_ENV=prod dans .env
RUN sed -i 's/APP_ENV=dev/APP_ENV=prod/g' .env

# Installer les assets Symfony
RUN php bin/console assets:install --symlink --env=prod

# Configurer les permissions des fichiers de cache et de logs
RUN chown -R www-data:www-data var/

# Configuration d'Apache pour Symfony
COPY apacheCesi.conf /etc/apache2/sites-available/000-default.conf

# Activer les modules Apache nécessaires pour Symfony
RUN a2enmod rewrite headers

# Exposer le port Apache
EXPOSE 80

# Commande par défaut pour lancer Apache quand le conteneur démarre
CMD ["apache2-foreground"]
