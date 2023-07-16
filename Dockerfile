FROM nginx:stable-alpine3.17

ADD ./config/default.conf /etc/nginx/conf.d/default.conf
COPY . .
EXPOSE 80
CMD [ "nginx","-g","daemon off;" ]