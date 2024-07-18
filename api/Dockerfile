# Utiliser une image PHP avec Apache basée sur PHP 8.1
FROM php:8.1-apache

# Installer les dépendances nécessaires
RUN apt-get update \
    && apt-get install -y \
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

# Installer Composer en tant que root
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Créer un utilisateur non root
RUN useradd -ms /bin/bash dockeruse

# Copier les fichiers de l'application Symfony dans le conteneur
COPY . /var/www/html

# Définir le répertoire de travail
WORKDIR /var/www/html

# Définir les permissions pour l'utilisateur non root
RUN chown -R dockeruse:dockeruse /var/www/html

# Changer l'utilisateur courant pour dockeruse
USER dockeruse

# Installer les dépendances PHP avec Composer en mode développement
RUN composer install --no-interaction

# Assurer l'autoload de Composer
RUN composer dump-autoload

# Installer Symfony Runtime
RUN composer require symfony/runtime

# Installer Foundry en mode développement et test
RUN composer require --dev zenstruck/foundry

# Revenir à l'utilisateur root pour les étapes de configuration d'Apache
USER root

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
