FROM nginx:1.23.2

COPY dist/rapportinis /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /var/lib/nginx/entrypoint.sh

ENTRYPOINT [ "/var/lib/nginx/entrypoint.sh" ] 

