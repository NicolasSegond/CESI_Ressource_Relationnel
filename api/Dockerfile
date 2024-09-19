FROM php:8.1-cli

# Install system dependencies
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

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pdo_sqlite zip intl

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Create a non-root user
RUN useradd -ms /bin/sh myuser

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . /var/www/html

# Copy the Apache configuration file
COPY apacheCesi.conf /etc/apache2/sites-available/000-default.conf

# Set file permissions for bin/console
RUN chmod +x /var/www/html/bin/console

# Change file permissions
RUN chown -R myuser:myuser /var/www/html

# Switch to non-root user
USER myuser

# Install Composer dependencies (including dev dependencies)
RUN composer install --no-scripts --optimize-autoloader
RUN bin/console asset:install

# Generate JWT keys
RUN php bin/console lexik:jwt:generate-keypair

# Expose port
EXPOSE 3030

# CMD to start the application
ARG SERVER=cli
CMD if [ "$SERVER" = "apache" ]; then \
      apt-get update && apt-get install -y apache2 libapache2-mod-php \
      && a2enmod rewrite \
      && chown -R www-data:www-data /var/www/html \
      && chmod -R 755 /var/www/html \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/* \
      && apachectl -D FOREGROUND; \
    else \
      symfony server:start --no-tls --port=3030; \
    fi
