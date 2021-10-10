FROM mcr.microsoft.com/powershell:latest AS prebuild
WORKDIR /src
COPY . .
RUN pwsh -File ./scripts/build_archives.ps1

FROM node:lts-buster AS build
WORKDIR /src
COPY --from=prebuild /src .
RUN npm i
RUN npm run build

FROM mcr.microsoft.com/powershell:latest AS final
WORKDIR /src
RUN apt-get update
RUN apt install -y git
COPY ./scripts/deploy.ps1 ./deploy.ps1
COPY --from=build /src/site/.vuepress/dist ./dist
CMD [ "pwsh", "deploy.ps1" ]
