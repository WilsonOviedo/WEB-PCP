FROM nginx:alpine

# Sitio estático
COPY . /usr/share/nginx/html

# Config nginx (URLs limpias + X-Robots-Tag)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
