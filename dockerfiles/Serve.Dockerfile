FROM mcr.microsoft.com/powershell:latest AS prebuild
WORKDIR /src
COPY . .
RUN pwsh -File ./scripts/build_archives.ps1

FROM node:lts-buster AS build
WORKDIR /src
COPY --from=prebuild /src .
RUN npm i
RUN npm run build

FROM httpd:latest AS final
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /src/site/.vuepress/dist .

EXPOSE 80
CMD ["httpd-foreground"]