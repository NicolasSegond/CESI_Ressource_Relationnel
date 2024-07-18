# Utilise une image PHP officielle comme image de base
FROM php:8.1-cli

# Installe les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libxml2-dev \
    git \
    unzip \
    zlib1g-dev \
    libicu-dev \
    libpq-dev \
    libsqlite3-dev \
    libonig-dev \
    libmariadb-dev \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Installe les extensions PHP nécessaires
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pdo_sqlite zip intl

# Installe Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installe le Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Crée un utilisateur non-root
RUN useradd -ms /bin/sh myuser

# Définit le répertoire de travail
WORKDIR /var/www/html

# Copie les fichiers du projet dans le conteneur
COPY . /var/www/html

# Change les permissions pour que l'utilisateur puisse modifier les fichiers
RUN chown -R myuser:myuser /var/www/html

# Passe à l'utilisateur non-root
USER myuser

# Crée le répertoire pour les clés JWT et donne les permissions nécessaires
RUN mkdir -p /var/www/html/config/jwt && chmod -R 777 /var/www/html/config

# Installe les dépendances PHP avec Composer (production)
RUN composer install --no-scripts --no-dev --optimize-autoloader

# Génère les clés JWT
RUN php bin/console lexik:jwt:generate-keypair

# Optionnel: Installer les assets
# RUN php bin/console asset:install

# Expose le port pour le serveur Symfony
EXPOSE 8000

# Dépend de la variable d'environnement SERVER pour déterminer le mode de démarrage
ARG SERVER=cli
CMD if [ "$SERVER" = "apache" ]; then \
      apt-get update && apt-get install -y apache2 libapache2-mod-php \
      && a2enmod rewrite \
      && cp apacheCesi.conf /etc/apache2/sites-available/000-default.conf \
      && chown -R www-data:www-data /var/www/html \
      && chmod -R 755 /var/www/html \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/* \
      && apachectl -D FOREGROUND; \
    else \
      symfony server:start --no-tls --port=8000; \
    fi
