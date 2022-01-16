#!/bin/bash

set -e
nvm install
nvm use
nvm alias  default $(node --version)
nvm install-latest-npm
npm i