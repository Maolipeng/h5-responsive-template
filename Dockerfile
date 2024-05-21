FROM nginx:1.24.0
COPY  dist/ /opt/quiz-fe
COPY /nginx/nginx.conf.template /

ENV PROXY_PASS ""

CMD envsubst '$PROXY_PASS' < /nginx.conf.template > /etc/nginx/nginx.conf && \
  cat /etc/nginx/nginx.conf && nginx -g 'daemon off;'
