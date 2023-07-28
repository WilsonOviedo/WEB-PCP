FROM nginx

COPY . /usr/share/nginx/html

RUN set -x ; \
  addgroup -g 82 -S www-data ; \
  adduser -u 82 -D -S -G www-data www-data && exit 0 ; exit 1

RUN chown -R www-data:www-data /usr/share/nginx/html/*
RUN chmod -R 777 /usr/share/nginx/html/*

EXPOSE 80