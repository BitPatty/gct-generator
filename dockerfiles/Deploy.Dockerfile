ARG REPOSITORY_TOKEN

FROM mcr.microsoft.com/powershell:latest AS prebuild
WORKDIR /src
COPY . .
RUN pwsh -File ./scripts/build_archives.ps1

FROM node:lts-buster AS build
WORKDIR /src
COPY --from=prebuild /src .
RUN yarn
RUN yarn build

FROM mcr.microsoft.com/powershell:latest AS final
ARG REPOSITORY_TOKEN
ENV REPOSITORY_TOKEN ${REPOSITORY_TOKEN}
WORKDIR /src
RUN apt-get update
RUN apt install -y git
COPY ./scripts/deploy.ps1 ./deploy.ps1
COPY --from=build /src/docs/.vuepress/dist ./dist
CMD [ "pwsh", "deploy.ps1" ]
