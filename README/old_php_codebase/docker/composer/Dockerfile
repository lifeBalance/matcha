FROM composer:2.4

COPY composer.json composer.lock ./

RUN composer install

RUN composer dump-autoload
