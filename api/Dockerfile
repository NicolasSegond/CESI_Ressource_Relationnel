# Utiliser une image PHP avec FPM
FROM php:8.1-fpm

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    locales \
    openssl \
    && docker-php-ext-configure intl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql intl zip gd

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers de l'application
COPY . .

# Définir l'environnement pour autoriser Composer à s'exécuter en tant que root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Installer les dépendances PHP sans les scripts automatiques
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Générer les clés JWT
RUN php bin/console lexik:jwt:generate-keypair --overwrite

# Modifier les permissions
RUN chown -R www-data:www-data /var/www/html/var

# Exposer le port 8000
EXPOSE 8000

# Démarrer Symfony
CMD ["symfony", "serve", "--no-tls"]
