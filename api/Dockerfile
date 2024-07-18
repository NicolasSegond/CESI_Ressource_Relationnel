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

# Installe les dépendances PHP avec Composer
RUN composer install --no-scripts

# Génère les clés JWT
RUN php bin/console lexik:jwt:generate-keypair

# Note: La configuration conditionnelle de Apache est effectuée après avoir changé l'utilisateur en root
USER root

# Installe Apache seulement si le serveur est défini comme apache
RUN if [ "$SERVER" = "apache" ]; then \
    apt-get update && apt-get install -y apache2 libapache2-mod-php \
    && a2enmod rewrite \
    && cp apacheCesi.conf /etc/apache2/sites-available/000-default.conf \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*; \
    fi

# Retourne à l'utilisateur non-root
USER myuser

# Expose le port pour le serveur Symfony
EXPOSE 8000

# Commande par défaut (peut être écrasée par des arguments de Docker run)
CMD ["symfony", "server:start", "--no-tls", "--port=8000"]
