FROM nginx:1.23.2

COPY dist/rapportinis /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /etc/nginx/entrypoint.sh

RUN chmod +x /etc/nginx/entrypoint.sh

# ENTRYPOINT [ "/etc/nginx/entrypoint.sh" ] 
