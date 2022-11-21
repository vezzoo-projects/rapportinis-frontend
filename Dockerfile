FROM nginx:1.23.2

COPY dist/rapportinis /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
