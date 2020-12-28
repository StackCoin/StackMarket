FROM node:14-alpine as buildstep

WORKDIR /app
COPY yarn.lock ./
COPY package.json ./
RUN yarn install
COPY . /app
RUN npm run build

FROM nginx:1-alpine
RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=buildstep /app/build /usr/share/nginx/html
RUN pwd
RUN cp /usr/share/nginx/html/index.html /index.template.html
EXPOSE 80
CMD ["dockerize", "-template", "/index.template.html:/usr/share/nginx/html/index.html", "-stdout", "/dev/stdout", "-stderr", "/dev/stderr", "nginx"]

