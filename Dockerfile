FROM nginx:1.23.2

COPY dist/ /var/lib/www/html
VOLUME nginx/default.conf /etc/nginx/default.conf
