
FROM node:current-alpine3.17 AS build
#FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --aot
EXPOSE 4200
CMD ["npm", "start"]
##CMD ["ng", "serve", "--host", "0.0.0.0"]



##ARG DOCKER_HUB="docker.io"
##ARG NGINX_VERSION="1.17.6"
##ARG NODE_VERSION="16.3-alpine"

##FROM $DOCKER_HUB/library/node:$NODE_VERSION as build

##COPY . /workspace/

##ARG NPM_REGISTRY=" https://registry.npmjs.org"

##RUN echo "registry = \"$NPM_REGISTRY\"" > /workspace/.npmrc                              && \
  ##  cd /workspace/                                                                       && \
    ##npm install                                                                          && \
    ##npm run build

##FROM $DOCKER_HUB/library/nginx:$NGINX_VERSION AS runtime

##COPY  --from=build /workspace/dist/ /usr/share/nginx/html/

##RUN chmod a+rwx /var/cache/nginx /var/run /var/log/nginx                        && \
  ##  sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf && \
    ##sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

##EXPOSE 8080

##USER nginx

##HEALTHCHECK     CMD     [ "service", "nginx", "status" ]




### STAGE 1: Build ###
##FROM node:12.7-alpine AS build
##WORKDIR /usr/src/app
##COPY package.json ./
##RUN npm install
##COPY . .
##RUN npm run build

### STAGE 2: Run ###
##FROM nginx:1.17.1-alpine
##COPY default.conf /etc/nginx/conf.d/default.conf
##COPY --from=build /usr/src/app/dist/scrum-ui /usr/share/nginx/html
##EXPOSE 80

