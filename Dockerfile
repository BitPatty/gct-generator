FROM node:lts-buster AS build
WORKDIR /src
COPY . .
RUN yarn
RUN yarn build

FROM httpd:latest AS final
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /src/docs/.vuepress/dist .

EXPOSE 80
CMD ["httpd-foreground"]