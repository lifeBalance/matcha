FROM php:8.0-apache

USER root

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Helsinki

RUN apt-get update && apt-get install -q -y                                     \
    openssl                                                                     \
    && docker-php-ext-install pdo pdo_mysql                                     \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048                      \
        -keyout /etc/ssl/private/ssl-cert-snakeoil.key                          \
        -out /etc/ssl/certs/ssl-cert-snakeoil.pem                               \
        -subj "/C=AT/ST=Helsinki/L=Helsinki/O=Security/OU=Development/CN=localhost" \
    && chmod 777 /tmp                                                           \
    && chmod a+r /etc/ssl/private/ssl-cert-snakeoil.key                         \
    && chmod a+rx /etc/ssl/private                                              \
    && a2enmod rewrite                                                          \
    && a2ensite default-ssl                                                     \
    && a2enmod ssl

